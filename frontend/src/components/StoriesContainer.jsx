import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import StoriesBar from './StoriesBar';
import StoryViewer from './StoryViewer';
import StoryCreator from './StoryCreator';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const StoriesContainer = ({ className = '', showCreateButton = true }) => {
  const [viewerState, setViewerState] = useState({
    isOpen: false,
    stories: [],
    currentIndex: 0,
    userIndex: 0
  });
  const [showCreator, setShowCreator] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { authUser } = useAuth();

  const handleStoryClick = useCallback((stories, storyIndex, userIndex) => {
    setViewerState({
      isOpen: true,
      stories,
      currentIndex: storyIndex,
      userIndex
    });
  }, []);

  const handleCloseViewer = useCallback(() => {
    setViewerState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  const handleStoryEnd = useCallback(() => {
    // Could implement logic to move to next user's stories
    // For now, just close the viewer
    setViewerState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  const handleCreateStoryClick = useCallback(() => {
    if (!authUser) {
      toast.error('Debes iniciar sesión para crear historias', {
        duration: 3000,
      });
      return;
    }
    setShowCreator(true);
  }, [authUser]);

  const handleCloseCreator = useCallback(() => {
    setShowCreator(false);
  }, []);

  const handleStoryCreated = useCallback((newStory) => {
    // Refresh the stories bar
    setRefreshKey(prev => prev + 1);
    
    toast.success('¡Historia publicada exitosamente!', {
      duration: 3000,
    });
  }, []);

  return (
    <>
      <StoriesBar
        key={refreshKey}
        onStoryClick={handleStoryClick}
        onCreateStoryClick={showCreateButton ? handleCreateStoryClick : undefined}
        className={className}
      />

      <AnimatePresence>
        {viewerState.isOpen && (
          <StoryViewer
            stories={viewerState.stories}
            initialIndex={viewerState.currentIndex}
            onClose={handleCloseViewer}
            onStoryEnd={handleStoryEnd}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreator && (
          <StoryCreator
            onClose={handleCloseCreator}
            onStoryCreated={handleStoryCreated}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default StoriesContainer;