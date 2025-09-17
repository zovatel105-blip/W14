import React from 'react';

const CustomLogo = ({ size = 24, className = "" }) => {
  return (
    <img
      src="https://customer-assets.emergentagent.com/job_grind-reflection/artifacts/yvqdxdup_descarga%20%282%29.png"
      alt="Quick Actions Logo"
      width={size}
      height={size}
      className={`${className} object-cover rounded-full`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        objectFit: 'cover',
        imageRendering: 'high-quality',
        imageRendering: '-webkit-optimize-contrast',
        imageRendering: 'crisp-edges',
        filter: 'contrast(1.2) saturate(1.2) brightness(1.1)'
      }}
    />
  );
};

export default CustomLogo;