import React from 'react';

const CustomLogo = ({ size = 24, className = "" }) => {
  return (
    <div
      className={`${className} relative flex items-center justify-center`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        backgroundColor: 'black',
        borderRadius: '50%',
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        overflow: 'hidden'
      }}
    >
      {/* SVG mask approach para eliminar completamente el borde blanco */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className="absolute inset-0"
        style={{ zIndex: 1 }}
      >
        <defs>
          <mask id="circleMask">
            <rect width="100" height="100" fill="black"/>
            <circle cx="50" cy="50" r="45" fill="white"/>
          </mask>
        </defs>
        <image 
          href="https://customer-assets.emergentagent.com/job_feed-menu-options/artifacts/17e0koxw_IMG_2025_09_18_1241285351.png"
          width="120" 
          height="120" 
          x="-10" 
          y="-10"
          mask="url(#circleMask)"
          preserveAspectRatio="xMidYMid slice"
        />
      </svg>
      
      {/* Fondo negro absoluto como respaldo */}
      <div 
        className="absolute inset-0 bg-black rounded-full"
        style={{ zIndex: 0 }}
      />
    </div>
  );
};

export default CustomLogo;