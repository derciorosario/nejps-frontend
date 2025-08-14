import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Music, Clock, HardDrive, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import ItemsLoader from '../loaders/itemsLoader';
import AudioPlayer from 'react-audio-player';

const AudioListPage = () => {
  const { t, i18n } = useTranslation();
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAudios, setFilteredAudios] = useState([]);
  const itemsPerPage = 6;
  const { APP_BASE_URL } = useData();

  // Color scheme - atualizado para fundo branco
  const colors = {
    primary: 'bg-rose-600 text-white',
    secondary: 'bg-pink-600 text-white',
    light: 'bg-white text-gray-900',
    background: 'bg-gray-50 text-gray-900', // Fundo claro
    card: 'bg-white text-gray-900'
  };

  useEffect(() => {
    const fetchAudios = async () => {
      try {
        setLoading(true);
        const response = await axios.get(APP_BASE_URL+'/api/audios', {
          params: {
            page: currentPage,
            limit: itemsPerPage
          }
        });
        setAudios(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAudios();
  }, [currentPage, i18n.language]);

  // Filtrar áudios baseado no termo de pesquisa
  useEffect(() => {
    const filtered = audios.filter(audio => {
      const title = audio[`title_${i18n.language}`] || '';
      const description = audio[`description_${i18n.language}`] || '';
      const searchLower = searchTerm.toLowerCase();
      
      return title.toLowerCase().includes(searchLower) || 
             description.toLowerCase().includes(searchLower) ||
             audio.format.toLowerCase().includes(searchLower);
    });
    
    setFilteredAudios(filtered);
  }, [audios, searchTerm, i18n.language]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${colors.background}`}>
         <ItemsLoader/>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${colors.background}`}>
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  // Usar áudios filtrados se houver pesquisa, senão usar todos
  const displayAudios = searchTerm ? filteredAudios : audios;

  return (
    <div className={`min-h-screen ${colors.background}`}>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        
        {/* Search Bar */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('search')+"..." || 'Pesquisar áudios...'}
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          {/* Search Results Info */}
          {searchTerm && (
            <div className="mt-2 text-sm text-gray-600 text-center">
              {filteredAudios.length} {t('search') || 'resultados encontrados'}
            </div>
          )}
        </div>

        {/* Audio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayAudios.map((audio) => (
            <div 
              key={audio.id} 
              className={`rounded-lg overflow-hidden shadow-lg border-2 border-pink-600 ${colors.card} hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 text-rose-600">
                  {audio[`title_${i18n.language}`] || t('audioGallery.untitled')}
                </h2>
                {audio[`description_${i18n.language}`] && (
                  <p className="mb-4 text-gray-700">
                    {audio[`description_${i18n.language}`]}
                  </p>
                )}
                
                <div className="mb-4">
                  <AudioPlayer
                      src={`${APP_BASE_URL}/audio/${audio.filename.replace(' ','%20')}`}
                      controls
                      className="w-full rounded-lg"
                    />
                </div>
                
                <div className="flex justify-between text-sm text-pink-600">
                  <span className="flex items-center gap-1">
                    <Music className="w-4 h-4" />
                    {audio.format}
                  </span>
                
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-4 h-4" />
                    {(audio.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {searchTerm && filteredAudios.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {t('common.noResults') || 'Nenhum áudio encontrado para sua pesquisa'}
            </div>
            <button
              onClick={clearSearch}
              className={`mt-4 px-6 py-2 rounded-lg ${colors.secondary} hover:bg-pink-700 transition-colors`}
            >
              {t('common.clearSearch') || 'Limpar pesquisa'}
            </button>
          </div>
        )}

        {/* Pagination - only show if not searching */}
        {!searchTerm && (
          <div className="flex justify-center mt-12 gap-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentPage === 1 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : `${colors.secondary} hover:bg-pink-700`
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              {t('pagination.previous')}
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = currentPage <= 3 
                  ? i + 1 
                  : currentPage >= totalPages - 2 
                    ? totalPages - 4 + i 
                    : currentPage - 2 + i;
                
                if (page < 1 || page > totalPages) return null;
                
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-full transition-colors ${
                      currentPage === page 
                        ? colors.primary 
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentPage === totalPages 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : `${colors.secondary} hover:bg-pink-700`
              }`}
            >
              {t('pagination.next')}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AudioListPage;