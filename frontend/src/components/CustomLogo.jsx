import React from 'react';

const CustomLogo = ({ size = 24, className = "" }) => {
  return (
    <div
      className={`${className} flex items-center justify-center`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        background: 'transparent'
      }}
    >
      {/* Logo SVG estilo estrella angular con líneas verdes y azules */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* Línea verde neón - diagonal superior */}
        <path
          d="M15 25 L85 15 L90 25 L85 35 L15 45 L10 35 Z"
          fill="#00ff00"
          style={{ filter: 'drop-shadow(0 0 3px #00ff0060)' }}
        />
        
        {/* Línea azul eléctrico - diagonal inferior */}
        <path
          d="M15 75 L85 65 L90 75 L85 85 L15 95 L10 85 Z"
          fill="#0066ff"
          style={{ filter: 'drop-shadow(0 0 3px #0066ff60)' }}
        />
      </svg>
    </div>
  );
};

export default CustomLogo;