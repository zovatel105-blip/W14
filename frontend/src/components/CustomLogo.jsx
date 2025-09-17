import React from 'react';

const CustomLogo = ({ size = 24, className = "" }) => {
  return (
    <div 
      className={`${className} rounded-full bg-white shadow-sm flex items-center justify-center`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`
      }}
    >
      <img
        src="https://customer-assets.emergentagent.com/job_grind-reflection/artifacts/yvqdxdup_descarga%20%282%29.png"
        alt="Quick Actions Logo"
        className="object-contain rounded-full"
        style={{ 
          width: `${size * 0.75}px`, 
          height: `${size * 0.75}px`,
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export default CustomLogo;