import React, { useState } from 'react';
import { X, Music, LayoutGrid } from 'lucide-react';

const CreatePreviewDemo = () => {
  const [selectedMusic, setSelectedMusic] = useState({ title: 'Música de ejemplo' });
  const [title, setTitle] = useState('');

  return (
    <div className="fixed inset-0 bg-black z-50 relative">
      {/* Preview que ocupa TODA la pantalla incluyendo header */}
      <div className="w-full h-full">
        {/* Layout Preview que ocupa TODA la pantalla disponible */}
        <div className="w-full h-full">
          <div className="grid grid-cols-2 gap-0 w-full h-full">
            {/* Opción A */}
            <div className="relative bg-black overflow-hidden w-full h-full">
              {/* Letter identifier */}
              <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                A
              </div>

              {/* Background Image */}
              <img 
                src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=800&fit=crop" 
                alt="Opción A"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40">
                {/* Content text at bottom */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-medium text-lg leading-tight">
                    Esta es la Opción A - Ahora el preview ocupa TODA la pantalla
                  </p>
                </div>
              </div>
            </div>

            {/* Opción B */}
            <div className="relative bg-black overflow-hidden w-full h-full">
              {/* Letter identifier */}
              <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                B
              </div>

              {/* Background Image */}
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=800&fit=crop" 
                alt="Opción B"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40">
                {/* Content text at bottom */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-medium text-lg leading-tight">
                    Esta es la Opción B - La descripción ahora está pequeña arriba
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Right Sidebar - Overlay on top of content */}
        <div className="absolute top-4 right-4 z-40 flex flex-col gap-3">
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
    </div>
  );
};

export default CreatePreviewDemo;