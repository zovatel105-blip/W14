import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { cn } from '../lib/utils';
import { 
  Search, Filter, TrendingUp, Users, Brain, Sparkles, 
  Zap, Heart, MessageCircle, Send, Crown, Star,
  ChevronDown, Play, Volume2, Bookmark, Grid3X3,
  Eye, Target, Flame, Award, CheckCircle, MoreHorizontal
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { mockPolls } from '../services/mockData';
import { useAuth } from '../contexts/AuthContext';
import { useAddiction } from '../contexts/AddictionContext';
import { useNavigate } from 'react-router-dom';

// Innovación: Sistema de predicción de tendencias con IA
const useTrendingPredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setIsAnalyzing(true);
    // Simulación de análisis IA en tiempo real
    setTimeout(() => {
      setPredictions([
        {
          hashtag: '#TechBattle2025',
          currentVotes: '2.8M',
          predictedGrowth: '+340%',
          confidence: 94,
          category: 'tech',
          trendScore: 9.7,
          color: 'from-cyan-400 to-blue-600'
        },
        {
          hashtag: '#StyleWarAI',
          currentVotes: '1.9M',
          predictedGrowth: '+280%',
          confidence: 87,
          category: 'fashion',
          trendScore: 9.2,
          color: 'from-pink-400 to-purple-600'
        },
        {
          hashtag: '#FoodFusionVR',
          currentVotes: '3.2M',
          predictedGrowth: '+420%',
          confidence: 91,
          category: 'food',
          trendScore: 9.8,
          color: 'from-orange-400 to-red-600'
        },
        {
          hashtag: '#GameDevShowdown',
          currentVotes: '1.5M',
          predictedGrowth: '+195%',
          confidence: 78,
          category: 'gaming',
          trendScore: 8.9,
          color: 'from-green-400 to-teal-600'
        }
      ]);
      setIsAnalyzing(false);
    }, 2000);
  }, []);

  return { predictions, isAnalyzing };
};

// Innovación: Algoritmo de descubrimiento de usuarios personalizado
const usePersonalizedUserDiscovery = () => {
  const { user } = useAuth();
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    // Simulación de algoritmo de ML personalizado
    const users = [
      {
        id: 'tech_guru_2025',
        username: 'tech_guru_2025',
        displayName: 'Tech Guru 🚀',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        followers: '847K',
        verified: true,
        bio: 'AI & Quantum Computing Expert',
        matchScore: 94,
        commonInterests: ['Tech', 'AI', 'Startups'],
        recentActivity: 'Voted on 12 tech polls today'
      },
      {
        id: 'style_queen_ai',
        username: 'style_queen_ai',
        displayName: 'Style Queen AI ✨',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
        followers: '623K',
        verified: true,
        bio: 'Fashion AI & Digital Styling',
        matchScore: 89,
        commonInterests: ['Fashion', 'AI', 'Design'],
        recentActivity: 'Created viral style battle'
      },
      {
        id: 'neural_chef',
        username: 'neural_chef',
        displayName: 'Neural Chef 🧠',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face',
        followers: '392K',
        verified: false,
        bio: 'AI-Generated Recipes & Food Art',
        matchScore: 82,
        commonInterests: ['Food', 'AI', 'Innovation'],
        recentActivity: '3 trending food battles'
      }
    ];
    setSuggestedUsers(users);
  }, [user]);

  return suggestedUsers;
};

// Innovación: Búsqueda avanzada con IA y predicciones
const NeuralSearchBar = ({ onSearch, onFilterChange }) => {
  const [query, setQuery] = useState('');
  const [isAIActive, setIsAIActive] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value) => {
    setQuery(value);
    setIsAIActive(value.length > 2);
    
    // Simulación de sugerencias IA
    if (value.length > 2) {
      setAiSuggestions([
        `${value} + tendencias`,
        `${value} + usuarios populares`,
        `${value} + predicciones IA`,
        `${value} + contenido viral`
      ]);
    } else {
      setAiSuggestions([]);
    }
    
    onSearch(value);
  };

  return (
    <div className="relative">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
        
        <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-1">
          <div className="flex items-center gap-4 px-6 py-4">
            {/* IA Brain Icon */}
            <motion.div
              className="relative"
              animate={{
                scale: isAIActive ? [1, 1.2, 1] : 1,
                rotate: isAIActive ? [0, 360] : 0
              }}
              transition={{
                duration: 2,
                repeat: isAIActive ? Infinity : 0
              }}
            >
              <Brain className={cn(
                "w-6 h-6 transition-colors duration-300",
                isAIActive ? "text-cyan-400" : "text-white/60"
              )} />
              {isAIActive && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-cyan-400"
                  animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>

            {/* Search Input */}
            <Input
              placeholder="Buscar con IA neural... 🧠"
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="flex-1 bg-transparent border-none text-white placeholder-white/60 text-lg focus:outline-none"
            />

            {/* Search & Filter Buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSearch(query)}
              >
                <Search className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                className={cn(
                  "p-2 rounded-xl transition-all",
                  showFilters 
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
          
          {/* AI Suggestions */}
          <AnimatePresence>
            {aiSuggestions.length > 0 && (
              <motion.div
                className="px-6 pb-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className="space-y-2">
                  <p className="text-xs text-cyan-400 font-semibold flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Sugerencias IA Neural
                  </p>
                  {aiSuggestions.map((suggestion, index) => (
                    <motion.button
                      key={suggestion}
                      className="block w-full text-left p-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-all text-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        setQuery(suggestion);
                        onSearch(suggestion);
                        setAiSuggestions([]);
                      }}
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-4 z-50"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
          >
            <div className="bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-white font-bold mb-4">Filtros Avanzados</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Category Filters */}
                <div>
                  <p className="text-white/80 text-sm mb-2">Categoría</p>
                  <select className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white">
                    <option value="">Todas</option>
                    <option value="tech">Tecnología</option>
                    <option value="fashion">Moda</option>
                    <option value="food">Comida</option>
                    <option value="gaming">Gaming</option>
                  </select>
                </div>

                {/* Popularity Filter */}
                <div>
                  <p className="text-white/80 text-sm mb-2">Popularidad</p>
                  <select className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white">
                    <option value="">Cualquiera</option>
                    <option value="viral">Viral (+1M)</option>
                    <option value="trending">Trending (+100K)</option>
                    <option value="rising">Emergente (+10K)</option>
                  </select>
                </div>

                {/* Time Filter */}
                <div>
                  <p className="text-white/80 text-sm mb-2">Tiempo</p>
                  <select className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white">
                    <option value="">Cualquiera</option>
                    <option value="hour">Última hora</option>
                    <option value="day">Hoy</option>
                    <option value="week">Esta semana</option>
                    <option value="month">Este mes</option>
                  </select>
                </div>

                {/* Content Type */}
                <div>
                  <p className="text-white/80 text-sm mb-2">Tipo</p>
                  <select className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white">
                    <option value="">Todo</option>
                    <option value="polls">Votaciones</option>
                    <option value="users">Usuarios</option>
                    <option value="trends">Tendencias</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(false)}
                  className="border-white/20 text-white/80"
                >
                  Cancelar
                </Button>
                <Button 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600"
                  onClick={() => {
                    onFilterChange({});
                    setShowFilters(false);
                  }}
                >
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Innovación: Tarjeta de tendencia predictiva con IA
const PredictiveTrendCard = ({ trend, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <motion.div
      className="relative group cursor-pointer"
      style={{ 
        height: index % 3 === 0 ? '280px' : index % 2 === 0 ? '240px' : '200px'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Background Gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br rounded-2xl",
        trend.color
      )} />
      
      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10" />
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Badge className="bg-white/20 text-white border-white/30">
              Predicción IA
            </Badge>
            <div className="flex items-center gap-1 text-white/80">
              <Brain className="w-4 h-4" />
              <span className="text-xs font-semibold">{trend.confidence}%</span>
            </div>
          </div>
          
          <h3 className="text-white font-bold text-xl mb-2">
            {trend.hashtag}
          </h3>
          
          <div className="flex items-center gap-4 mb-3">
            <div className="text-white/90">
              <p className="text-sm opacity-80">Votos actuales</p>
              <p className="font-bold">{trend.currentVotes}</p>
            </div>
            <div className="text-green-300">
              <p className="text-sm opacity-80">Crecimiento predicho</p>
              <p className="font-bold">{trend.predictedGrowth}</p>
            </div>
          </div>
        </div>
        
        {/* Trend Score Visualization */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm">Trend Score</span>
            <span className="text-white font-bold">{trend.trendScore}/10</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${trend.trendScore * 10}%` }}
              transition={{ duration: 1, delay: index * 0.2 }}
            />
          </div>
        </div>
        
        {/* Hover Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(45deg, ${trend.color.split(' ').slice(1, -1).join(' ')}, transparent)`,
            filter: 'blur(20px)'
          }}
        />
      </div>
    </motion.div>
  );
};

// Innovación: Tarjeta de usuario con algoritmo de matching
const PersonalizedUserCard = ({ user, index }) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  
  const handleFollow = (e) => {
    e.stopPropagation();
    setIsFollowing(!isFollowing);
  };

  const handleUserClick = () => {
    navigate(`/profile/${user.username}`);
  };

  return (
    <motion.div
      className="relative group cursor-pointer"
      style={{ 
        height: index % 4 === 0 ? '320px' : index % 3 === 0 ? '280px' : '260px'
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15 }}
      whileHover={{ y: -8, scale: 1.03 }}
      onClick={handleUserClick}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/60 to-pink-900/80 rounded-2xl" />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10" />
      
      {/* Matching Score Ring */}
      <div className="absolute top-4 right-4 z-20">
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 40 40">
            <circle
              cx="20" cy="20" r="18"
              fill="none"
              stroke="white"
              strokeOpacity="0.3"
              strokeWidth="2"
            />
            <motion.circle
              cx="20" cy="20" r="18"
              fill="none"
              stroke="#00f5ff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 18}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 18 }}
              animate={{ 
                strokeDashoffset: 2 * Math.PI * 18 - (user.matchScore / 100) * 2 * Math.PI * 18
              }}
              transition={{ duration: 1.5, delay: index * 0.2 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-xs font-bold">{user.matchScore}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Avatar className="w-20 h-20 ring-4 ring-cyan-400/50">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white font-bold">
                {user.displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {user.verified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                <CheckCircle className="w-4 h-4 text-white fill-current" />
              </div>
            )}
          </div>
        </div>
        
        {/* User Info */}
        <div className="text-center flex-1">
          <h3 className="text-white font-bold text-lg mb-1">{user.displayName}</h3>
          <p className="text-cyan-400 text-sm mb-2">@{user.username}</p>
          <p className="text-white/70 text-sm mb-4 line-clamp-2">{user.bio}</p>
          
          {/* Stats */}
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="text-center">
              <p className="text-white font-bold">{user.followers}</p>
              <p className="text-white/60 text-xs">Seguidores</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-cyan-400 font-bold">{user.matchScore}%</p>
              <p className="text-white/60 text-xs">Match</p>
            </div>
          </div>
          
          {/* Common Interests */}
          <div className="flex flex-wrap justify-center gap-1 mb-4">
            {user.commonInterests.slice(0, 3).map((interest, idx) => (
              <Badge 
                key={idx}
                className="bg-white/20 text-white border-white/30 text-xs"
              >
                {interest}
              </Badge>
            ))}
          </div>
          
          {/* Recent Activity */}
          <p className="text-white/60 text-xs mb-4">{user.recentActivity}</p>
        </div>
        
        {/* Follow Button */}
        <motion.button
          className={cn(
            "w-full py-3 rounded-xl font-semibold transition-all",
            isFollowing
              ? "bg-white/20 text-white border border-white/30"
              : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
          )}
          onClick={handleFollow}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isFollowing ? 'Siguiendo' : 'Seguir'}
        </motion.button>
      </div>
    </motion.div>
  );
};

// Innovación: Tarjeta de votación para masonry
const MasonryPollCard = ({ poll, index, onVote, onLike, onShare, onComment }) => {
  const [selectedOption, setSelectedOption] = useState(poll.userVote || null);
  const navigate = useNavigate();

  const handleVote = (optionId) => {
    if (selectedOption) return;
    setSelectedOption(optionId);
    onVote(poll.id, optionId);
  };

  const getPercentage = (option) => {
    if (!selectedOption || poll.totalVotes === 0) return 0;
    return Math.round((option.votes / poll.totalVotes) * 100);
  };

  const cardHeight = index % 5 === 0 ? '400px' : 
                   index % 3 === 0 ? '350px' : 
                   index % 2 === 0 ? '300px' : '280px';

  return (
    <motion.div
      className="relative group cursor-pointer"
      style={{ height: cardHeight }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl" />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10" />
      
      {/* Content */}
      <div className="relative z-10 p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Avatar 
              className="w-8 h-8 ring-2 ring-white/30 cursor-pointer"
              onClick={() => navigate(`/profile/${poll.author?.username || poll.author?.id}`)}
            >
              <AvatarImage src={poll.author?.avatar_url || "https://github.com/shadcn.png"} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xs">
                {(poll.author?.display_name || poll.author?.username || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-semibold text-sm">{poll.author?.display_name || poll.author?.username || 'Usuario'}</p>
              <p className="text-white/60 text-xs">{poll.timeAgo}</p>
            </div>
          </div>
          
          {/* Custom Logo */}
          <img 
            src="https://customer-assets.emergentagent.com/job_perfil-doble/artifacts/59vt1o0f_Screenshot_2025-08-09-01-39-16-39_99c04817c0de5652397fc8b56c3b3817.jpg"
            alt="Logo"
            className="w-6 h-6 invert"
          />
        </div>
        
        {/* Poll Title */}
        <h3 className="text-white font-bold text-sm mb-3 line-clamp-2">
          {poll.title}
        </h3>
        
        {/* Options Grid */}
        <div className="flex-1 mb-3">
          <div className="grid grid-cols-2 gap-2 h-full">
            {poll.options.slice(0, 4).map((option, optionIndex) => {
              const percentage = getPercentage(option);
              const isSelected = selectedOption === option.id;
              
              return (
                <motion.div
                  key={option.id}
                  className="relative rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => handleVote(option.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Option Background */}
                  <div className="absolute inset-0">
                    <img 
                      src={option.media?.url} 
                      alt={option.text}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                  </div>
                  
                  {/* Progress Overlay */}
                  {selectedOption && (
                    <motion.div
                      className={cn(
                        "absolute inset-x-0 bottom-0 bg-gradient-to-t",
                        isSelected 
                          ? "from-blue-600/80 to-blue-500/40"
                          : "from-gray-600/60 to-gray-500/30"
                      )}
                      initial={{ height: 0 }}
                      animate={{ height: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  )}
                  
                  {/* User Avatar in option */}
                  <div className="absolute bottom-2 right-2">
                    <Avatar className="w-6 h-6 ring-2 ring-white/50">
                      <AvatarImage src={option.user?.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xs">
                        {option.user?.displayName?.charAt(0) || option.id.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Percentage Badge */}
                  {selectedOption && (
                    <motion.div
                      className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white rounded-md text-xs font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1 }}
                    >
                      {percentage}%
                    </motion.div>
                  )}
                  
                  {/* Option Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-xs font-semibold truncate">
                      {option.user?.displayName}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              className={cn(
                "flex items-center gap-1 text-xs",
                poll.userLiked ? "text-red-400" : "text-white/70 hover:text-red-400"
              )}
              onClick={() => onLike(poll.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className={cn("w-4 h-4", poll.userLiked && "fill-current")} />
              <span>{poll.likes}</span>
            </motion.button>
            
            <motion.button
              className="flex items-center gap-1 text-xs text-white/70 hover:text-blue-400"
              onClick={() => onComment(poll.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MessageCircle className="w-4 h-4" />
              <span>{poll.comments}</span>
            </motion.button>
          </div>
          
          <motion.button
            className="flex items-center gap-1 text-xs text-white/70 hover:text-green-400"
            onClick={() => onShare(poll.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Send className="w-4 h-4" />
            <span>{poll.shares}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Componente principal: Neural Discover Page
const NeuralDiscoverPage = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [masonry, setMasonry] = useState([]);
  
  const { predictions, isAnalyzing } = useTrendingPredictions();
  const suggestedUsers = usePersonalizedUserDiscovery();
  const { trackAction } = useAddiction();

  // Organizar contenido en grid masonry
  useEffect(() => {
    const organizeContent = () => {
      const content = [];
      
      // Intercalar diferentes tipos de contenido
      predictions.forEach((trend, index) => {
        content.push({ type: 'trend', data: trend, index });
      });
      
      suggestedUsers.forEach((user, index) => {
        content.push({ type: 'user', data: user, index });
      });
      
      mockPolls.slice(0, 8).forEach((poll, index) => {
        content.push({ type: 'poll', data: poll, index });
      });
      
      // Mezclar aleatoriamente para efecto masonry
      const shuffled = content.sort(() => Math.random() - 0.5);
      setMasonry(shuffled);
    };
    
    if (predictions.length > 0 && suggestedUsers.length > 0) {
      organizeContent();
    }
  }, [predictions, suggestedUsers]);

  // Handlers
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implementar lógica de búsqueda
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Implementar lógica de filtros
  };

  const handleVote = async (pollId, optionId) => {
    await trackAction('vote');
  };

  const handleLike = async (pollId) => {
    await trackAction('like');
  };

  const handleShare = async (pollId) => {
    await trackAction('share');
  };

  const handleComment = async (pollId) => {
    await trackAction('create');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-indigo-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20" />
        {/* Neural Network Pattern */}
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px bg-cyan-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen overflow-y-auto pb-24">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="px-6 py-6">
            {/* Title */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mb-2">
                NEURAL DISCOVER
              </h1>
              <p className="text-white/80 text-lg">
                Exploración inteligente con IA predictiva 🧠
              </p>
            </motion.div>

            {/* Search Bar */}
            <NeuralSearchBar 
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-center gap-2">
            {[
              { id: 'discover', label: 'Descubrir', icon: Brain },
              { id: 'trends', label: 'Tendencias', icon: TrendingUp },
              { id: 'users', label: 'Usuarios', icon: Users },
              { id: 'ai', label: 'IA Neural', icon: Sparkles }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content Grid - Masonry Layout */}
        <div className="px-6 pb-8">
          {isAnalyzing ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                className="text-center"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <p className="text-white text-lg font-semibold">
                  Analizando tendencias con IA Neural...
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {masonry.map((item, index) => (
                <div key={`${item.type}-${index}`} className="break-inside-avoid">
                  {item.type === 'trend' && (
                    <PredictiveTrendCard trend={item.data} index={index} />
                  )}
                  {item.type === 'user' && (
                    <PersonalizedUserCard user={item.data} index={index} />
                  )}
                  {item.type === 'poll' && (
                    <MasonryPollCard 
                      poll={item.data} 
                      index={index}
                      onVote={handleVote}
                      onLike={handleLike}
                      onShare={handleShare}
                      onComment={handleComment}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NeuralDiscoverPage;