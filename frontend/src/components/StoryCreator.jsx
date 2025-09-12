import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Camera, 
  Video, 
  Type, 
  Palette, 
  Upload, 
  Send,
  Loader2,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import storyService from '../services/storyService';
import { useAuth } from '../contexts/AuthContext';

const StoryCreator = ({ onClose, onStoryCreated }) => {
  const [currentStep, setCurrentStep] = useState('type'); // 'type', 'content', 'preview'
  const [storyType, setStoryType] = useState('image'); // 'image', 'video', 'text'
  const [contentUrl, setContentUrl] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [fontStyle, setFontStyle] = useState('default');
  const [privacy, setPrivacy] = useState('public');
  const [duration, setDuration] = useState(15);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const { authUser } = useAuth();

  // Color options
  const backgroundColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000'
  ];

  const textColors = [
    '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'
  ];

  const fontStyles = [
    { value: 'default', label: 'Default', style: 'Arial' },
    { value: 'bold', label: 'Bold', style: 'Arial Black' },
    { value: 'script', label: 'Script', style: 'Brush Script MT' },
    { value: 'serif', label: 'Serif', style: 'Times New Roman' }
  ];

  const handleFileSelect = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error('El archivo es demasiado grande. Máximo 50MB.');
      return;
    }

    const validTypes = storyType === 'image' 
      ? ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      : ['video/mp4', 'video/webm', 'video/ogg'];

    if (!validTypes.includes(file.type)) {
      toast.error(`Tipo de archivo no válido. Use: ${validTypes.join(', ')}`);
      return;
    }

    setIsUploading(true);
    
    try {
      // Convert to base64 for preview and upload
      const reader = new FileReader();
      reader.onload = (e) => {
        setContentUrl(e.target.result);
        setCurrentStep('content');
        setIsUploading(false);
      };
      reader.onerror = () => {
        toast.error('Error al cargar el archivo');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Error al procesar el archivo');
      setIsUploading(false);
    }
  }, [storyType]);

  const handleCreateStory = async () => {
    if (!contentUrl && !textContent.trim()) {
      toast.error('Agrega contenido a tu historia');
      return;
    }

    setIsCreating(true);

    try {
      const storyData = storyService.createStoryData({
        contentUrl: storyType !== 'text' ? contentUrl : null,
        textContent: textContent.trim() || null,
        storyType,
        privacy,
        backgroundColor,
        textColor,
        fontStyle,
        duration
      });

      const newStory = await storyService.createStory(storyData);
      
      toast.success('¡Historia creada exitosamente!', {
        duration: 3000,
      });

      if (onStoryCreated) {
        onStoryCreated(newStory);
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating story:', error);
      toast.error('Error al crear la historia. Inténtalo de nuevo.', {
        duration: 4000,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const renderTypeSelection = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <h2 className="text-2xl font-bold text-white mb-8">¿Qué tipo de historia quieres crear?</h2>
      
      <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setStoryType('image');
            fileInputRef.current?.click();
          }}
          className="flex items-center space-x-4 p-4 bg-white/10 hover:bg-white/20 
                   rounded-xl transition-all duration-200"
        >
          <Camera size={32} className="text-blue-400" />
          <div className="text-left">
            <p className="text-white font-semibold">Foto</p>
            <p className="text-gray-300 text-sm">Comparte una imagen</p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setStoryType('video');
            fileInputRef.current?.click();
          }}
          className="flex items-center space-x-4 p-4 bg-white/10 hover:bg-white/20 
                   rounded-xl transition-all duration-200"
        >
          <Video size={32} className="text-red-400" />
          <div className="text-left">
            <p className="text-white font-semibold">Video</p>
            <p className="text-gray-300 text-sm">Comparte un video</p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setStoryType('text');
            setCurrentStep('content');
          }}
          className="flex items-center space-x-4 p-4 bg-white/10 hover:bg-white/20 
                   rounded-xl transition-all duration-200"
        >
          <Type size={32} className="text-green-400" />
          <div className="text-left">
            <p className="text-white font-semibold">Texto</p>
            <p className="text-gray-300 text-sm">Escribe un mensaje</p>
          </div>
        </motion.button>
      </div>
    </div>
  );

  const renderContentEditor = () => (
    <div className="flex flex-col h-full">
      {/* Preview area */}
      <div className="flex-1 flex items-center justify-center relative">
        {storyType === 'text' ? (
          <div
            className="w-full h-full flex items-center justify-center p-8 min-h-[400px]"
            style={{ backgroundColor }}
          >
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Escribe tu historia aquí..."
              className="w-full max-w-md text-center text-2xl font-bold bg-transparent 
                       border-none outline-none resize-none placeholder-gray-400"
              style={{
                color: textColor,
                fontFamily: fontStyles.find(f => f.value === fontStyle)?.style || 'Arial'
              }}
              rows={6}
              maxLength={200}
            />
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {storyType === 'image' && contentUrl && (
              <img
                src={contentUrl}
                alt="Preview"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            )}
            
            {storyType === 'video' && contentUrl && (
              <video
                ref={videoRef}
                src={contentUrl}
                className="max-w-full max-h-full object-contain rounded-lg"
                controls
                muted
              />
            )}
            
            {/* Text overlay */}
            {textContent && (
              <div className="absolute bottom-4 left-4 right-4">
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Añade texto..."
                  className="w-full text-center text-lg font-medium bg-black/50 text-white 
                           rounded-lg p-3 border-none outline-none resize-none placeholder-gray-300"
                  rows={2}
                  maxLength={100}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 space-y-4 bg-black/50">
        {storyType === 'text' && (
          <>
            {/* Background colors */}
            <div>
              <p className="text-white text-sm mb-2">Color de fondo:</p>
              <div className="flex space-x-2 overflow-x-auto">
                {backgroundColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setBackgroundColor(color)}
                    className={`w-8 h-8 rounded-full border-2 flex-shrink-0 ${
                      backgroundColor === color ? 'border-white' : 'border-gray-600'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Text colors */}
            <div>
              <p className="text-white text-sm mb-2">Color de texto:</p>
              <div className="flex space-x-2 overflow-x-auto">
                {textColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setTextColor(color)}
                    className={`w-8 h-8 rounded-full border-2 flex-shrink-0 ${
                      textColor === color ? 'border-white' : 'border-gray-600'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Font styles */}
            <div>
              <p className="text-white text-sm mb-2">Estilo de fuente:</p>
              <div className="flex space-x-2 overflow-x-auto">
                {fontStyles.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => setFontStyle(font.value)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      fontStyle === font.value
                        ? 'bg-white text-black'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    style={{ fontFamily: font.style }}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Add text to image/video */}
        {storyType !== 'text' && (
          <div>
            <p className="text-white text-sm mb-2">Añadir texto (opcional):</p>
            <input
              type="text"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Escribe algo..."
              className="w-full p-2 rounded-lg bg-white/20 text-white placeholder-gray-300 
                       border-none outline-none"
              maxLength={100}
            />
          </div>
        )}

        {/* Duration */}
        <div>
          <p className="text-white text-sm mb-2">Duración: {duration}s</p>
          <input
            type="range"
            min="5"
            max="30"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Privacy */}
        <div>
          <p className="text-white text-sm mb-2">Privacidad:</p>
          <div className="flex space-x-2">
            {[
              { value: 'public', label: 'Público' },
              { value: 'followers', label: 'Seguidores' },
              { value: 'close_friends', label: 'Amigos cercanos' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setPrivacy(option.value)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  privacy === option.value
                    ? 'bg-white text-black'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black/50">
          <div className="flex items-center space-x-3">
            {currentStep !== 'type' && (
              <button
                onClick={() => setCurrentStep('type')}
                className="text-white hover:text-gray-300 transition-colors"
              >
                ← Atrás
              </button>
            )}
          </div>
          
          <h1 className="text-white text-lg font-semibold">
            {currentStep === 'type' ? 'Nueva Historia' : 
             currentStep === 'content' ? 'Editar Historia' : 'Vista Previa'}
          </h1>
          
          <div className="flex items-center space-x-2">
            {currentStep === 'content' && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleCreateStory}
                disabled={isCreating}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white 
                         rounded-lg font-medium transition-all duration-200 
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Creando...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Publicar</span>
                  </>
                )}
              </motion.button>
            )}
            
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isUploading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 size={48} className="text-white animate-spin mx-auto mb-4" />
                <p className="text-white text-lg">Subiendo archivo...</p>
              </div>
            </div>
          ) : currentStep === 'type' ? (
            renderTypeSelection()
          ) : (
            renderContentEditor()
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={storyType === 'image' ? 'image/*' : 'video/*'}
          onChange={handleFileSelect}
          className="hidden"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default StoryCreator;