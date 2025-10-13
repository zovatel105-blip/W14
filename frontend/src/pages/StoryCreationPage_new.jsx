import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Camera, 
  Video, 
  Type, 
  Upload,
  Palette,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import storyService from '../services/storyService';
import { useAuth } from '../contexts/AuthContext';

const StoryCreationPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [storyType, setStoryType] = useState('image'); // 'image', 'video', 'text'
  const [contentUrl, setContentUrl] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#8B5CF6');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [fontStyle, setFontStyle] = useState('default');
  const [privacy] = useState('public');
  const [duration] = useState(15);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // Color options
  const backgroundColors = [
    { color: '#8B5CF6', name: 'Morado' },
    { color: '#EC4899', name: 'Rosa' },
    { color: '#F59E0B', name: 'Naranja' },
    { color: '#10B981', name: 'Verde' },
    { color: '#3B82F6', name: 'Azul' },
    { color: '#EF4444', name: 'Rojo' },
    { color: '#000000', name: 'Negro' },
    { color: '#FFFFFF', name: 'Blanco' },
    { color: '#6B7280', name: 'Gris' },
  ];

  const textColors = [
    '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'
  ];

  const fontStyles = [
    { value: 'default', label: 'Default', style: 'font-sans' },
    { value: 'bold', label: 'Bold', style: 'font-bold' },
    { value: 'script', label: 'Script', style: 'font-serif italic' },
    { value: 'mono', label: 'Mono', style: 'font-mono' }
  ];

  const handleClose = () => {
    navigate(-1);
  };

  const handleFileSelect = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error('El archivo es demasiado grande. Máximo 50MB.');
      return;
    }

    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];

    if (!validImageTypes.includes(file.type) && !validVideoTypes.includes(file.type)) {
      toast.error('Tipo de archivo no válido. Use imágenes o videos.');
      return;
    }

    setIsUploading(true);

    try {
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setContentUrl(e.target.result);
        if (validImageTypes.includes(file.type)) {
          setStoryType('image');
        } else {
          setStoryType('video');
        }
        setIsUploading(false);
        toast.success('Archivo cargado correctamente');
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
  }, []);

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
        storyType: storyType || 'text',
        backgroundColor: storyType === 'text' ? backgroundColor : null,
        textColor: storyType === 'text' ? textColor : null,
        fontStyle: storyType === 'text' ? fontStyle : null,
        privacy,
        duration,
      });

      await storyService.createStory(storyData);
      
      toast.success('¡Historia creada exitosamente!', {
        duration: 3000,
      });

      // Navigate back to feed
      navigate('/feed');
    } catch (error) {
      console.error('Error creating story:', error);
      toast.error('Error al crear la historia. Inténtalo de nuevo.', {
        duration: 4000,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const triggerFileInput = (type) => {
    setStoryType(type);
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' 
        ? 'image/jpeg,image/png,image/gif,image/webp'
        : 'video/mp4,video/webm,video/ogg';
      fileInputRef.current.click();
    }
    setShowTypeSelector(false);
  };

  const handleTextStoryCreate = () => {
    setStoryType('text');
    setContentUrl(null);
    setShowTypeSelector(false);
  };

  const getFontStyleClass = () => {
    const style = fontStyles.find(f => f.value === fontStyle);
    return style ? style.style : 'font-sans';
  };

  const canPublish = () => {
    if (storyType === 'text') {
      return textContent.trim().length > 0;
    }
    return contentUrl !== null;
  };

  // Show loading screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 relative h-screen w-screen overflow-hidden" style={{ margin: 0, padding: 0 }}>
      {/* Main Content Area - Preview ocupa TODA la pantalla */}
      <div className="w-full h-full min-h-screen">
        {/* Preview Area */}
        {storyType === 'text' ? (
          /* Text Story Preview */
          <div
            className="w-full h-full flex items-center justify-center px-8"
            style={{ backgroundColor }}
          >
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Escribe tu historia aquí..."
              className={`w-full h-auto max-h-[60vh] bg-transparent border-none outline-none 
                       text-center resize-none text-3xl ${getFontStyleClass()}`}
              style={{ color: textColor }}
              maxLength={500}
              disabled={previewMode}
            />
          </div>
        ) : storyType === 'image' && contentUrl ? (
          /* Image Preview */
          <div className="w-full h-full flex items-center justify-center bg-black">
            <img
              src={contentUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
        ) : storyType === 'video' && contentUrl ? (
          /* Video Preview */
          <div className="w-full h-full flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              src={contentUrl}
              controls
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          /* Empty State - Show upload prompt */
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
            <div className="text-center text-white">
              <Upload size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-xl mb-2">Crea tu historia</p>
              <p className="text-sm opacity-75">Sube una imagen, video o escribe texto</p>
            </div>
          </div>
        )}
      </div>

      {/* Header Controls - Floating on top - Hidden in preview mode */}
      {!previewMode && (
        <div className="absolute top-0 left-0 right-0 z-50">
          {/* Main Controls Row */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
            {/* Close button - Left */}
            <button
              onClick={handleClose}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white bg-black/50 backdrop-blur-sm rounded-lg"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Title - Center */}
            <h1 className="text-white text-base sm:text-lg font-semibold">Crear Historia</h1>

            {/* Preview button - Right */}
            <button
              onClick={() => setPreviewMode(true)}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/60 transition-colors"
              title="Vista previa fullscreen"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Exit preview button - Only visible in preview mode */}
      {previewMode && (
        <button
          onClick={() => setPreviewMode(false)}
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* Floating Right Sidebar - Overlay on top of content - Hidden in preview mode */}
      {!previewMode && (
        <div className="absolute top-16 sm:top-20 right-2 sm:right-4 z-40 flex flex-col gap-2 sm:gap-3">
          {/* Type Selector Button */}
          <div className="relative">
            <button
              onClick={() => setShowTypeSelector(!showTypeSelector)}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-black/70 backdrop-blur-sm hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-all shadow-lg border border-white/10"
              title="Tipo de historia"
            >
              {storyType === 'image' && <Camera className="w-5 h-5 sm:w-6 sm:h-6" />}
              {storyType === 'video' && <Video className="w-5 h-5 sm:w-6 sm:h-6" />}
              {storyType === 'text' && <Type className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            {/* Type Menu */}
            {showTypeSelector && (
              <div className="absolute right-full top-0 mr-2 sm:mr-3 w-12 sm:w-14 bg-black/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden z-50 border border-white/10">
                <div className="py-2 flex flex-col gap-1">
                  <button
                    onClick={() => triggerFileInput('image')}
                    className={`w-full px-2 py-3 flex items-center justify-center hover:bg-white/10 transition-colors ${
                      storyType === 'image' ? 'bg-white/20 text-white' : 'text-gray-300'
                    }`}
                    title="Foto"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => triggerFileInput('video')}
                    className={`w-full px-2 py-3 flex items-center justify-center hover:bg-white/10 transition-colors ${
                      storyType === 'video' ? 'bg-white/20 text-white' : 'text-gray-300'
                    }`}
                    title="Video"
                  >
                    <Video className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleTextStoryCreate}
                    className={`w-full px-2 py-3 flex items-center justify-center hover:bg-white/10 transition-colors ${
                      storyType === 'text' ? 'bg-white/20 text-white' : 'text-gray-300'
                    }`}
                    title="Texto"
                  >
                    <Type className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Color Picker Button - Only for text stories */}
          {storyType === 'text' && (
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-black/70 backdrop-blur-sm hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-all shadow-lg border border-white/10"
                title="Colores"
              >
                <Palette className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Color Picker Menu */}
              {showColorPicker && (
                <div className="absolute right-full top-0 mr-2 sm:mr-3 w-48 sm:w-56 bg-black/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden z-50 border border-white/10 p-4">
                  {/* Background Colors */}
                  <div className="mb-4">
                    <p className="text-white text-xs mb-2 font-semibold">Fondo</p>
                    <div className="flex flex-wrap gap-2">
                      {backgroundColors.map(({ color, name }) => (
                        <button
                          key={color}
                          onClick={() => setBackgroundColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            backgroundColor === color 
                              ? 'border-white scale-110' 
                              : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                          title={name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Text Colors */}
                  <div className="mb-4">
                    <p className="text-white text-xs mb-2 font-semibold">Texto</p>
                    <div className="flex flex-wrap gap-2">
                      {textColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setTextColor(color)}
                          className={`w-7 h-7 rounded-full border-2 transition-all ${
                            textColor === color 
                              ? 'border-white scale-110' 
                              : 'border-gray-600 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Font Styles */}
                  <div>
                    <p className="text-white text-xs mb-2 font-semibold">Fuente</p>
                    <div className="flex flex-wrap gap-2">
                      {fontStyles.map((font) => (
                        <button
                          key={font.value}
                          onClick={() => setFontStyle(font.value)}
                          className={`px-3 py-1 text-xs rounded-lg transition-all ${
                            fontStyle === font.value
                              ? 'bg-purple-500 text-white'
                              : 'bg-white/20 text-white hover:bg-white/30'
                          } ${font.style}`}
                        >
                          {font.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Publish Button */}
          <button
            onClick={handleCreateStory}
            disabled={isCreating || !canPublish()}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/90 backdrop-blur-sm hover:bg-purple-600/90 disabled:bg-gray-500/70 rounded-full flex items-center justify-center text-white transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
            title={isCreating ? 'Publicando...' : 'Publicar Historia'}
          >
            {isCreating ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,video/*"
      />

      {/* Loading Overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 rounded-lg p-6 flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white font-medium">Cargando archivo...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryCreationPage;
