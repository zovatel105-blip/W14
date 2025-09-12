import React from 'react';
import { X, TrendingUp, Users, Vote, Heart, Share2, Calendar, Trophy, BarChart3, Eye } from 'lucide-react';

const StatisticsModal = ({ isOpen, onClose, user, polls, followersCount, followingCount }) => {
  if (!isOpen) return null;

  // Calculate statistics from polls
  const totalPolls = polls?.length || 0;
  const totalVotes = polls?.reduce((sum, poll) => {
    return sum + (poll.options?.reduce((optSum, option) => optSum + (option.votes || 0), 0) || 0);
  }, 0) || 0;

  const totalLikes = polls?.reduce((sum, poll) => sum + (poll.likes_count || 0), 0) || 0;
  const totalShares = polls?.reduce((sum, poll) => sum + (poll.shares_count || 0), 0) || 0;
  const totalComments = polls?.reduce((sum, poll) => sum + (poll.comments_count || 0), 0) || 0;

  // Calculate engagement rate
  const totalInteractions = totalVotes + totalLikes + totalShares + totalComments;
  const avgInteractionsPerPost = totalPolls > 0 ? Math.round(totalInteractions / totalPolls) : 0;

  // Find most popular poll
  const mostPopularPoll = polls?.reduce((prev, current) => {
    const prevScore = (prev.options?.reduce((sum, opt) => sum + (opt.votes || 0), 0) || 0) + (prev.likes_count || 0);
    const currentScore = (current.options?.reduce((sum, opt) => sum + (opt.votes || 0), 0) || 0) + (current.likes_count || 0);
    return currentScore > prevScore ? current : prev;
  }, null);

  // Calculate account age (assuming created_at exists)
  const accountAge = user?.created_at ? Math.floor((new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24)) : 0;

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          color === "blue" ? "bg-blue-100 text-blue-600" :
          color === "green" ? "bg-green-100 text-green-600" :
          color === "purple" ? "bg-purple-100 text-purple-600" :
          color === "pink" ? "bg-pink-100 text-pink-600" :
          color === "orange" ? "bg-orange-100 text-orange-600" :
          "bg-gray-100 text-gray-600"
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{title}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Estadísticas de la cuenta</h2>
            <p className="text-gray-600">@{user?.username || 'Usuario'}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Overview Stats */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Resumen General
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                icon={Vote} 
                title="Publicaciones" 
                value={totalPolls}
                color="blue"
              />
              <StatCard 
                icon={Users} 
                title="Seguidores" 
                value={followersCount || 0}
                color="green"
              />
              <StatCard 
                icon={Users} 
                title="Siguiendo" 
                value={followingCount || 0}
                color="purple"
              />
              <StatCard 
                icon={Calendar} 
                title="Días activo" 
                value={accountAge}
                color="orange"
              />
            </div>
          </div>

          {/* Engagement Stats */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Engagement
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                icon={Vote} 
                title="Total Votos" 
                value={totalVotes}
                subtitle="En todas las publicaciones"
                color="blue"
              />
              <StatCard 
                icon={Heart} 
                title="Total Likes" 
                value={totalLikes}
                subtitle="Me gusta recibidos"
                color="pink"
              />
              <StatCard 
                icon={Share2} 
                title="Compartidos" 
                value={totalShares}
                subtitle="Veces compartido"
                color="green"
              />
              <StatCard 
                icon={Eye} 
                title="Promedio por post" 
                value={avgInteractionsPerPost}
                subtitle="Interacciones promedio"
                color="purple"
              />
            </div>
          </div>

          {/* Top Performance */}
          {mostPopularPoll && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Publicación más popular
              </h3>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                <h4 className="font-semibold text-gray-900 mb-2">{mostPopularPoll.title}</h4>
                <div className="flex gap-4">
                  <span className="text-sm text-gray-600">
                    🗳️ {mostPopularPoll.options?.reduce((sum, opt) => sum + (opt.votes || 0), 0) || 0} votos
                  </span>
                  <span className="text-sm text-gray-600">
                    ❤️ {mostPopularPoll.likes_count || 0} likes
                  </span>
                  <span className="text-sm text-gray-600">
                    💬 {mostPopularPoll.comments_count || 0} comentarios
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Account Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Información de la cuenta
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Nombre completo:</span>
                  <p className="font-medium">{user?.display_name || 'No especificado'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="font-medium">{user?.email || 'No especificado'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Ocupación:</span>
                  <p className="font-medium">{user?.occupation || 'No especificado'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Cuenta verificada:</span>
                  <p className="font-medium">{user?.is_verified ? '✅ Sí' : '❌ No'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Estadísticas calculadas en tiempo real • Última actualización: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsModal;