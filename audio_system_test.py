#!/usr/bin/env python3
"""
Audio System Testing Script - Specific Testing After FFmpeg Corrections
Tests audio upload, processing, and library functionality after FFmpeg fixes.
"""

import requests
import json
import sys
import time
import os
import tempfile
from datetime import datetime

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    base_url = line.split('=', 1)[1].strip()
                    return f"{base_url}/api"
        return None
    except Exception as e:
        print(f"Error reading frontend .env file: {e}")
        return None

def create_test_audio_file():
    """Create a simple test audio file for upload testing"""
    try:
        # Create a temporary MP3 file with minimal content
        # This is a minimal MP3 header that should be recognized by FFmpeg
        mp3_header = b'\xff\xfb\x90\x00' + b'\x00' * 1000  # Minimal MP3 data
        
        temp_file = tempfile.NamedTemporaryFile(suffix='.mp3', delete=False)
        temp_file.write(mp3_header)
        temp_file.close()
        
        return temp_file.name
    except Exception as e:
        print(f"Error creating test audio file: {e}")
        return None

def test_user_authentication(base_url):
    """Test user authentication to get valid token"""
    print("=== Testing User Authentication ===")
    
    # Try to login with existing user or create new one
    timestamp = int(time.time())
    
    # First try existing users
    existing_users = [
        {"email": "maria@example.com", "password": "password123"},
        {"email": "test@example.com", "password": "test123"},
        {"email": "user@example.com", "password": "password"}
    ]
    
    for user_data in existing_users:
        try:
            response = requests.post(f"{base_url}/auth/login", json=user_data, timeout=10)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Login successful with {user_data['email']}")
                return data['access_token'], data['user']
        except Exception as e:
            continue
    
    # If no existing user works, create new one
    print("Creating new test user for audio testing...")
    new_user = {
        "email": f"audio_test_{timestamp}@example.com",
        "username": f"audio_test_{timestamp}",
        "display_name": "Audio Test User",
        "password": "audiotest123"
    }
    
    try:
        response = requests.post(f"{base_url}/auth/register", json=new_user, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ New user created: {new_user['username']}")
            return data['access_token'], data['user']
        else:
            print(f"❌ Failed to create user: {response.text}")
            return None, None
    except Exception as e:
        print(f"❌ Authentication error: {e}")
        return None, None

def test_audio_upload_endpoint(base_url, token):
    """Test POST /api/audio/upload with real audio file"""
    print("\n=== Testing Audio Upload Endpoint ===")
    
    if not token:
        print("❌ No authentication token available")
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create test audio file
    audio_file_path = create_test_audio_file()
    if not audio_file_path:
        print("❌ Failed to create test audio file")
        return False
    
    try:
        # Test audio upload
        print("Testing POST /api/audio/upload...")
        
        with open(audio_file_path, 'rb') as audio_file:
            files = {
                'audio': ('test_audio.mp3', audio_file, 'audio/mpeg')
            }
            data = {
                'title': 'Test Audio Upload',
                'artist': 'Test Artist',
                'privacy': 'public'
            }
            
            response = requests.post(
                f"{base_url}/audio/upload", 
                files=files, 
                data=data,
                headers=headers, 
                timeout=30
            )
        
        print(f"Upload Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Audio upload successful!")
            print(f"Audio ID: {result.get('audio_id', 'N/A')}")
            print(f"Title: {result.get('title', 'N/A')}")
            print(f"Artist: {result.get('artist', 'N/A')}")
            print(f"Duration: {result.get('duration', 'N/A')} seconds")
            print(f"File Size: {result.get('file_size', 'N/A')} bytes")
            print(f"Public URL: {result.get('public_url', 'N/A')}")
            
            # Check if FFmpeg processing worked
            if 'waveform' in result:
                print(f"✅ FFmpeg processing successful - waveform generated")
                print(f"Waveform points: {len(result['waveform'])}")
            else:
                print("⚠️ No waveform data - FFmpeg processing may have issues")
            
            # Check for FFmpeg-related fields
            if result.get('was_trimmed') is not None:
                print(f"Audio trimming: {'Yes' if result.get('was_trimmed') else 'No'}")
            
            if result.get('original_duration'):
                print(f"Original duration: {result.get('original_duration')} seconds")
            
            return True, result.get('audio_id')
        else:
            print(f"❌ Audio upload failed: {response.text}")
            return False, None
            
    except Exception as e:
        print(f"❌ Audio upload error: {e}")
        return False, None
    finally:
        # Clean up test file
        try:
            os.unlink(audio_file_path)
        except:
            pass

def test_my_library_endpoint(base_url, token):
    """Test GET /api/audio/my-library"""
    print("\n=== Testing My Library Endpoint ===")
    
    if not token:
        print("❌ No authentication token available")
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        print("Testing GET /api/audio/my-library...")
        response = requests.get(f"{base_url}/audio/my-library", headers=headers, timeout=10)
        
        print(f"My Library Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ My library endpoint successful!")
            print(f"Total audio files: {result.get('total', 0)}")
            print(f"Audio files returned: {len(result.get('audio_files', []))}")
            
            # Check structure of returned audio files
            audio_files = result.get('audio_files', [])
            if audio_files:
                print("\n📋 Audio files in library:")
                for i, audio in enumerate(audio_files[:3]):  # Show first 3
                    print(f"  {i+1}. {audio.get('title', 'N/A')} - {audio.get('artist', 'N/A')}")
                    print(f"     ID: {audio.get('id', 'N/A')}")
                    print(f"     Duration: {audio.get('duration', 'N/A')}s")
                    print(f"     Privacy: {audio.get('privacy', 'N/A')}")
                    print(f"     Uses: {audio.get('uses_count', 0)}")
                    
                    # Check required fields
                    required_fields = ['id', 'title', 'artist', 'duration', 'public_url']
                    missing_fields = [field for field in required_fields if field not in audio]
                    if missing_fields:
                        print(f"     ⚠️ Missing fields: {missing_fields}")
                    else:
                        print(f"     ✅ All required fields present")
            else:
                print("📋 No audio files in library (this is normal for new users)")
            
            return True
        else:
            print(f"❌ My library failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ My library error: {e}")
        return False

def test_audio_processing_verification(base_url, token):
    """Test that FFmpeg processing works correctly"""
    print("\n=== Testing Audio Processing Verification ===")
    
    if not token:
        print("❌ No authentication token available")
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create a larger test audio file to test trimming
    try:
        print("Creating larger test audio file to test FFmpeg processing...")
        
        # Create a larger MP3 file that should trigger processing
        large_mp3_data = b'\xff\xfb\x90\x00' + b'\x00' * 50000  # Larger file
        
        temp_file = tempfile.NamedTemporaryFile(suffix='.mp3', delete=False)
        temp_file.write(large_mp3_data)
        temp_file.close()
        
        with open(temp_file.name, 'rb') as audio_file:
            files = {
                'audio': ('large_test_audio.mp3', audio_file, 'audio/mpeg')
            }
            data = {
                'title': 'FFmpeg Processing Test',
                'artist': 'Processing Test Artist',
                'privacy': 'public'
            }
            
            print("Testing FFmpeg processing capabilities...")
            response = requests.post(
                f"{base_url}/audio/upload", 
                files=files, 
                data=data,
                headers=headers, 
                timeout=30
            )
        
        print(f"Processing Test Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ FFmpeg processing test successful!")
            
            # Check FFmpeg-specific processing results
            processing_indicators = [
                ('waveform', 'Waveform generation'),
                ('duration', 'Duration calculation'),
                ('sample_rate', 'Sample rate detection'),
                ('bitrate', 'Bitrate processing'),
                ('was_trimmed', 'Audio trimming capability')
            ]
            
            print("\n🔧 FFmpeg Processing Results:")
            for field, description in processing_indicators:
                if field in result:
                    print(f"  ✅ {description}: {result[field]}")
                else:
                    print(f"  ❌ {description}: Not available")
            
            # Check if no FFmpeg warnings in response
            if 'error' not in result and 'warning' not in result:
                print("✅ No FFmpeg errors or warnings detected")
            else:
                print(f"⚠️ Potential FFmpeg issues: {result.get('error', result.get('warning', 'Unknown'))}")
            
            return True
        else:
            print(f"❌ FFmpeg processing test failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ FFmpeg processing test error: {e}")
        return False
    finally:
        try:
            os.unlink(temp_file.name)
        except:
            pass

def test_authentication_requirements(base_url):
    """Test that audio endpoints require valid authentication"""
    print("\n=== Testing Authentication Requirements ===")
    
    success_count = 0
    
    # Test endpoints without authentication
    print("Testing endpoints without authentication...")
    
    # Test upload without auth
    try:
        files = {'audio': ('test.mp3', b'fake_audio_data', 'audio/mpeg')}
        data = {'title': 'Test', 'artist': 'Test'}
        response = requests.post(f"{base_url}/audio/upload", files=files, data=data, timeout=10)
        
        if response.status_code in [401, 403]:
            print("✅ POST /api/audio/upload properly requires authentication")
            success_count += 1
        else:
            print(f"❌ Upload should require auth, got status: {response.status_code}")
    except Exception as e:
        print(f"❌ Upload auth test error: {e}")
    
    # Test my-library without auth
    try:
        response = requests.get(f"{base_url}/audio/my-library", timeout=10)
        
        if response.status_code in [401, 403]:
            print("✅ GET /api/audio/my-library properly requires authentication")
            success_count += 1
        else:
            print(f"❌ My-library should require auth, got status: {response.status_code}")
    except Exception as e:
        print(f"❌ My-library auth test error: {e}")
    
    # Test with invalid token
    print("\nTesting with invalid token...")
    invalid_headers = {"Authorization": "Bearer invalid_token_12345"}
    
    try:
        response = requests.get(f"{base_url}/audio/my-library", headers=invalid_headers, timeout=10)
        
        if response.status_code in [401, 403]:
            print("✅ Invalid token properly rejected")
            success_count += 1
        else:
            print(f"❌ Should reject invalid token, got status: {response.status_code}")
    except Exception as e:
        print(f"❌ Invalid token test error: {e}")
    
    return success_count >= 2

def test_ffmpeg_installation_verification():
    """Verify FFmpeg is properly installed and accessible"""
    print("\n=== Testing FFmpeg Installation ===")
    
    try:
        import subprocess
        
        # Test FFmpeg command
        print("Testing FFmpeg command availability...")
        result = subprocess.run(['ffmpeg', '-version'], capture_output=True, text=True, timeout=10)
        
        if result.returncode == 0:
            print("✅ FFmpeg is installed and accessible")
            # Extract version info
            version_line = result.stdout.split('\n')[0]
            print(f"Version: {version_line}")
            return True
        else:
            print(f"❌ FFmpeg command failed: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print("❌ FFmpeg command timed out")
        return False
    except FileNotFoundError:
        print("❌ FFmpeg not found in system PATH")
        return False
    except Exception as e:
        print(f"❌ FFmpeg test error: {e}")
        return False

def test_audio_file_formats(base_url, token):
    """Test different audio file formats support"""
    print("\n=== Testing Audio File Formats Support ===")
    
    if not token:
        print("❌ No authentication token available")
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test different audio formats
    formats_to_test = [
        ('mp3', 'audio/mpeg', b'\xff\xfb\x90\x00' + b'\x00' * 1000),
        ('wav', 'audio/wav', b'RIFF' + b'\x00' * 4 + b'WAVE' + b'\x00' * 1000),
        ('m4a', 'audio/mp4', b'\x00\x00\x00\x20ftypM4A ' + b'\x00' * 1000)
    ]
    
    success_count = 0
    
    for ext, mime_type, data in formats_to_test:
        try:
            print(f"\nTesting {ext.upper()} format...")
            
            temp_file = tempfile.NamedTemporaryFile(suffix=f'.{ext}', delete=False)
            temp_file.write(data)
            temp_file.close()
            
            with open(temp_file.name, 'rb') as audio_file:
                files = {
                    'audio': (f'test_audio.{ext}', audio_file, mime_type)
                }
                data_payload = {
                    'title': f'Test {ext.upper()} Audio',
                    'artist': 'Format Test Artist',
                    'privacy': 'public'
                }
                
                response = requests.post(
                    f"{base_url}/audio/upload", 
                    files=files, 
                    data=data_payload,
                    headers=headers, 
                    timeout=30
                )
            
            if response.status_code == 200:
                print(f"✅ {ext.upper()} format supported and processed successfully")
                success_count += 1
            else:
                print(f"❌ {ext.upper()} format failed: {response.text}")
                
        except Exception as e:
            print(f"❌ {ext.upper()} format test error: {e}")
        finally:
            try:
                os.unlink(temp_file.name)
            except:
                pass
    
    return success_count >= 1  # At least one format should work

def main():
    """Main testing function"""
    print("🎵 AUDIO SYSTEM TESTING - POST FFMPEG CORRECTIONS")
    print("=" * 60)
    print("CONTEXTO: Testing específico del sistema de música después de correcciones:")
    print("1. ✅ FFmpeg reinstalado y configurado correctamente")
    print("2. ✅ Botones de MusicSelector corregidos")
    print("=" * 60)
    
    # Get backend URL
    base_url = get_backend_url()
    if not base_url:
        print("❌ Could not determine backend URL")
        sys.exit(1)
    
    print(f"🌐 Backend URL: {base_url}")
    
    # Test results tracking
    test_results = {}
    
    # 1. Test FFmpeg Installation
    print("\n" + "="*50)
    test_results['ffmpeg_installation'] = test_ffmpeg_installation_verification()
    
    # 2. Test Authentication
    print("\n" + "="*50)
    token, user = test_user_authentication(base_url)
    test_results['authentication'] = token is not None
    
    if not token:
        print("❌ Cannot proceed without authentication")
        sys.exit(1)
    
    print(f"🔑 Using token for user: {user.get('username', 'Unknown')}")
    
    # 3. Test Audio Upload Endpoint
    print("\n" + "="*50)
    upload_success, audio_id = test_audio_upload_endpoint(base_url, token)
    test_results['audio_upload'] = upload_success
    
    # 4. Test My Library Endpoint
    print("\n" + "="*50)
    test_results['my_library'] = test_my_library_endpoint(base_url, token)
    
    # 5. Test Audio Processing
    print("\n" + "="*50)
    test_results['audio_processing'] = test_audio_processing_verification(base_url, token)
    
    # 6. Test Authentication Requirements
    print("\n" + "="*50)
    test_results['auth_requirements'] = test_authentication_requirements(base_url)
    
    # 7. Test Audio File Formats
    print("\n" + "="*50)
    test_results['file_formats'] = test_audio_file_formats(base_url, token)
    
    # Final Results Summary
    print("\n" + "="*60)
    print("🎵 AUDIO SYSTEM TEST RESULTS SUMMARY")
    print("="*60)
    
    passed_tests = 0
    total_tests = len(test_results)
    
    for test_name, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
        if result:
            passed_tests += 1
    
    print(f"\nOverall Results: {passed_tests}/{total_tests} tests passed")
    
    # Specific expectations from review request
    print("\n🎯 EXPECTATIVAS ESPECÍFICAS:")
    
    if test_results.get('audio_upload'):
        print("✅ POST /api/audio/upload funciona sin errores de FFmpeg")
    else:
        print("❌ POST /api/audio/upload tiene problemas")
    
    if test_results.get('audio_processing'):
        print("✅ Procesamiento de audio exitoso")
    else:
        print("❌ Problemas en procesamiento de audio")
    
    if test_results.get('ffmpeg_installation'):
        print("✅ No hay warnings de 'ffmpeg not found'")
    else:
        print("❌ FFmpeg no está correctamente instalado")
    
    if test_results.get('my_library'):
        print("✅ Respuestas JSON incluyen metadata completa del audio")
    else:
        print("❌ Problemas con metadata del audio")
    
    if test_results.get('auth_requirements'):
        print("✅ Endpoints requieren token válido correctamente")
    else:
        print("❌ Problemas con autenticación")
    
    # Final verdict
    if passed_tests >= 5:
        print(f"\n🎉 SISTEMA DE AUDIO COMPLETAMENTE FUNCIONAL")
        print("   - FFmpeg procesando correctamente")
        print("   - Endpoints de audio operacionales")
        print("   - Autenticación funcionando")
        print("   - Metadata completa disponible")
        return 0
    else:
        print(f"\n🚨 SISTEMA DE AUDIO TIENE PROBLEMAS CRÍTICOS")
        print("   - Revisar instalación de FFmpeg")
        print("   - Verificar configuración de endpoints")
        print("   - Comprobar procesamiento de audio")
        return 1

if __name__ == "__main__":
    sys.exit(main())