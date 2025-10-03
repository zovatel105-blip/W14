/**
 * TikTokVideoFeed - Enhanced video feed with proper thumbnail/video handling
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Heart, MessageCircle, Share, BookmarkPlus } from 'lucide-react';
import { Button } from './ui/button';

const TikTokVideoItem = ({ 
  post, 
  isActive, 
  isMuted, 
  onToggleMute,
  onLike,
  onComment,
  onShare,
  onSave,
  showThumbnail = false 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Handle video play/pause based on active state
  useEffect(() => {
    if (!videoRef.current || showThumbnail) return;

    if (isActive && !showThumbnail) {
      // Auto-play when active (full screen mode)
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setError(true));
    } else {
      // Pause when not active
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, showThumbnail]);

  // Handle muted state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleVideoClick = () => {
    if (showThumbnail) return; // No video controls in thumbnail mode
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => setError(true));
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const totalDuration = videoRef.current.duration;
      setProgress((currentTime / totalDuration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Video or Thumbnail */}
      {showThumbnail ? (
        // Thumbnail mode for grid view
        <div className="relative w-full h-full">
          <img
            src={post.thumbnail_url || post.image_url}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          {/* Fallback gradient if no thumbnail */}
          <div 
            className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center"
            style={{ display: 'none' }}
          >
            <div className="text-white text-center">
              <Play className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Video</p>
            </div>
          </div>
          
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
          </div>
          
          {/* Duration badge */}
          {duration > 0 && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {formatTime(duration)}
            </div>
          )}
        </div>
      ) : (
        // Full video mode for detail view
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            loop
            playsInline
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            onError={() => setError(true)}
            onClick={handleVideoClick}
          >
            <source src={post.video_url} type="video/mp4" />
            <source src={post.video_url} type="video/webm" />
            Your browser does not support the video tag.
          </video>

          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-white text-center">
                <div className="text-4xl mb-2">⚠️</div>
                <p>Video unavailable</p>
              </div>
            </div>
          )}

          {/* Play/Pause overlay (shown briefly) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isActive && !isPlaying ? 1 : 0, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-black/50 rounded-full p-4 backdrop-blur-sm">
              <Play className="w-12 h-12 text-white fill-white ml-1" />
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div 
              className="h-full bg-white transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Interaction buttons (only in full view) */}
      {!showThumbnail && (
        <div className="absolute right-4 bottom-20 flex flex-col gap-4 z-10">
          {/* Like button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onLike}
            className={`flex flex-col items-center gap-1 ${
              post.isLiked ? 'text-red-500' : 'text-white'
            }`}
          >
            <div className="bg-black/30 backdrop-blur-sm rounded-full p-3">
              <Heart 
                className={`w-6 h-6 ${post.isLiked ? 'fill-current' : ''}`} 
              />
            </div>
            <span className="text-xs">{post.likes_count || 0}</span>
          </motion.button>

          {/* Comment button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onComment}
            className="flex flex-col items-center gap-1 text-white"
          >
            <div className="bg-black/30 backdrop-blur-sm rounded-full p-3">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-xs">{post.comments_count || 0}</span>
          </motion.button>

          {/* Share button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onShare}
            className="flex flex-col items-center gap-1 text-white"
          >
            <div className="bg-black/30 backdrop-blur-sm rounded-full p-3">
              <Share className="w-6 h-6" />
            </div>
            <span className="text-xs">{post.shares_count || 0}</span>
          </motion.button>

          {/* Save button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onSave}
            className={`flex flex-col items-center gap-1 ${
              post.isSaved ? 'text-yellow-500' : 'text-white'
            }`}
          >
            <div className="bg-black/30 backdrop-blur-sm rounded-full p-3">
              <BookmarkPlus 
                className={`w-6 h-6 ${post.isSaved ? 'fill-current' : ''}`} 
              />
            </div>
          </motion.button>

          {/* Mute button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onToggleMute}
            className="text-white"
          >
            <div className="bg-black/30 backdrop-blur-sm rounded-full p-3">
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </div>
          </motion.button>
        </div>
      )}

      {/* Post info overlay (only in full view) */}
      {!showThumbnail && (
        <div className="absolute bottom-0 left-0 right-16 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <img
              src={post.author?.avatar_url}
              alt="Author"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <div>
              <p className="text-white font-semibold">
                @{post.author?.username}
              </p>
              {post.author?.verified && (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-xs text-white/80">Verified</span>
                </div>
              )}
            </div>
            <Button size="sm" variant="outline" className="ml-auto">
              Follow
            </Button>
          </div>
          
          {post.title && (
            <p className="text-white text-sm mb-1">{post.title}</p>
          )}
          
          {post.hashtags && (
            <p className="text-white/80 text-sm">
              {post.hashtags.map(tag => `#${tag}`).join(' ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const TikTokVideoFeed = ({ 
  posts = [], 
  currentIndex = 0,
  onIndexChange = () => {},
  showThumbnails = false,
  className = ""
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const scrollRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || showThumbnails) return;

    const container = scrollRef.current;
    const scrollTop = container.scrollTop;
    const itemHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / itemHeight);

    if (newIndex !== currentIndex) {
      onIndexChange(newIndex);
    }
  }, [currentIndex, onIndexChange, showThumbnails]);

  useEffect(() => {
    const container = scrollRef.current;
    if (container && !showThumbnails) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, showThumbnails]);

  if (showThumbnails) {
    // Grid view with thumbnails
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 ${className}`}>
        {posts.map((post) => (
          <div key={post.id} className="aspect-[9/16] rounded-lg overflow-hidden">
            <TikTokVideoItem
              post={post}
              isActive={false}
              showThumbnail={true}
              isMuted={true}
            />
          </div>
        ))}
      </div>
    );
  }

  // Full-screen vertical scroll view
  return (
    <div 
      ref={scrollRef}
      className={`w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide ${className}`}
      style={{ scrollBehavior: 'smooth' }}
    >
      {posts.map((post, index) => (
        <div 
          key={post.id} 
          className="w-full h-full snap-start snap-always"
        >
          <TikTokVideoItem
            post={post}
            isActive={index === currentIndex}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
            onLike={() => console.log('Like post:', post.id)}
            onComment={() => console.log('Comment on post:', post.id)}
            onShare={() => console.log('Share post:', post.id)}
            onSave={() => console.log('Save post:', post.id)}
            showThumbnail={false}
          />
        </div>
      ))}
    </div>
  );
};

export default TikTokVideoFeed;