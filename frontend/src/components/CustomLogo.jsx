import React from 'react';

const CustomLogo = ({ size = 24, className = "" }) => {
  return (
    <div 
      className={`${className} relative overflow-hidden rounded-full`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`
      }}
    >
      <img
        src="https://customer-assets.emergentagent.com/job_grind-reflection/artifacts/yvqdxdup_descarga%20%282%29.png"
        alt="Quick Actions Logo"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ 
          width: `${size * 2}px`, 
          height: `${size * 2}px`,
          objectFit: 'cover',
          objectPosition: 'center center',
          transform: 'scale(1.8) translate(-12%, -12%)',
          imageRendering: 'high-quality',
          imageRendering: '-webkit-optimize-contrast',
          imageRendering: 'crisp-edges',
          filter: 'contrast(1.1) saturate(1.1)',
          left: '50%',
          top: '50%',
          marginLeft: `${-size}px`,
          marginTop: `${-size}px`
        }}
      />
    </div>
  );
};

export default CustomLogo;