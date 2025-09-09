import React, { useState } from 'react';
import { X, Music, LayoutGrid } from 'lucide-react';

const CreatePreviewDemo = () => {
  const [selectedMusic, setSelectedMusic] = useState({ title: 'Música de ejemplo' });
  const [title, setTitle] = useState('');

  return (
    <div className="fixed inset-0 bg-black z-50 relative">
      {/* Preview que ocupa TODA la pantalla incluyendo header */}
      <div className="w-full h-full">
        <div className="grid grid-cols-2 gap-0 w-full h-full">
          {/* Opción A - Empty state like reference */}
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Main gradient background - matches the reference */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
            
            {/* TikTok-style right sidebar */}
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
              <div className="flex flex-col gap-4">
                {/* Like Button */}
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">❤️</span>
                </div>
                
                {/* Comment Button */}
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">💬</span>
                </div>
                
                {/* Share Button */}
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📤</span>
                </div>
                
                {/* Plus Button (matches reference) */}
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                
                {/* More options */}
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">💭</span>
                </div>
                
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">👤</span>
                </div>
              </div>
            </div>
            
            {/* Central upload content - matches reference exactly */}
            <div className="text-center z-10">
              {/* Large circular button with gradient - exactly like reference */}
              <div className="w-32 h-32 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-8 mx-auto shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              
              {/* Text exactly like reference */}
              <h3 className="text-white text-3xl font-bold mb-4">Opción A</h3>
              <p className="text-white text-xl mb-2">Toca para agregar tu imagen</p>
              <p className="text-gray-300 text-base">Se verá exactamente como en el feed</p>
            </div>

            {/* Letter identifier - top left like TikTok */}
            <div className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-lg z-20">
              A
            </div>
          </div>

          {/* Opción B - Empty state like reference */}
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Main gradient background - matches the reference */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
            
            {/* TikTok-style right sidebar */}
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
              <div className="flex flex-col gap-4">
                {/* Like Button */}
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">❤️</span>
                </div>
                
                {/* Comment Button */}
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">💬</span>
                </div>
                
                {/* Share Button */}
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📤</span>
                </div>
                
                {/* Plus Button (matches reference) */}
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                        
                {/* More options */}
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">💭</span>
                </div>
                
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">👤</span>
                </div>
              </div>
            </div>
            
            {/* Central upload content - matches reference exactly */}
            <div className="text-center z-10">
              {/* Large circular button with gradient - exactly like reference */}
              <div className="w-32 h-32 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-8 mx-auto shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              
              {/* Text exactly like reference */}
              <h3 className="text-white text-3xl font-bold mb-4">Opción B</h3>
              <p className="text-white text-xl mb-2">Toca para agregar tu imagen</p>
              <p className="text-gray-300 text-base">Se verá exactamente como en el feed</p>
            </div>

            {/* Letter identifier - top left like TikTok */}
            <div className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-lg z-20">
              B
            </div>
          </div>
        </div>
      </div>

      {/* Header Controls - Floating on top */}
      <div className="absolute top-0 left-0 right-0 z-50">
        {/* Main Controls Row */}
        <div className="flex items-center justify-between px-4 py-3">
          {/* Close button - Left */}
          <button className="w-8 h-8 flex items-center justify-center text-white bg-black/50 backdrop-blur-sm rounded-lg">
            <X className="w-6 h-6" />
          </button>

          {/* Add Sound button - Center (pill style) */}
          <button className="flex items-center gap-2 px-6 py-3 bg-black/70 backdrop-blur-sm hover:bg-black/80 rounded-full text-white transition-colors">
            <Music className="w-5 h-5" />
            <span className="text-sm font-medium truncate max-w-40">
              {selectedMusic ? `🎵 ${selectedMusic.title}` : 'Add sound'}
            </span>
          </button>

          {/* Preview button - Right */}
          <button className="w-8 h-8 flex items-center justify-center text-white bg-black/50 backdrop-blur-sm rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Description Input - Small, below Add Sound */}
        <div className="px-4 pb-2">
          <input
            type="text"
            placeholder="Describe tu publicación..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-white/20 focus:border-white/50 focus:outline-none placeholder-gray-300 text-sm"
          />
        </div>
      </div>

      {/* Floating Right Sidebar - Overlay on top of content */}
      <div className="absolute top-20 right-4 z-40 flex flex-col gap-3">
          {/* Add Sound Button */}
          <button className="w-12 h-12 bg-black/70 backdrop-blur-sm hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-all shadow-lg border border-white/10">
            <Music className="w-6 h-6" />
          </button>

          {/* Layout Button */}
          <button className="w-12 h-12 bg-black/70 backdrop-blur-sm hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-all shadow-lg border border-white/10">
            <LayoutGrid className="w-6 h-6" />
          </button>

          {/* Publish Button */}
          <button className="w-12 h-12 bg-red-500/90 backdrop-blur-sm hover:bg-red-600/90 rounded-full flex items-center justify-center text-white transition-all shadow-lg border border-white/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
      </div>
    </div>
  );
};

export default CreatePreviewDemo;