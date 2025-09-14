import React from 'react';
import CarouselLayout from './CarouselLayout';
import GridLayout from './GridLayout';

// Mapeo dinámico de layoutType → componente
const layoutComponents = {
  'off': CarouselLayout,
  'vertical': (props) => <GridLayout {...props} gridType="vertical" />,
  'horizontal': (props) => <GridLayout {...props} gridType="horizontal" />,
  'triptych-vertical': (props) => <GridLayout {...props} gridType="triptych-vertical" />,
  'triptych-horizontal': (props) => <GridLayout {...props} gridType="triptych-horizontal" />,
  'grid-2x2': (props) => <GridLayout {...props} gridType="grid-2x2" />,
  'grid-3x2': (props) => <GridLayout {...props} gridType="grid-3x2" />,
  'horizontal-3x2': (props) => <GridLayout {...props} gridType="horizontal-3x2" />
};

/**
 * Renderizador de layouts dinámico
 * @param {Object} poll - Datos de la publicación
 * @param {Function} onVote - Función para manejar votos
 * @param {boolean} isActive - Si el componente está activo
 * @returns {JSX.Element} - Componente de layout renderizado
 */
const LayoutRenderer = ({ poll, onVote, isActive }) => {
  // Obtener el layout type del poll, con fallback a 'vertical'
  const layoutType = poll.layout || 'vertical';
  
  // Obtener el componente correspondiente del mapeo
  const LayoutComponent = layoutComponents[layoutType];
  
  // Si no existe el componente, usar GridLayout con tipo vertical como fallback
  if (!LayoutComponent) {
    console.warn(`Layout type "${layoutType}" not found, using vertical fallback`);
    return <GridLayout poll={poll} onVote={onVote} isActive={isActive} gridType="vertical" />;
  }
  
  // Renderizar el componente con las props
  return (
    <LayoutComponent 
      poll={poll} 
      onVote={onVote} 
      isActive={isActive}
    />
  );
};

/**
 * Función utilitaria para obtener los tipos de layout disponibles
 * @returns {string[]} - Array de tipos de layout disponibles
 */
export const getAvailableLayouts = () => {
  return Object.keys(layoutComponents);
};

/**
 * Función utilitaria para verificar si un layout existe
 * @param {string} layoutType - Tipo de layout a verificar
 * @returns {boolean} - Si el layout existe
 */
export const isValidLayout = (layoutType) => {
  return layoutType in layoutComponents;
};

export default LayoutRenderer;