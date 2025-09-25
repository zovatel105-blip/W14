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
      {/* Logo exacto como fue subido */}
      <img
        src="https://customer-assets.emergentagent.com/job_socialpoll-1/artifacts/48jkqjr5_file_00000000d10061f9aa0a9323827dcaf4.png"
        alt="Logo"
        width={size}
        height={size}
        style={{
          display: 'block',
          objectFit: 'contain',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      />
    </div>
  );
};

export default CustomLogo;