import React from 'react';

const CustomLogo = ({ size = 24, className = "" }) => {
  return (
    <div
      className={`${className} rounded-full overflow-hidden relative`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        backgroundColor: 'black',
        border: 'none',
        outline: 'none',
        boxShadow: 'none'
      }}
    >
      {/* Contenedor con clip-path muy agresivo para eliminar bordes blancos */}
      <div 
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{ 
          backgroundColor: 'black',
          // Clip-path muy agresivo que corta más hacia el interior
          clipPath: 'circle(45% at 50% 50%)',
          width: '100%',
          height: '100%',
          zIndex: 0
        }}
      />
      
      {/* Logo con escala aumentada y clip-path para cortar bordes blancos */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          // Clip-path que corta los bordes blancos
          clipPath: 'circle(47% at 50% 50%)',
          zIndex: 1
        }}
      >
        <img
          src="https://customer-assets.emergentagent.com/job_feed-menu-options/artifacts/17e0koxw_IMG_2025_09_18_1241285351.png"
          alt="Quick Actions Logo"
          width={size}
          height={size}
          className="w-full h-full object-cover absolute inset-0"
          style={{ 
            width: `${Math.round(size * 1.2)}px`, 
            height: `${Math.round(size * 1.2)}px`,
            left: `${Math.round(-size * 0.1)}px`,
            top: `${Math.round(-size * 0.1)}px`,
            objectFit: 'cover',
            objectPosition: 'center center',
            filter: 'contrast(1.1) brightness(0.95)',
            border: 'none',
            outline: 'none',
            boxShadow: 'none'
          }}
        />
      </div>
      
      {/* Sombra interior negra muy agresiva para cubrir cualquier borde blanco */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 0 8px black, inset 0 0 0 12px black',
          zIndex: 2
        }}
      />
      
      {/* Máscara final negra para asegurar que no se vea nada blanco */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 35%, black 42%)',
          zIndex: 3
        }}
      />
    </div>
  );
};

export default CustomLogo;