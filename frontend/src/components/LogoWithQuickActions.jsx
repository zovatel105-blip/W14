import React, { useState, useCallback } from 'react';
import CustomLogo from './CustomLogo';
import QuickActionsMenu from './QuickActionsMenu';
import useLongPress from '../hooks/useLongPress';
import { useToast } from '../hooks/use-toast';

const LogoWithQuickActions = ({ size = 24, className = "" }) => {
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const { toast } = useToast();

  const handleLongPress = useCallback(() => {
    console.log('🎯 Long press detected - showing quick actions menu');
    setShowQuickActions(true);
    setIsPressed(false);
    
    // Haptic feedback si está disponible
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    toast({
      title: "🚀 Menú de acciones rápidas",
      description: "Selecciona una acción",
      duration: 2000,
    });
  }, [toast]);

  const handleShortPress = useCallback(() => {
    console.log('👆 Short press detected - no action (regular click)');
    // Para un click corto, no hacemos nada especial
    // Esto permite que el logo siga siendo clickeable para otras funcionalidades si se necesitan
  }, []);

  const handleCloseMenu = useCallback(() => {
    console.log('✖️ Closing quick actions menu');
    setShowQuickActions(false);
  }, []);

  const handleActionSelect = useCallback((actionType) => {
    console.log('🎯 Quick action selected:', actionType);
    
    switch (actionType) {
      case 'search':
        // Aquí se puede implementar navegación a página de búsqueda
        console.log('🔍 Navigating to search...');
        break;
      case 'moments':
        // Aquí se puede implementar navegación a historias
        console.log('📸 Navigating to moments...');
        break;
      default:
        console.log('❓ Unknown action:', actionType);
    }
  }, []);

  const longPressProps = useLongPress(
    handleLongPress,
    handleShortPress,
    600 // 600ms para activar long press
  );

  return (
    <>
      <div
        {...longPressProps}
        className={`${className} flex items-center justify-center cursor-pointer select-none transition-all duration-200 ${
          isPressed ? 'scale-95' : 'hover:scale-105'
        }`}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
        title="Mantén presionado para acciones rápidas"
      >
        <CustomLogo 
          size={size} 
          className={`transition-all duration-200 ${
            isPressed ? 'brightness-75' : ''
          }`} 
        />
        
        {/* Indicador visual de carga durante long press */}
        {isPressed && (
          <div 
            className="absolute inset-0 border-2 border-blue-400 rounded-full animate-pulse"
            style={{
              animation: 'pulse-ring 0.6s ease-out'
            }}
          />
        )}
      </div>

      {/* Menú de acciones rápidas */}
      <QuickActionsMenu 
        isVisible={showQuickActions}
        onClose={handleCloseMenu}
        onActionSelect={handleActionSelect}
      />

      {/* CSS personalizado para animaciones */}
      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default LogoWithQuickActions;