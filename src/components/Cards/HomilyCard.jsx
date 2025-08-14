import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Search, X, Calendar, Youtube } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import ItemsLoader from '../loaders/itemsLoader';

const HomilyListPage = () => {
  const { t, i18n } = useTranslation();
  const [homilies, setHomilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHomilies, setFilteredHomilies] = useState([]);
  const itemsPerPage = 6;
  const { APP_BASE_URL } = useData();

  // Color scheme
  const colors = {
    primary: 'bg-rose-600 text-white',
    secondary: 'bg-pink-600 text-white',
    light: 'bg-white text-[#11181A]',
    dark: 'bg-[#11181A] text-white',
    card: 'bg-white text-[#11181A]'
  };

  useEffect(() => {
    const fetchHomilies = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${APP_BASE_URL}/api/homilies`, {
          params: {
            page: currentPage,
            limit: itemsPerPage
          }
        });
        setHomilies(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomilies();
  }, [currentPage, i18n.language]);

  // Filtrar homilias baseado no termo de pesquisa
  useEffect(() => {
    const filtered = homilies.filter(homily => {
      const title = homily[`title_${i18n.language}`] || '';
      const description = homily[`description_${i18n.language}`] || '';
      const searchLower = searchTerm.toLowerCase();
      
      return title.toLowerCase().includes(searchLower) || 
             description.toLowerCase().includes(searchLower);
    });
    
    setFilteredHomilies(filtered);
  }, [homilies, searchTerm, i18n.language]);

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
      <div className={`flex justify-center items-center min-h-screen ${colors.light}`}>
        <ItemsLoader/>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${colors.light}`}>
        <div className="text-xl text-rose-600">Error: {error}</div>
      </div>
    );
  }

  const displayHomilies = searchTerm ? filteredHomilies : homilies;

  return (
    <div className={`min-h-screen ${colors.light}`}>
      {/* Header */}
     

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
              {filteredHomilies.length} {t('search') || 'resultados encontrados'}
            </div>
          )}
        </div>

        {/* Homily Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayHomilies.map((homily) => (
            <div 
              key={homily.id} 
              className={`rounded-lg overflow-hidden shadow-lg border-2 border-pink-600 ${colors.card} hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-rose-600 flex-1 pr-2">
                    {homily[`title_${i18n.language}`] || t('common.untitled')}
                  </h2>
                  <span className="flex items-center gap-1 text-sm bg-rose-100 text-rose-800 px-2 py-1 rounded-full whitespace-nowrap">
                    <Calendar className="w-4 h-4" />
                    {new Date(homily.display_date).toLocaleDateString()}
                  </span>
                </div>
                
                {homily[`description_${i18n.language}`] && (
                  <p className="mb-4 text-gray-700 line-clamp-3">
                    {homily[`description_${i18n.language}`]}
                  </p>
                )}
                
                {homily.youtube_link && (
                  <div className="mt-4">
                    <a
                      href={homily.youtube_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${colors.secondary} hover:bg-pink-700 transition-colors`}
                    >
                      <Youtube className="w-5 h-5" />
                      {t('common.watch') || 'Assistir'}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {searchTerm && filteredHomilies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {t('common.noResults') || 'Nenhuma homilia encontrada para sua pesquisa'}
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

export default HomilyListPage;
