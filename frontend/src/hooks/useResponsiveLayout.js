import { useState, useEffect } from 'react';

export const useResponsiveLayout = () => {
  const [screenSize, setScreenSize] = useState('desktop');
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDimensions({ width, height });
      
      // Determine screen size category
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize(); // Set initial values
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dynamic layout calculations based on screen size
  const getLayoutConfig = () => {
    const { width, height } = dimensions;
    const isMobile = screenSize === 'mobile';
    const isTablet = screenSize === 'tablet';
    const isDesktop = screenSize === 'desktop';

    return {
      // Header heights (responsive)
      headerHeight: isMobile ? '8vh' : isTablet ? '9vh' : '10vh',
      
      // Audio section heights  
      audioSectionHeight: isMobile ? '18vh' : isTablet ? '16vh' : '15vh',
      
      // Info bar height
      infoBarHeight: isMobile ? '10vh' : isTablet ? '9vh' : '8vh',
      
      // Action buttons height
      actionButtonsHeight: isMobile ? '12vh' : isTablet ? '11vh' : '10vh',
      
      // Bottom button height
      bottomButtonHeight: isMobile ? '14vh' : isTablet ? '13vh' : '12vh',
      
      // Grid height (calculated)
      get gridHeight() {
        const usedHeight = parseFloat(this.headerHeight) + 
                         parseFloat(this.audioSectionHeight) + 
                         parseFloat(this.infoBarHeight) + 
                         parseFloat(this.actionButtonsHeight) + 
                         parseFloat(this.bottomButtonHeight);
        return `${100 - usedHeight}vh`;
      },
      
      // Responsive padding
      containerPadding: isMobile ? 'px-3' : isTablet ? 'px-4' : 'px-6',
      
      // Grid columns (always 3 for this component)
      gridCols: 3,
      
      // Gap sizes
      gridGap: isMobile ? 'gap-0.5' : 'gap-1',
      
      // Font sizes
      titleSize: isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-2xl',
      artistSize: isMobile ? 'text-xs' : 'text-sm',
      infoTextSize: isMobile ? 'text-xs' : 'text-sm',
      
      // Button sizes
      buttonTextSize: isMobile ? 'text-sm' : 'text-base',
      actionButtonHeight: isMobile ? 'h-10' : 'h-12',
      mainButtonHeight: isMobile ? 'h-12' : 'h-14',
      
      // Cover image size
      coverSize: isMobile ? 'w-[16vw] h-[16vw]' : isTablet ? 'w-[14vw] h-[14vw]' : 'w-[18vw] h-[18vw]',
      coverMaxSize: isMobile ? 'max-w-20 max-h-20' : 'max-w-28 max-h-28',
      coverMinSize: 'min-w-16 min-h-16',
      
      // Avatar sizes
      avatarSize: isMobile ? 'w-6 h-6' : 'w-8 h-8',
      
      // Icon sizes  
      iconSize: isMobile ? 'w-4 h-4' : 'w-5 h-5',
      playIconSize: isMobile ? 'w-4 h-4' : 'w-5 h-5',
      
      // Spacing
      sectionSpacing: isMobile ? 'gap-2' : 'gap-4',
      
      // Screen info
      isMobile,
      isTablet, 
      isDesktop,
      screenSize,
      width,
      height
    };
  };

  return {
    ...getLayoutConfig(),
    screenSize,
    dimensions
  };
};

// Helper hook for dynamic class generation
export const useDynamicClasses = (layout) => {
  return {
    container: `min-h-screen bg-white flex flex-col ${layout.containerPadding}`,
    
    header: `relative ${layout.headerHeight} flex items-center justify-between z-10`,
    
    audioSection: `relative ${layout.audioSectionHeight} flex items-center py-2 z-10`,
    
    infoBar: `${layout.infoBarHeight} flex items-center`,
    
    actionButtons: `${layout.actionButtonsHeight} flex items-center justify-center`,
    
    grid: `${layout.gridHeight}`,
    
    bottomButton: `${layout.bottomButtonHeight} flex items-center justify-center`,
    
    // Gradient background
    gradientBg: 'absolute inset-0 bg-gradient-to-b from-green-100 via-green-50 to-transparent',
    
    // Cover image
    cover: `${layout.coverSize} ${layout.coverMaxSize} ${layout.coverMinSize} flex-shrink-0 relative`,
    
    // Typography
    title: `${layout.titleSize} font-bold text-gray-900 mb-2 truncate`,
    artist: `${layout.artistSize} font-bold text-gray-900 uppercase tracking-wide`,
    infoText: `${layout.infoTextSize}`,
    
    // Buttons
    actionButton: `w-[45%] ${layout.actionButtonHeight} border-0 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors`,
    mainButton: `w-[40%] ${layout.mainButtonHeight} bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl ${layout.buttonTextSize} transition-colors`
  };
};