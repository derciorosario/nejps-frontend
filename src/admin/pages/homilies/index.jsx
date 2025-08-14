import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useData } from '../../../contexts/DataContext';
import { format, parseISO } from 'date-fns';
import DefaultAdminLayout from '../../layout/DefaultAdminLayout';

const HomilyManager = () => {
  const [homilies, setHomilies] = useState([]);
  const [view, setView] = useState('list');
  const [editingId, setEditingId] = useState(null);
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { APP_BASE_URL } = useData();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title_pt: '',
    title_en: '',
    description_pt: '',
    description_en: '',
    display_date: format(new Date(), 'yyyy-MM-dd'),
    youtube_link: ''
  });

  // Fetch homilies with pagination
  const fetchHomilies = async (page = 1, search = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${APP_BASE_URL}/api/homilies`, {
        params: { page, limit: itemsPerPage, search }
      });
      setHomilies(response.data.data);
      setTotalItems(response.data.total);
      setCurrentPage(response.data.page);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHomilies(currentPage, searchTerm);
  }, [currentPage, searchTerm, APP_BASE_URL]);

  // Load homily data when editing
  useEffect(() => {
    if (editingId && view === 'form') {
      const fetchHomily = async () => {
        try {
          const response = await axios.get(`${APP_BASE_URL}/api/homilies/${editingId}`);
          setFormData({
            ...response.data,
            display_date: response.data.display_date 
              ? format(parseISO(response.data.display_date), 'yyyy-MM-dd') 
              : format(new Date(), 'yyyy-MM-dd')
          });
        } catch (err) {
          setError(err.message);
        }
      };
      fetchHomily();
    } else if (view === 'form') {
      setFormData({
        title_pt: '',
        title_en: '',
        description_pt: '',
        description_en: '',
        display_date: format(new Date(), 'yyyy-MM-dd'),
        youtube_link: ''
      });
    }
  }, [editingId, view, APP_BASE_URL]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (editingId) {
        await axios.put(`${APP_BASE_URL}/api/homilies/${editingId}`, formData);
      } else {
        await axios.post(`${APP_BASE_URL}/api/homilies`, formData);
      }
      await fetchHomilies(currentPage, searchTerm);
      setView('list');
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm(language === 'en' 
      ? 'Are you sure you want to delete this homily?' 
      : 'Tem certeza que deseja excluir esta homilia?')) {
      try {
        await axios.delete(`${APP_BASE_URL}/api/homilies/${id}`);
        await fetchHomilies(currentPage, searchTerm);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Extract YouTube video ID for thumbnail
  const getYouTubeThumbnail = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Render list view
  const renderList = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {language === 'en' ? 'Homily Management' : 'Gestão de Homilias'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {language === 'en' 
              ? `Showing ${homilies.length} of ${totalItems} items` 
              : `Mostrando ${homilies.length} de ${totalItems} itens`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder={language === 'en' ? 'Search...' : 'Pesquisar...'}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-full transition-all ${language === 'en' 
              ? 'bg-blue-500 text-white shadow-md' 
              : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('pt')}
            className={`px-4 py-2 rounded-full transition-all ${language === 'pt' 
              ? 'bg-blue-500 text-white shadow-md' 
              : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Português
          </button>
          <button
            onClick={() => setView('form')}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-md transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {language === 'en' ? 'Add New' : 'Adicionar'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
          <button 
            onClick={() => fetchHomilies()} 
            className="mt-2 text-blue-500 hover:text-blue-700"
          >
            {language === 'en' ? 'Retry' : 'Tentar novamente'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {homilies.map(homily => (
            <div key={homily.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {language === 'en' ? homily.title_en || homily.title_pt || 'Untitled' : 
                                        homily.title_pt || homily.title_en || 'Sem título'}
                  </h2>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                    {format(parseISO(homily.display_date), 'dd/MM/yyyy')}
                  </span>
                </div>
                
                {(homily.description_en || homily.description_pt) && (
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {language === 'en' 
                      ? homily.description_en || homily.description_pt 
                      : homily.description_pt || homily.description_en}
                  </p>
                )}
                
                {homily.youtube_link && (
                  <div className="mt-4">
                    <div className="mb-2">
                      <a 
                        href={homily.youtube_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 inline-flex items-center"
                      >
                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                        </svg>
                        {language === 'en' ? 'Watch on YouTube' : 'Assistir no YouTube'}
                      </a>
                    </div>
                    {getYouTubeThumbnail(homily.youtube_link) && (
                      <a href={homily.youtube_link} target="_blank" rel="noopener noreferrer">
                        <img 
                          src={`https://img.youtube.com/vi/${getYouTubeThumbnail(homily.youtube_link)}/mqdefault.jpg`} 
                          alt="YouTube thumbnail"
                          className="rounded-lg w-full max-w-md border border-gray-200"
                        />
                      </a>
                    )}
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => {
                      setEditingId(homily.id);
                      setView('form');
                    }}
                    className="flex items-center gap-1 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    {language === 'en' ? 'Edit' : 'Editar'}
                  </button>
                  <button
                    onClick={() => handleDelete(homily.id)}
                    className="flex items-center gap-1 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {language === 'en' ? 'Delete' : 'Excluir'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {Math.ceil(totalItems / itemsPerPage) > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                >
                  &laquo;
                </button>
                
                {Array.from({ length: Math.min(5, Math.ceil(totalItems / itemsPerPage)) }, (_, i) => {
                  const page = currentPage <= 3 
                    ? i + 1 
                    : currentPage >= Math.ceil(totalItems / itemsPerPage) - 2 
                      ? Math.ceil(totalItems / itemsPerPage) - 4 + i 
                      : currentPage - 2 + i;
                  
                  if (page < 1 || page > Math.ceil(totalItems / itemsPerPage)) return null;
                  
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-md ${currentPage === page 
                        ? 'bg-blue-500 text-white' 
                        : 'border border-gray-300 dark:border-gray-600'}`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalItems / itemsPerPage), p + 1))}
                  disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
                  className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                >
                  &raquo;
                </button>
              </nav>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Render form view
  const renderForm = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {editingId 
            ? (language === 'en' ? 'Edit Homily' : 'Editar Homilia') 
            : (language === 'en' ? 'Add New Homily' : 'Adicionar Homilia')}
        </h1>
        <button
          onClick={() => {
            setView('list');
            setEditingId(null);
          }}
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full shadow-md transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {language === 'en' ? 'Back to List' : 'Voltar para Lista'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="title_en">
              Title (English)
            </label>
            <input
              type="text"
              id="title_en"
              name="title_en"
              value={formData.title_en}
              onChange={handleChange}
              className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="title_pt">
              Título (Português)
            </label>
            <input
              type="text"
              id="title_pt"
              name="title_pt"
              value={formData.title_pt}
              onChange={handleChange}
              className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Opcional"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="description_en">
              Description (English)
            </label>
            <textarea
              id="description_en"
              name="description_en"
              value={formData.description_en}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="description_pt">
              Descrição (Português)
            </label>
            <textarea
              id="description_pt"
              name="description_pt"
              value={formData.description_pt}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Opcional"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="display_date">
              {language === 'en' ? 'Display Date' : 'Data de Exibição'}
            </label>
            <input
              type="date"
              id="display_date"
              name="display_date"
              value={formData.display_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="youtube_link">
              YouTube Link *
            </label>
            <input
              required={true}
              type="url"
              id="youtube_link"
              name="youtube_link"
              value={formData.youtube_link}
              onChange={handleChange}
              className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {formData.youtube_link && getYouTubeThumbnail(formData.youtube_link) && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Preview:</p>
                <img 
                  src={`https://img.youtube.com/vi/${getYouTubeThumbnail(formData.youtube_link)}/mqdefault.jpg`} 
                  alt="YouTube preview"
                  className="rounded-lg w-full max-w-xs border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {language === 'en' ? 'Saving...' : 'Salvando...'}
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {language === 'en' ? 'Save Homily' : 'Salvar Homilia'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <DefaultAdminLayout>
      <div className="container mx-auto px-4 py-8">
        {view === 'list' ? renderList() : renderForm()}
      </div>
    </DefaultAdminLayout>
  );
};

export default HomilyManager;