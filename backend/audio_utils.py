"""
Audio Processing Utilities para el Sistema de Subida de Audio
Maneja procesamiento, validación y extracción de metadata de archivos de audio
"""

import os
import tempfile
import uuid
from datetime import datetime
from pathlib import Path
from typing import Tuple, Dict, List, Optional
import logging
import re

try:
    from pydub import AudioSegment
    from pydub.utils import which
    import librosa
    import soundfile as sf
    import numpy as np
except ImportError as e:
    print(f"Warning: Audio processing libraries not available: {e}")
    print("Install with: pip install pydub librosa soundfile")

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuraciones globales
MAX_DURATION = 60  # Máximo 60 segundos
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
SUPPORTED_FORMATS = ['mp3', 'm4a', 'wav', 'aac', 'flac', 'ogg']
TARGET_BITRATE = "128k"  # Bitrate objetivo para optimización
TARGET_SAMPLE_RATE = 44100  # Sample rate objetivo

class AudioProcessingError(Exception):
    """Custom exception for audio processing errors"""
    pass

def get_ffmpeg_path():
    """Get ffmpeg path"""
    ffmpeg_path = which("ffmpeg")
    if not ffmpeg_path:
        # Try common paths
        common_paths = ['/usr/bin/ffmpeg', '/usr/local/bin/ffmpeg']
        for path in common_paths:
            if os.path.exists(path):
                return path
        raise AudioProcessingError("ffmpeg not found. Please install ffmpeg.")
    return ffmpeg_path

def validate_audio_file(file_path: str, original_filename: str) -> Dict:
    """
    Valida un archivo de audio y extrae información básica
    
    Returns:
        Dict con información del archivo o lanza AudioProcessingError
    """
    try:
        # Verificar que el archivo existe
        if not os.path.exists(file_path):
            raise AudioProcessingError(f"File not found: {file_path}")
        
        # Verificar tamaño del archivo
        file_size = os.path.getsize(file_path)
        if file_size > MAX_FILE_SIZE:
            raise AudioProcessingError(f"File too large: {file_size / (1024*1024):.1f}MB. Max: {MAX_FILE_SIZE / (1024*1024)}MB")
        
        # Obtener extensión del archivo
        file_extension = Path(original_filename).suffix.lower().lstrip('.')
        if file_extension not in SUPPORTED_FORMATS:
            raise AudioProcessingError(f"Unsupported format: {file_extension}. Supported: {', '.join(SUPPORTED_FORMATS)}")
        
        # Intentar cargar el archivo con pydub para validación básica
        try:
            audio = AudioSegment.from_file(file_path)
        except Exception as e:
            raise AudioProcessingError(f"Invalid audio file: {str(e)}")
        
        # Obtener información básica del audio
        duration_seconds = len(audio) / 1000.0
        sample_rate = audio.frame_rate
        channels = audio.channels
        
        # Verificar duración
        if duration_seconds > MAX_DURATION:
            logger.info(f"Audio duration {duration_seconds:.1f}s exceeds max {MAX_DURATION}s, will be trimmed")
        
        return {
            'duration': duration_seconds,
            'sample_rate': sample_rate,
            'channels': channels,
            'file_size': file_size,
            'file_format': file_extension,
            'is_valid': True
        }
        
    except AudioProcessingError:
        raise
    except Exception as e:
        raise AudioProcessingError(f"Error validating audio file: {str(e)}")

def process_audio_file(
    input_path: str, 
    output_dir: str, 
    target_filename: str,
    max_duration: int = MAX_DURATION
) -> Dict:
    """
    Procesa un archivo de audio:
    - Recorta a máximo 60 segundos si es necesario
    - Optimiza bitrate y sample rate
    - Genera waveform para visualización
    - Guarda archivo procesado
    
    Returns:
        Dict con información del archivo procesado
    """
    try:
        # Crear directorio de salida si no existe
        os.makedirs(output_dir, exist_ok=True)
        
        # Cargar audio
        audio = AudioSegment.from_file(input_path)
        
        # Recortar si excede duración máxima
        duration_ms = len(audio)
        if duration_ms > max_duration * 1000:
            logger.info(f"Trimming audio from {duration_ms/1000:.1f}s to {max_duration}s")
            audio = audio[:max_duration * 1000]  # Tomar solo los primeros N segundos
        
        # Optimizar audio para web
        # Convertir a mono si es stereo (opcional)
        if audio.channels > 1:
            # Mantener stereo para mejor calidad, pero podemos convertir a mono si necesario
            # audio = audio.set_channels(1)
            pass
        
        # Ajustar sample rate si es muy alto
        if audio.frame_rate > TARGET_SAMPLE_RATE:
            audio = audio.set_frame_rate(TARGET_SAMPLE_RATE)
        
        # Generar nombre de archivo de salida
        output_path = os.path.join(output_dir, f"{target_filename}.mp3")
        
        # Exportar como MP3 optimizado para web
        audio.export(
            output_path,
            format="mp3",
            bitrate=TARGET_BITRATE,
            parameters=["-q:a", "2"]  # Calidad VBR
        )
        
        # Generar waveform
        waveform = generate_waveform(output_path)
        
        # Obtener información final del archivo
        final_file_size = os.path.getsize(output_path)
        final_duration = len(audio) / 1000.0
        
        return {
            'processed_path': output_path,
            'filename': f"{target_filename}.mp3",
            'duration': final_duration,
            'file_size': final_file_size,
            'sample_rate': audio.frame_rate,
            'channels': audio.channels,
            'bitrate': TARGET_BITRATE,
            'waveform': waveform,
            'format': 'mp3'
        }
        
    except Exception as e:
        raise AudioProcessingError(f"Error processing audio file: {str(e)}")

def generate_waveform(audio_path: str, num_points: int = 20) -> List[float]:
    """
    Genera datos de waveform para visualización
    
    Args:
        audio_path: Ruta del archivo de audio
        num_points: Número de puntos en el waveform
    
    Returns:
        Lista de valores normalizados entre 0 y 1
    """
    try:
        # Cargar audio con librosa
        y, sr = librosa.load(audio_path, sr=None)
        
        # Calcular la amplitud RMS en segmentos
        hop_length = len(y) // num_points
        
        if hop_length == 0:
            # Audio muy corto, devolver valores por defecto
            return [0.5] * num_points
        
        waveform_values = []
        for i in range(0, len(y), hop_length):
            segment = y[i:i + hop_length]
            if len(segment) > 0:
                rms = np.sqrt(np.mean(segment**2))
                waveform_values.append(float(rms))
        
        # Normalizar valores entre 0.1 y 1.0 para visualización
        if waveform_values:
            max_val = max(waveform_values)
            min_val = min(waveform_values)
            
            if max_val > min_val:
                normalized = [(val - min_val) / (max_val - min_val) * 0.9 + 0.1 for val in waveform_values]
            else:
                normalized = [0.5] * len(waveform_values)
        else:
            normalized = [0.5] * num_points
        
        # Ajustar a exactamente num_points
        if len(normalized) > num_points:
            # Tomar muestras uniformes
            indices = np.linspace(0, len(normalized)-1, num_points, dtype=int)
            normalized = [normalized[i] for i in indices]
        elif len(normalized) < num_points:
            # Interpolar para llenar
            normalized = normalized + [normalized[-1]] * (num_points - len(normalized))
        
        return normalized[:num_points]
        
    except Exception as e:
        logger.error(f"Error generating waveform: {e}")
        # Devolver waveform por defecto
        return [0.3, 0.7, 0.5, 0.8, 0.4, 0.9, 0.6, 0.7, 0.5, 0.8, 0.3, 0.6, 0.9, 0.4, 0.7, 0.5, 0.8, 0.6, 0.4, 0.7]

def extract_audio_metadata(audio_path: str) -> Dict:
    """
    Extrae metadata completa del archivo de audio
    
    Returns:
        Dict con metadata del archivo
    """
    try:
        audio = AudioSegment.from_file(audio_path)
        
        metadata = {
            'duration': len(audio) / 1000.0,
            'sample_rate': audio.frame_rate,
            'channels': audio.channels,
            'file_size': os.path.getsize(audio_path),
            'bitrate': getattr(audio, 'bitrate', None),
            'format': Path(audio_path).suffix.lower().lstrip('.')
        }
        
        return metadata
        
    except Exception as e:
        logger.error(f"Error extracting metadata: {e}")
        return {}

def cleanup_temp_files(*file_paths):
    """
    Limpia archivos temporales
    """
    for file_path in file_paths:
        try:
            if file_path and os.path.exists(file_path):
                os.remove(file_path)
                logger.debug(f"Cleaned up temp file: {file_path}")
        except Exception as e:
            logger.warning(f"Could not cleanup temp file {file_path}: {e}")

def get_unique_filename(user_id: str, original_filename: str) -> str:
    """
    Genera un nombre de archivo único para el audio del usuario
    """
    timestamp = str(int(datetime.now().timestamp()))
    unique_id = str(uuid.uuid4())[:8]
    base_name = Path(original_filename).stem[:20]  # Limitar longitud
    
    # Sanitizar nombre
    base_name = re.sub(r'[^\w\s-]', '', base_name).strip()
    base_name = re.sub(r'[-\s]+', '_', base_name)
    
    return f"audio_{user_id}_{timestamp}_{unique_id}_{base_name}"

# Test function
def test_audio_processing():
    """
    Función de prueba para verificar que las dependencias funcionan
    """
    try:
        # Crear un audio de prueba silencioso
        test_audio = AudioSegment.silent(duration=1000)  # 1 segundo
        
        with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as tmp_file:
            test_audio.export(tmp_file.name, format='mp3')
            
            # Probar validación
            metadata = validate_audio_file(tmp_file.name, 'test.mp3')
            print(f"✅ Audio validation works: {metadata}")
            
            # Probar waveform
            waveform = generate_waveform(tmp_file.name)
            print(f"✅ Waveform generation works: {len(waveform)} points")
            
            cleanup_temp_files(tmp_file.name)
            
        return True
        
    except Exception as e:
        print(f"❌ Audio processing test failed: {e}")
        return False

if __name__ == "__main__":
    # Ejecutar test si se ejecuta directamente
    test_audio_processing()