import React from 'react';

const CustomLogo = ({ size = 24, className = "" }) => {
  return (
    <div 
      className={`${className} rounded-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`
      }}
    >
      <img
        src="https://customer-assets.emergentagent.com/job_grind-reflection/artifacts/yvqdxdup_descarga%20%282%29.png"
        alt="Quick Actions Logo"
        width={size}
        height={size}
        className="w-full h-full object-cover"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          objectFit: 'cover',
          imageRendering: 'high-quality',
          imageRendering: '-webkit-optimize-contrast',
          imageRendering: 'crisp-edges',
          filter: `
            contrast(1.8) 
            saturate(1.5) 
            brightness(1.3)
            drop-shadow(0 0 1px rgba(0,0,0,0.5))
          `,
          mixBlendMode: 'multiply',
          transform: 'scale(1.1)'
        }}
      />
      {/* Overlay para ocultar restos de fondo blanco */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, transparent 60%, rgba(55, 65, 81, 0.3) 80%, rgb(55, 65, 81) 95%)`,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default CustomLogo;