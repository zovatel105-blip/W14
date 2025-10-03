/**
 * TikTokVideoEditor - Comprehensive TikTok-style video editor with cropping, text, filters
 */
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, RotateCcw, Type, Crop, Palette, Music, 
  Download, Play, Pause, Volume2, VolumeX, Scissors,
  Filter, Sparkles, Zap
} from 'lucide-react';
import { Button } from './ui/button';
import TikTokCropModal from './TikTokCropModal';
import TikTokTextOverlay from './TikTokTextOverlay';

const TikTokVideoEditor = ({
  isOpen = false,
  onClose = () => {},
  onSave = () => {},
  mediaFile = null,
  mediaType = 'image' // 'image' or 'video'
}) => {
  const [activeTab, setActiveTab] = useState('crop');
  const [mediaSrc, setMediaSrc] = useState('');
  const [textOverlays, setTextOverlays] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [showCropModal, setShowCropModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Editor tabs
  const editorTabs = [
    { id: 'crop', icon: Crop, label: 'Crop' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'filter', icon: Filter, label: 'Filter' },
    { id: 'effects', icon: Sparkles, label: 'Effects' }
  ];

  // TikTok-style filters
  const filters = [
    { name: 'None', value: 'none', css: '', preview: '🎬' },
    { name: 'Vintage', value: 'vintage', css: 'sepia(0.5) contrast(1.2)', preview: '📸' },
    { name: 'Cool', value: 'cool', css: 'hue-rotate(180deg) saturate(1.3)', preview: '❄️' },
    { name: 'Warm', value: 'warm', css: 'hue-rotate(30deg) saturate(1.2)', preview: '🔥' },
    { name: 'B&W', value: 'bw', css: 'grayscale(1)', preview: '⚫' },
    { name: 'Pop', value: 'pop', css: 'contrast(1.5) saturate(1.8)', preview: '🎨' },
    { name: 'Neon', value: 'neon', css: 'contrast(1.3) saturate(2) hue-rotate(270deg)', preview: '💫' },
    { name: 'Retro', value: 'retro', css: 'sepia(0.8) contrast(1.4) saturate(0.8)', preview: '📺' }
  ];

  // Special effects
  const effects = [
    { name: 'None', value: 'none', preview: '✨' },
    { name: 'Blur Edge', value: 'blur-edge', preview: '🌫️' },
    { name: 'Vignette', value: 'vignette', preview: '⚫' },
    { name: 'Film Grain', value: 'grain', preview: '📽️' },
    { name: 'Glitch', value: 'glitch', preview: '📺' }
  ];

  // Load media file
  useEffect(() => {
    if (mediaFile) {
      const url = URL.createObjectURL(mediaFile);
      setMediaSrc(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [mediaFile]);

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const addTextOverlay = (textData) => {
    setTextOverlays(prev => [...prev, textData]);
  };

  const removeTextOverlay = (id) => {
    setTextOverlays(prev => prev.filter(text => text.id !== id));
  };

  const handleSave = async () => {
    // Composite the final media with overlays and effects
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = 1080; // TikTok standard width
    canvas.height = 1920; // TikTok standard height

    // Draw the media
    if (mediaType === 'video' && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    } else if (mediaType === 'image') {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawOverlays(ctx);
        exportResult();
      };
      img.src = mediaSrc;
      return;
    }
    
    drawOverlays(ctx);
    exportResult();
  };

  const drawOverlays = (ctx) => {
    // Apply filter
    if (selectedFilter !== 'none') {
      const filter = filters.find(f => f.value === selectedFilter);
      if (filter) {
        ctx.filter = filter.css;
      }
    }

    // Draw text overlays
    textOverlays.forEach(textData => {
      ctx.save();
      
      // Set text properties
      ctx.font = `${textData.style.fontWeight} ${textData.style.fontSize}px ${textData.style.fontFamily}`;
      ctx.fillStyle = textData.style.color;
      ctx.textAlign = textData.style.textAlign;
      
      // Add text shadow
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Calculate position
      const x = (textData.style.position.x / 100) * ctx.canvas.width;
      const y = (textData.style.position.y / 100) * ctx.canvas.height;
      
      // Draw text
      ctx.fillText(textData.text, x, y);
      
      ctx.restore();
    });
  };

  const exportResult = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      const file = new File([blob], 'edited-media.jpg', { type: 'image/jpeg' });
      onSave(file, textOverlays, selectedFilter);
      onClose();
    }, 'image/jpeg', 0.9);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black/90 backdrop-blur-sm">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white">
            <X className="w-5 h-5" />
          </Button>
          <h3 className="text-lg font-bold text-white">Edit</h3>
          <Button 
            size="sm" 
            onClick={handleSave}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <Check className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>

        {/* Preview Area */}
        <div className="flex-1 flex items-center justify-center bg-black relative">
          <div 
            className="relative bg-black rounded-lg overflow-hidden shadow-2xl"
            style={{ 
              width: '300px', 
              height: '533px', // 9:16 aspect ratio
              filter: selectedFilter !== 'none' 
                ? filters.find(f => f.value === selectedFilter)?.css 
                : 'none'
            }}
          >
            {/* Media */}
            {mediaType === 'video' ? (
              <video
                ref={videoRef}
                src={mediaSrc}
                className="w-full h-full object-cover"
                loop
                muted={isMuted}
                playsInline
                onEnded={() => setIsPlaying(false)}
              />
            ) : (
              <img
                src={mediaSrc}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )}

            {/* Text Overlays */}
            {textOverlays.map((textData) => (
              <div
                key={textData.id}
                className="absolute cursor-pointer select-none group"
                style={{
                  left: `${textData.style.position.x}%`,
                  top: `${textData.style.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                  ...textData.style,
                  maxWidth: '80%',
                  wordWrap: 'break-word'
                }}
                onClick={() => removeTextOverlay(textData.id)}
              >
                {textData.text}
                <div className="absolute -top-6 -right-6 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  ×
                </div>
              </div>
            ))}

            {/* Video Controls */}
            {mediaType === 'video' && (
              <div className="absolute bottom-4 left-4 flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleVideoToggle}
                  className="bg-black/50 text-white hover:bg-black/70"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleMuteToggle}
                  className="bg-black/50 text-white hover:bg-black/70"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Editor Tabs */}
        <div className="flex bg-gray-900 border-t border-gray-700">
          {editorTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                activeTab === tab.id 
                  ? 'bg-red-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Editor Options */}
        <div className="bg-gray-900 p-4 max-h-48 overflow-y-auto">
          {activeTab === 'crop' && (
            <div className="space-y-3">
              <Button
                onClick={() => setShowCropModal(true)}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white"
              >
                <Crop className="w-4 h-4 mr-2" />
                Adjust & Crop
              </Button>
              <div className="grid grid-cols-3 gap-2">
                <Button size="sm" variant="outline">9:16</Button>
                <Button size="sm" variant="outline">1:1</Button>
                <Button size="sm" variant="outline">16:9</Button>
              </div>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="space-y-3">
              <Button
                onClick={() => setShowTextModal(true)}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white"
              >
                <Type className="w-4 h-4 mr-2" />
                Add Text
              </Button>
              {textOverlays.length > 0 && (
                <div className="text-xs text-gray-400">
                  {textOverlays.length} text overlay(s) added
                </div>
              )}
            </div>
          )}

          {activeTab === 'filter' && (
            <div className="grid grid-cols-4 gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center text-xs transition-all ${
                    selectedFilter === filter.value 
                      ? 'border-red-500 bg-red-500/20' 
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <div className="text-lg mb-1">{filter.preview}</div>
                  <span className="text-white">{filter.name}</span>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'effects' && (
            <div className="grid grid-cols-4 gap-2">
              {effects.map((effect) => (
                <button
                  key={effect.value}
                  onClick={() => {/* Apply effect */}}
                  className="aspect-square rounded-lg border-2 border-gray-600 hover:border-gray-400 flex flex-col items-center justify-center text-xs transition-all"
                >
                  <div className="text-lg mb-1">{effect.preview}</div>
                  <span className="text-white">{effect.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hidden Canvas for Compositing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Modals */}
        <TikTokCropModal
          isOpen={showCropModal}
          onClose={() => setShowCropModal(false)}
          onSave={(croppedFile) => {
            // Handle cropped result
            setShowCropModal(false);
          }}
          imageFile={mediaType === 'image' ? mediaFile : null}
          videoFile={mediaType === 'video' ? mediaFile : null}
        />

        <TikTokTextOverlay
          isOpen={showTextModal}
          onClose={() => setShowTextModal(false)}
          onSave={addTextOverlay}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default TikTokVideoEditor;