/**
 * TikTokCreator - Main component for creating TikTok-style content
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, Video, Image, Plus } from 'lucide-react';
import { Button } from './ui/button';
import TikTokVideoEditor from './TikTokVideoEditor';
import TikTokVideoFeed from './TikTokVideoFeed';

const TikTokCreator = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [mediaType, setMediaType] = useState('image');
  const [posts, setPosts] = useState([]);

  const handleFileSelect = (file, type) => {
    setSelectedFile(file);
    setMediaType(type);
    setShowEditor(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      handleFileSelect(file, type);
    }
  };

  const handleSaveMedia = (editedFile, textOverlays, selectedFilter) => {
    // Create a new post object
    const newPost = {
      id: Date.now().toString(),
      file: editedFile,
      textOverlays,
      filter: selectedFilter,
      author: {
        username: 'user',
        avatar_url: '/default-avatar.png'
      },
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      isLiked: false,
      isSaved: false
    };

    setPosts(prev => [newPost, ...prev]);
  };

  return (
    <div className="w-full h-full bg-black">
      {/* Creation Interface */}
      <div className="flex flex-col items-center justify-center h-full p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 max-w-md w-full"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Create Content</h1>
            <p className="text-gray-400">Upload or capture to get started</p>
          </div>

          {/* Upload Options */}
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            
            <Button
              onClick={() => document.getElementById('file-upload').click()}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 text-lg"
            >
              <Upload className="w-6 h-6 mr-3" />
              Upload Media
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="py-3 border-gray-600 text-white hover:bg-gray-800"
                onClick={() => {
                  // Implement camera capture
                  console.log('Open camera');
                }}
              >
                <Camera className="w-5 h-5 mr-2" />
                Camera
              </Button>
              
              <Button
                variant="outline"
                className="py-3 border-gray-600 text-white hover:bg-gray-800"
                onClick={() => {
                  // Implement video recording
                  console.log('Record video');
                }}
              >
                <Video className="w-5 h-5 mr-2" />
                Record
              </Button>
            </div>
          </div>

          {/* Recent Creations */}
          {posts.length > 0 && (
            <div className="text-left space-y-4">
              <h3 className="text-xl font-semibold text-white">Recent Creations</h3>
              <div className="grid grid-cols-2 gap-3">
                {posts.slice(0, 4).map((post) => (
                  <div key={post.id} className="aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={URL.createObjectURL(post.file)}
                      alt="Creation"
                      className="w-full h-full object-cover"
                      style={{ filter: post.filter !== 'none' ? post.filter : '' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Video Editor Modal */}
      <TikTokVideoEditor
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        onSave={handleSaveMedia}
        mediaFile={selectedFile}
        mediaType={mediaType}
      />
    </div>
  );
};

export default TikTokCreator;