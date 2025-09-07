import React from 'react';
import { Search, User, Hash, Music } from 'lucide-react';
import PostsIcon from './icons/PostsIcon';

const IconDemo = () => {
  const tabs = [
    { id: 'all', label: 'Todo', icon: Search },
    { id: 'users', label: 'Usuarios', icon: User },
    { id: 'posts', label: 'Posts', icon: PostsIcon },
    { id: 'hashtags', label: 'Hashtags', icon: Hash },
    { id: 'sounds', label: 'Sonidos', icon: Music },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center">Iconos de Búsqueda</h1>
        
        {/* Mobile Layout Demo */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Vista Móvil</h2>
          <div className="flex space-x-1 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className="flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 bg-blue-100 text-blue-700"
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Layout Demo */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Vista Desktop</h2>
          <div className="flex space-x-1 justify-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Icon Showcase */}
        <div className="bg-white rounded-lg p-6 mt-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Nuevo Icono de Posts</h2>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <PostsIcon size={32} className="text-blue-700" />
              </div>
              <p className="text-sm font-medium text-gray-700">Posts</p>
              <p className="text-xs text-gray-500">Nuevo icono de cámara</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconDemo;