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
      {/* Logo SVG con líneas verdes y azules */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* Línea verde (superior derecha a inferior izquierda) */}
        <path
          d="M20 10 L80 40 L80 50 L20 20 Z"
          fill="#00ff00"
          style={{ filter: 'drop-shadow(0 0 2px #00ff0080)' }}
        />
        
        {/* Línea azul (superior izquierda a inferior derecha) */}
        <path
          d="M80 90 L20 60 L20 50 L80 80 Z"
          fill="#0080ff"
          style={{ filter: 'drop-shadow(0 0 2px #0080ff80)' }}
        />
      </svg>
    </div>
  );
};

export default CustomLogo;