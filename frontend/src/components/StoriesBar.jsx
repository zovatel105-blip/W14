import React from 'react';
import { Plus } from 'lucide-react';

const StoriesBar = ({ stories, onStoryClick, onAddStory, currentUserId }) => {
  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
      <div className="flex items-center gap-4 px-4 py-3 overflow-x-auto scrollbar-hide">
        {/* Tu Historia - Botón para agregar */}
        <button
          onClick={onAddStory}
          className="flex-shrink-0 flex flex-col items-center gap-1.5 group"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 p-[2px]">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <Plus className="w-6 h-6 text-gray-600 group-hover:text-purple-600 transition-colors" />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
              <Plus className="w-3 h-3 text-white" />
            </div>
          </div>
          <span className="text-xs font-medium text-gray-700 max-w-[64px] truncate">Tu historia</span>
        </button>

        {/* Historias de usuarios seguidos */}
        {stories.map((story, index) => (
          <button
            key={story.userId}
            onClick={() => onStoryClick(index)}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 group"
          >
            <div className="relative">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${story.hasViewed ? 'from-gray-300 to-gray-400' : 'from-purple-500 via-pink-500 to-orange-400'} p-[2.5px]`}>
                <div className="w-full h-full rounded-full bg-white p-[2px]">
                  <img
                    src={story.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(story.username)}&background=random`}
                    alt={story.username}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(story.username)}&background=random`;
                    }}
                  />
                </div>
              </div>
              {story.storiesCount > 1 && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-purple-600 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">{story.storiesCount}</span>
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-gray-700 max-w-[64px] truncate group-hover:text-purple-600 transition-colors">
              {story.username}
            </span>
          </button>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default StoriesBar;
