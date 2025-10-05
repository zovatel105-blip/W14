import React from 'react';
import { Monitor, Smartphone, Clock, Rocket } from 'lucide-react';

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo animado */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <Rocket className="w-12 h-12 text-purple-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-purple-900" />
            </div>
          </div>
        </div>

        {/* Título principal */}
        <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
          Coming Soon
        </h1>
        
        {/* Subtítulo */}
        <p className="text-2xl text-purple-200 mb-8 font-light">
          Versión de escritorio en desarrollo
        </p>

        {/* Descripción */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
          <div className="flex items-center justify-center mb-6 space-x-4">
            <div className="flex items-center space-x-2 text-red-400">
              <Monitor className="w-6 h-6" />
              <span className="text-lg font-semibold">Desktop</span>
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            </div>
            <div className="w-px h-6 bg-white/30"></div>
            <div className="flex items-center space-x-2 text-green-400">
              <Smartphone className="w-6 h-6" />
              <span className="text-lg font-semibold">Móvil</span>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          </div>
          
          <p className="text-white/80 text-lg leading-relaxed">
            Estamos trabajando duro para traerte la mejor experiencia en desktop. 
            Por ahora, puedes disfrutar de todas las funcionalidades en tu dispositivo móvil.
          </p>
        </div>

        {/* Call to action */}
        <div className="space-y-4">
          <p className="text-purple-300 text-lg">
            ¿Tienes un dispositivo móvil? ¡Prueba la app completa ahora!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg">
              📱 Accede desde tu móvil
            </div>
            <div className="text-white/60 text-sm">
              o reduce el tamaño de tu ventana
            </div>
          </div>
        </div>

        {/* Features preview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">🗳️</div>
            <div className="text-white font-semibold">Votaciones</div>
            <div className="text-white/60">Crea y participa en polls</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">💬</div>
            <div className="text-white font-semibold">Chat</div>
            <div className="text-white/60">Mensajes y conexiones</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">🎵</div>
            <div className="text-white font-semibold">Música</div>
            <div className="text-white/60">Audio y efectos</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-white/50 text-sm">
          <p>La experiencia móvil está disponible con todas las funcionalidades</p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;