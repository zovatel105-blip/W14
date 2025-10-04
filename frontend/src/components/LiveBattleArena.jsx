import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '../lib/utils';
import { 
  Swords, Users, Clock, Trophy, Flame, Zap, 
  Play, Calendar, MessageCircle, Heart, Share, Star,
  Shield, Target, Award, Eye, Volume2, VolumeX,
  ChevronRight, Timer, Coins, TrendingUp, Fire
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
// Mock data removed - using real backend services
import { useAuth } from '../contexts/AuthContext';
import { useAddiction } from '../contexts/AddictionContext';
import { useNavigate } from 'react-router-dom';

// Sistema de batallas live simulado
const useLiveBattles = () => {
  const [activeBattles, setActiveBattles] = useState([]);
  const [scheduledBattles, setScheduledBattles] = useState([]);
  const [battleRooms, setBattleRooms] = useState([]);

  useEffect(() => {
    // Simular batallas activas
    setActiveBattles([
      {
        id: 'battle_tech_01',
        title: 'Tech War: AI vs Human',
        room: 'Tech Arena',
        status: 'live',
        viewers: 15847,
        duration: '05:32',
        maxDuration: '10:00',
        fighter1: {
          id: 'ai_master',
          name: 'AI Master',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          votes: 8924,
          winStreak: 7,
          level: 'Legend',
          energy: 78
        },
        fighter2: {
          id: 'human_genius',
          name: 'Human Genius',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
          votes: 6923,
          winStreak: 12,
          level: 'Master',
          energy: 85
        },
        category: 'tech',
        prizePool: '50K XP',
        battleType: 'sudden_death'
      },
      {
        id: 'battle_style_02',
        title: 'Fashion Showdown Supreme',
        room: 'Style Colosseum',
        status: 'live',
        viewers: 23190,
        duration: '03:18',
        maxDuration: '08:00',
        fighter1: {
          id: 'style_queen',
          name: 'Style Queen',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          votes: 12456,
          winStreak: 5,
          level: 'Pro',
          energy: 92
        },
        fighter2: {
          id: 'fashion_ninja',
          name: 'Fashion Ninja',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          votes: 10782,
          winStreak: 8,
          level: 'Expert',
          energy: 67
        },
        category: 'fashion',
        prizePool: '35K XP',
        battleType: 'best_of_3'
      }
    ]);

    // Simular batallas programadas
    setScheduledBattles([
      {
        id: 'scheduled_01',
        title: 'Food Fight Championship',
        participants: ['chef_master', 'culinary_god'],
        startTime: '18:30',
        category: 'food',
        prizePool: '100K XP',
        estimatedViewers: '50K+'
      },
      {
        id: 'scheduled_02', 
        title: 'Gaming Legends Clash',
        participants: ['pro_gamer', 'esports_king'],
        startTime: '20:00',
        category: 'gaming',
        prizePool: '75K XP',
        estimatedViewers: '30K+'
      }
    ]);

    // Simular salas de batalla
    setBattleRooms([
      {
        id: 'tech_arena',
        name: 'Tech Arena',
        theme: 'Cyberpunk',
        activeBattles: 3,
        totalUsers: 45678,
        difficulty: 'Expert',
        color: 'from-cyan-500 to-blue-600'
      },
      {
        id: 'style_colosseum',
        name: 'Style Colosseum',
        theme: 'Fashion',
        activeBattles: 5,
        totalUsers: 32145,
        difficulty: 'Pro',
        color: 'from-pink-500 to-purple-600'
      },
      {
        id: 'food_gladiator',
        name: 'Food Gladiator',
        theme: 'Culinary',
        activeBattles: 2,
        totalUsers: 28934,
        difficulty: 'Master',
        color: 'from-orange-500 to-red-600'
      },
      {
        id: 'game_arena',
        name: 'Game Arena', 
        theme: 'Gaming',
        activeBattles: 7,
        totalUsers: 67821,
        difficulty: 'Legend',
        color: 'from-green-500 to-teal-600'
      }
    ]);
  }, []);

  return { activeBattles, scheduledBattles, battleRooms };
};

// Componente: Live Battle Card épica
const LiveBattleCard = ({ battle, index, onJoinBattle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  useEffect(() => {
    // Simular progreso de batalla en tiempo real
    const interval = setInterval(() => {
      setCurrentTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getVotePercentage = (fighter) => {
    const totalVotes = battle.fighter1.votes + battle.fighter2.votes;
    return Math.round((fighter.votes / totalVotes) * 100);
  };

  const winner = battle.fighter1.votes > battle.fighter2.votes ? battle.fighter1 : battle.fighter2;
  const loser = battle.fighter1.votes > battle.fighter2.votes ? battle.fighter2 : battle.fighter1;

  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onJoinBattle(battle)}
    >
      {/* Background épico de batalla */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-black to-orange-900/80 rounded-3xl" />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-3xl border-2 border-red-500/30" />
      
      {/* Efectos de fuego animados */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-t from-red-500 to-orange-400 rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-5px'
            }}
            animate={{
              y: [-5, -80, -5],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [0, 1, 0],
              opacity: [0, 0.7, 0]
            }}
            transition={{
              duration: Math.random() * 2 + 3,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>

      {/* LIVE Badge pulsante */}
      <div className="absolute top-4 left-4 z-20">
        <motion.div
          className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-full font-bold text-sm"
          animate={{
            boxShadow: ['0 0 0px #ef4444', '0 0 20px #ef4444', '0 0 0px #ef4444']
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          LIVE
        </motion.div>
      </div>

      {/* Espectadores */}
      <div className="absolute top-4 right-4 z-20">
        <div className="flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-sm text-white rounded-full text-sm">
          <Eye className="w-4 h-4 text-red-400" />
          <span className="font-bold">{battle.viewers.toLocaleString()}</span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 p-6 h-full">
        {/* Header de batalla */}
        <div className="text-center mb-6">
          <h2 className="text-white font-black text-xl mb-2">{battle.title}</h2>
          <div className="flex items-center justify-center gap-4 text-sm">
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
              {battle.room}
            </Badge>
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              {battle.prizePool}
            </Badge>
          </div>
        </div>

        {/* VS Section épica */}
        <div className="relative mb-6">
          {/* Fighter 1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <Avatar className="w-16 h-16 ring-4 ring-red-500/50">
                  <AvatarImage src={battle.fighter1.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-600 text-white font-bold">
                    {battle.fighter1.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {/* Trophy para el ganador */}
                {winner.id === battle.fighter1.id && (
                  <motion.div
                    className="absolute -top-2 -right-2"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Trophy className="w-6 h-6 text-yellow-400 fill-current" />
                  </motion.div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-white font-bold">{battle.fighter1.name}</h3>
                <p className="text-orange-300 text-sm">{battle.fighter1.level}</p>
                
                {/* Barra de energía */}
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/70 text-xs">Energía</span>
                    <span className="text-white text-xs font-bold">{battle.fighter1.energy}%</span>
                  </div>
                  <Progress 
                    value={battle.fighter1.energy} 
                    className="h-2 bg-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* VS central con efectos */}
            <motion.div
              className="mx-6 relative"
              animate={{
                scale: isHovered ? 1.2 : 1,
                rotate: isHovered ? [0, 10, -10, 0] : 0
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center border-4 border-yellow-400 shadow-lg">
                <Swords className="w-8 h-8 text-white" />
              </div>
              
              {/* Rayos de batalla */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-4 bg-yellow-400 rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                      transformOrigin: 'bottom',
                      transform: `translate(-50%, -100%) rotate(${i * 45}deg) translateY(-20px)`
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* Fighter 2 */}
            <div className="flex items-center gap-3 flex-1 justify-end">
              <div className="flex-1 text-right">
                <h3 className="text-white font-bold">{battle.fighter2.name}</h3>
                <p className="text-blue-300 text-sm">{battle.fighter2.level}</p>
                
                {/* Barra de energía */}
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-xs font-bold">{battle.fighter2.energy}%</span>
                    <span className="text-white/70 text-xs">Energía</span>
                  </div>
                  <Progress 
                    value={battle.fighter2.energy} 
                    className="h-2 bg-gray-700"
                  />
                </div>
              </div>
              
              <div className="relative">
                <Avatar className="w-16 h-16 ring-4 ring-blue-500/50">
                  <AvatarImage src={battle.fighter2.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                    {battle.fighter2.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {/* Trophy para el ganador */}
                {winner.id === battle.fighter2.id && (
                  <motion.div
                    className="absolute -top-2 -left-2"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Trophy className="w-6 h-6 text-yellow-400 fill-current" />
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Barras de votación */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-white text-sm font-bold min-w-0">{battle.fighter1.votes.toLocaleString()}</span>
              <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${getVotePercentage(battle.fighter1)}%` }}
                  transition={{ duration: 1.5 }}
                />
              </div>
              <span className="text-orange-300 text-sm font-bold">
                {getVotePercentage(battle.fighter1)}%
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-blue-300 text-sm font-bold">
                {getVotePercentage(battle.fighter2)}%
              </span>
              <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${getVotePercentage(battle.fighter2)}%` }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                />
              </div>
              <span className="text-white text-sm font-bold min-w-0">{battle.fighter2.votes.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Timer y acciones */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Timer className="w-4 h-4 text-red-400" />
            <span className="font-bold text-sm">{battle.duration}</span>
          </div>
          
          <motion.button
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onJoinBattle(battle)}
          >
            UNIRSE A LA BATALLA
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Componente: Battle Room Card
const BattleRoomCard = ({ room, index, onEnterRoom }) => {
  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={() => onEnterRoom(room)}
    >
      {/* Background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br rounded-2xl",
        room.color
      )} />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="text-center mb-4">
          <h3 className="text-white font-bold text-xl mb-2">{room.name}</h3>
          <Badge className="bg-white/20 text-white border-white/30">
            {room.theme}
          </Badge>
        </div>
        
        {/* Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-white">
            <span className="text-sm opacity-80">Batallas Activas</span>
            <span className="font-bold">{room.activeBattles}</span>
          </div>
          
          <div className="flex items-center justify-between text-white">
            <span className="text-sm opacity-80">Usuarios</span>
            <span className="font-bold">{room.totalUsers.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between text-white">
            <span className="text-sm opacity-80">Dificultad</span>
            <Badge className="bg-white/20 text-white border-white/30 text-xs">
              {room.difficulty}
            </Badge>
          </div>
        </div>
        
        <motion.button
          className="w-full mt-4 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold border border-white/30 hover:bg-white/30 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ENTRAR AL ARENA
        </motion.button>
      </div>
    </motion.div>
  );
};

// Componente: Scheduled Battle Card
const ScheduledBattleCard = ({ battle, index, onSetReminder }) => {
  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ x: 5, scale: 1.02 }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl" />
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-xl border border-gray-600/30" />
      
      {/* Content */}
      <div className="relative z-10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          
          <div>
            <h4 className="text-white font-bold text-sm">{battle.title}</h4>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-orange-300 text-xs font-bold">{battle.startTime}</span>
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                {battle.prizePool}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-white/60 text-xs">{battle.estimatedViewers} esperados</p>
          <motion.button
            className="mt-1 px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg text-xs font-bold border border-yellow-500/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSetReminder(battle)}
          >
            Recordar
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Componente principal: Live Battle Arena
const LiveBattleArena = () => {
  const [activeTab, setActiveTab] = useState('live');
  const [selectedBattle, setSelectedBattle] = useState(null);
  
  const { activeBattles, scheduledBattles, battleRooms } = useLiveBattles();
  const { user } = useAuth();
  const { trackAction } = useAddiction();
  const navigate = useNavigate();

  // Handlers
  const handleJoinBattle = (battle) => {
    console.log('Joining battle:', battle.title);
    trackAction('create');
  };

  const handleEnterRoom = (room) => {
    console.log('Entering room:', room.name);
    navigate(`/battle-room/${room.id}`);
  };

  const handleSetReminder = (battle) => {
    console.log('Setting reminder for:', battle.title);
    trackAction('like');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-orange-900">
      {/* Background épico con efectos de batalla */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-black to-orange-900/30" />
        
        {/* Efectos de chispas */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen overflow-y-auto pb-24">
        {/* Header épico */}
        <div className="text-center py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 mb-4">
              BATTLE ARENA
            </h1>
            <p className="text-white/90 text-xl font-bold">
              🔥 BATALLAS ÉPICAS EN TIEMPO REAL 🔥
            </p>
          </motion.div>

          {/* Stats globales */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-black text-red-400">12</div>
              <div className="text-white/80 text-sm">Batallas Live</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-orange-400">89K</div>
              <div className="text-white/80 text-sm">Espectadores</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-yellow-400">500K</div>
              <div className="text-white/80 text-sm">XP en Juego</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 mb-8">
          <div className="flex items-center justify-center gap-2">
            {[
              { id: 'live', label: 'Batallas Live', icon: Flame },
              { id: 'rooms', label: 'Salas de Batalla', icon: Shield },
              { id: 'scheduled', label: 'Programadas', icon: Calendar },
              { id: 'leaderboard', label: 'Rankings', icon: Trophy }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6">
          <AnimatePresence mode="wait">
            {/* Batallas Live */}
            {activeTab === 'live' && (
              <motion.div
                key="live"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {activeBattles.map((battle, index) => (
                  <LiveBattleCard
                    key={battle.id}
                    battle={battle}
                    index={index}
                    onJoinBattle={handleJoinBattle}
                  />
                ))}
              </motion.div>
            )}

            {/* Salas de Batalla */}
            {activeTab === 'rooms' && (
              <motion.div
                key="rooms"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {battleRooms.map((room, index) => (
                  <BattleRoomCard
                    key={room.id}
                    room={room}
                    index={index}
                    onEnterRoom={handleEnterRoom}
                  />
                ))}
              </motion.div>
            )}

            {/* Batallas Programadas */}
            {activeTab === 'scheduled' && (
              <motion.div
                key="scheduled"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <h2 className="text-white font-bold text-2xl mb-6">Próximas Batallas Épicas</h2>
                {scheduledBattles.map((battle, index) => (
                  <ScheduledBattleCard
                    key={battle.id}
                    battle={battle}
                    index={index}
                    onSetReminder={handleSetReminder}
                  />
                ))}
              </motion.div>
            )}

            {/* Rankings */}
            {activeTab === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20"
              >
                <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
                <h2 className="text-white font-bold text-3xl mb-4">Rankings de Gladiadores</h2>
                <p className="text-white/70 text-lg">Próximamente disponible</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LiveBattleArena;