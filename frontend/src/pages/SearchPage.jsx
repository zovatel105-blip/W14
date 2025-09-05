import React, { useState, useEffect } from 'react';
import { Search, User, Hash, Music, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  const tabs = [
    { id: 'all', label: 'Todo', icon: Search },
    { id: 'users', label: 'Usuarios', icon: User },
    { id: 'hashtags', label: 'Hashtags', icon: Hash },
    { id: 'music', label: 'Música', icon: Music },
  ];

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // Simular búsqueda - aquí se integraría con el backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Resultados mock para demostración
      const mockResults = [
        { id: 1, type: 'user', title: '@usuario_ejemplo', subtitle: 'Usuario Verificado', avatar: '/api/placeholder/40/40' },
        { id: 2, type: 'hashtag', title: '#tendencia', subtitle: '1.2M publicaciones', icon: Hash },
        { id: 3, type: 'music', title: 'Canción Popular', subtitle: 'Artista Famoso', icon: Music },
      ].filter(item => activeTab === 'all' || item.type === activeTab.slice(0, -1));
      
      setSearchResults(mockResults);
      
      toast({
        title: "🔍 Búsqueda completada",
        description: `Se encontraron ${mockResults.length} resultados`,
      });
    } catch (error) {
      console.error('Error searching:', error);
      toast({
        title: "Error en la búsqueda",
        description: "No se pudo realizar la búsqueda. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, activeTab]);

  const handleResultClick = (result) => {
    toast({
      title: `Seleccionaste: ${result.title}`,
      description: "Funcionalidad de navegación próximamente disponible",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuarios, hashtags, música..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full border-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                autoFocus
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-t-lg border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {!searchQuery.trim() ? (
          <div className="text-center py-16">
            <Search size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Busca lo que quieras</h3>
            <p className="text-gray-500">Encuentra usuarios, hashtags, música y más...</p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Buscando...</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No se encontraron resultados</h3>
            <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
          </div>
        ) : (
          <div className="space-y-2">
            {searchResults.map((result) => (
              <div
                key={result.id}
                onClick={() => handleResultClick(result)}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {result.avatar ? (
                    <img
                      src={result.avatar}
                      alt={result.title}
                      className="w-10 h-10 rounded-full bg-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {React.createElement(result.icon, { size: 20, className: 'text-gray-600' })}
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">{result.title}</h4>
                    <p className="text-gray-500 text-sm">{result.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;