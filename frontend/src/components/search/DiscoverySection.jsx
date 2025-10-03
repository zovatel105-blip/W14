import React from 'react';
import { TrendingUp, Users, Hash, Music, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DiscoverySection = ({ 
  trendingContent = [], 
  suggestedUsers = [], 
  trendingHashtags = [] 
}) => {
  const navigate = useNavigate();

  const handleSeeMore = (type) => {
    switch (type) {
      case 'users':
        navigate('/search?filter=users');
        break;
      case 'hashtags':
        navigate('/search?filter=hashtags');
        break;
      case 'trending':
        navigate('/search?sort=popularity');
        break;
      default:
        navigate('/search');
    }
  };

  const SectionHeader = ({ title, icon: Icon, onSeeMore }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <Icon size={20} className="text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {onSeeMore && (
        <button
          onClick={onSeeMore}
          className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>Ver más</span>
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Trending Posts */}
      {trendingContent && trendingContent.length > 0 && (
        <div>
          <SectionHeader 
            title="Tendencias" 
            icon={TrendingUp}
            onSeeMore={() => handleSeeMore('trending')}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {trendingContent.slice(0, 4).map((post) => (
              <div
                key={post.id}
                onClick={() => navigate(`/post/${post.id}`)}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold overflow-hidden">
                      {post.author?.avatar ? (
                        <img 
                          src={post.author.avatar} 
                          alt={post.author.username} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        post.author?.display_name?.[0]?.toUpperCase() || 'U'
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {post.author?.display_name || post.author?.username}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">
                        {post.votes_count} votos
                      </span>
                    </div>
                    
                    {post.title && (
                      <h4 className="text-sm font-semibold text-gray-900 mt-1 line-clamp-2">
                        {post.title}
                      </h4>
                    )}
                    
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {post.content}
                    </p>
                  </div>
                  
                  {post.image_url && (
                    <div className="flex-shrink-0">
                      <img 
                        src={post.image_url} 
                        alt="Post thumbnail"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Users */}
      {suggestedUsers && suggestedUsers.length > 0 && (
        <div>
          <SectionHeader 
            title="Usuarios Sugeridos" 
            icon={Users}
            onSeeMore={() => handleSeeMore('users')}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {suggestedUsers.slice(0, 6).map((user) => (
              <div
                key={user.id}
                onClick={() => navigate(`/profile/${user.username}`)}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg mx-auto mb-3 overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    user.display_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'U'
                  )}
                </div>
                
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {user.display_name || user.username}
                </h4>
                <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {user.followers_count} seguidores
                </p>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Follow functionality would go here
                  }}
                  className="mt-3 px-4 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-full hover:bg-blue-600 transition-colors"
                >
                  Seguir
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Hashtags */}
      {trendingHashtags && trendingHashtags.length > 0 && (
        <div>
          <SectionHeader 
            title="Hashtags Trending" 
            icon={Hash}
            onSeeMore={() => handleSeeMore('hashtags')}
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {trendingHashtags.slice(0, 6).map((hashtag, index) => (
              <div
                key={hashtag.hashtag || `hashtag-${index}`}
                onClick={() => navigate(`/search?q=${encodeURIComponent(hashtag.hashtag)}&filter=hashtags`)}
                className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white">
                    <Hash size={18} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {hashtag.hashtag}
                    </p>
                    <p className="text-xs text-gray-500">
                      {hashtag.count} publicaciones
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!trendingContent?.length && !suggestedUsers?.length && !trendingHashtags?.length) && (
        <div className="text-center py-12">
          <TrendingUp size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Descubre Contenido</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Comienza a buscar para encontrar usuarios, publicaciones, hashtags y música interesante.
          </p>
        </div>
      )}
    </div>
  );
};

export default DiscoverySection;