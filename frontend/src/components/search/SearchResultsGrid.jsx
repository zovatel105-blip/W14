import React from 'react';
import { Play, Heart, MessageCircle, User, Hash, Music, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const SearchResultsGrid = ({ results = [], onItemClick }) => {
  const navigate = useNavigate();

  const handleItemClick = (result) => {
    // Always call the callback first - SearchPage will handle navigation
    if (onItemClick) {
      onItemClick(result);
    } else {
      // Fallback navigation if no callback provided
      switch (result.type) {
        case 'user':
          navigate(`/profile/${result.username}`);
          break;
        case 'post':
          // Navigate to feed with the specific post ID as URL parameter
          navigate(`/feed?post=${result.id}`);
          break;
        case 'hashtag':
          navigate(`/search?q=${encodeURIComponent(result.hashtag)}&filter=hashtags`);
          break;
        case 'sound':
          navigate(`/audio/${result.id}`);
          break;
        default:
          break;
      }
    }
  };

  const formatTimeAgo = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: es });
    } catch {
      return '';
    }
  };

  const PostCard = ({ post }) => (
    <div 
      onClick={() => handleItemClick(post)}
      className="relative bg-gray-100 overflow-hidden cursor-pointer group"
      style={{ aspectRatio: '9/16' }}
    >
      {/* Background Image or Video Thumbnail */}
      {(post.image_url || post.thumbnail_url || post.images?.[0]?.url || post.media_url) ? (
        <img 
          src={post.image_url || post.thumbnail_url || post.images?.[0]?.url || post.media_url} 
          alt={post.title || post.content || 'Post'}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 flex items-center justify-center">
          <Play size={24} className="text-white opacity-50" />
        </div>
      )}
      
      {/* Overlay sutil en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent"></div>
      
      {/* Metrics en la parte inferior */}
      <div className="absolute bottom-1 left-1 text-white text-xs font-semibold flex items-center space-x-1">
        <Play size={12} className="text-white" fill="currentColor" />
        <span>{post.votes_count || 0}</span>
      </div>
    </div>
  );

  const UserCard = ({ user }) => (
    <div 
      onClick={() => handleItemClick(user)}
      className="relative bg-white rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
      style={{ aspectRatio: '9/16' }} // Consistent rectangular vertical format
    >
      {/* Background - minimalist */}
      <div className="absolute inset-0 bg-gray-50"></div>
      
      {/* Content - centered and clean */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center">
        {/* Avatar - larger and clean */}
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300 ring-2 ring-white shadow-sm">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={24} className="text-gray-400" />
          )}
        </div>
        
        {/* User info - clean typography */}
        <div className="mb-3 w-full">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <h3 className="text-sm font-semibold text-gray-900 text-center truncate max-w-full">
              {user.display_name || user.username}
            </h3>
            {user.verified && (
              <CheckCircle size={12} className="text-blue-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">@{user.username}</p>
        </div>
        
        {/* Followers - clean metric */}
        <div className="mb-4">
          <p className="text-xs text-gray-400">
            {user.followers_count || 0} seguidores
          </p>
        </div>
        
        {/* Follow button - minimalist */}
        {!user.is_following && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle follow
            }}
            className="px-6 py-2 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors"
          >
            Seguir
          </button>
        )}
      </div>
    </div>
  );

  const HashtagCard = ({ hashtag }) => (
    <div 
      onClick={() => handleItemClick(hashtag)}
      className="relative bg-white rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
      style={{ aspectRatio: '9/16' }} // Consistent rectangular vertical format
    >
      {/* Background - clean gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50"></div>
      
      {/* Content - centered and minimal */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center">
        {/* Hashtag icon - clean circle */}
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
          <Hash size={20} className="text-blue-600" />
        </div>
        
        {/* Hashtag - clean typography */}
        <h3 className="text-sm font-semibold mb-2 line-clamp-1 text-gray-900">
          {hashtag.hashtag}
        </h3>
        
        {/* Post count - subtle */}
        <p className="text-xs text-gray-500 mb-4">
          {hashtag.posts_count || 0} publicaciones
        </p>
        
        {/* Trending indicator */}
        <div className="px-3 py-1 bg-blue-100 rounded-full">
          <span className="text-xs font-medium text-blue-700">Trending</span>
        </div>
      </div>
    </div>
  );

  const SoundCard = ({ sound }) => (
    <div 
      onClick={() => handleItemClick(sound)}
      className="relative bg-white rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
      style={{ aspectRatio: '9/16' }} // Consistent rectangular vertical format
    >
      {/* Background */}
      {sound.cover_image ? (
        <img 
          src={sound.cover_image} 
          alt={sound.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50"></div>
      )}
      
      {/* Subtle overlay for readability */}
      {sound.cover_image && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      )}
      
      {/* Content - centered and clean */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center">
        {/* Music icon - clean design */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 ${
          sound.cover_image ? 'bg-white/20 backdrop-blur-sm' : 'bg-pink-100'
        }`}>
          <Music size={20} className={sound.cover_image ? 'text-white' : 'text-pink-600'} />
        </div>
        
        {/* Sound info - clean typography */}
        <h3 className={`text-sm font-semibold mb-1 line-clamp-2 ${
          sound.cover_image ? 'text-white' : 'text-gray-900'
        }`}>
          {sound.title}
        </h3>
        
        <p className={`text-xs mb-2 ${
          sound.cover_image ? 'text-white/90' : 'text-gray-500'
        }`}>
          {sound.author?.username || 'Artista'}
        </p>
        
        <p className={`text-xs mb-4 ${
          sound.cover_image ? 'text-white/75' : 'text-gray-400'
        }`}>
          {sound.duration || 0}s
        </p>
        
        {/* Play button - minimalist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Handle play
          }}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            sound.cover_image 
              ? 'bg-white/20 hover:bg-white/30 backdrop-blur-sm' 
              : 'bg-pink-100 hover:bg-pink-200'
          }`}
        >
          <Play 
            size={14} 
            className={`ml-0.5 ${sound.cover_image ? 'text-white' : 'text-pink-600'}`} 
            fill="currentColor" 
          />
        </button>
      </div>
    </div>
  );

  // Group results by type for better organization
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) acc[result.type] = [];
    acc[result.type].push(result);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-3 gap-1" 
         style={{ 
           maxWidth: '100%'
         }}>
      {results.map((result) => {
        const key = `${result.type}-${result.id}`;
        
        switch (result.type) {
          case 'post':
            return <PostCard key={key} post={result} />;
          case 'user':
            return <UserCard key={key} user={result} />;
          case 'hashtag':
            return <HashtagCard key={key} hashtag={result} />;
          case 'sound':
            return <SoundCard key={key} sound={result} />;
          default:
            return null;
        }
      })}
    </div>
  );
};

export default SearchResultsGrid;