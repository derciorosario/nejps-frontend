import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AudioPlayer from 'react-audio-player';
import { useData } from '../../../contexts/DataContext';
import { format, parseISO } from 'date-fns';
import DefaultAdminLayout from '../../layout/DefaultAdminLayout';

const AudioManager = () => {
  // State for audio list and form
  const [audios, setAudios] = useState([]);
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [editingId, setEditingId] = useState(null);
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const { APP_BASE_URL } = useData();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title_pt: '',
    title_en: '',
    description_pt: '',
    description_en: '',
    display_date: format(new Date(), 'yyyy-MM-dd'),
    filename: '',
    filepath: '',
    duration: 0,
    size: 0,
    format: ''
  });

  // Fetch audios with pagination
  const fetchAudios = async (page = 1, search = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${APP_BASE_URL}/api/audios`, {
        params: {
          page,
          limit: itemsPerPage,
          search
        }
      });
      setAudios(response.data.data);
      setTotalItems(response.data.total);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.page);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAudios(currentPage, searchTerm);
  }, [currentPage, searchTerm, APP_BASE_URL]);

  // Load audio data when editing
  useEffect(() => {
    if (editingId && view === 'form') {
      const fetchAudio = async () => {
        setIsEditing(true);
        try {
          const response = await axios.get(`${APP_BASE_URL}/api/audios/${editingId}`);
          const formattedData = {
            ...response.data,
            display_date: response.data.display_date 
              ? format(parseISO(response.data.display_date), 'yyyy-MM-dd') 
              : format(new Date(), 'yyyy-MM-dd')
          };
          setFormData(formattedData);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsEditing(false);
        }
      };
      fetchAudio();
    } else if (view === 'form') {
      // Reset form when creating new
      setFormData({
        title_pt: '',
        title_en: '',
        description_pt: '',
        description_en: '',
        display_date: format(new Date(), 'yyyy-MM-dd'),
        filename: '',
        filepath: '',
        duration: 0,
        size: 0,
        format: ''
      });
      setFile(null);
    }
  }, [editingId, view, APP_BASE_URL]);

  // Handle file upload and duration extraction
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Extract duration from audio file
      const duration = await getAudioDuration(selectedFile);
      
      setFormData(prev => ({
        ...prev,
        filename: selectedFile.name,
        format: selectedFile.name.split('.').pop(),
        size: selectedFile.size,
        duration: duration || 0
      }));
    }
  };

  // Function to get audio duration
  const getAudioDuration = (file) => {
    return new Promise((resolve) => {
      const audio = document.createElement('audio');
      audio.src = URL.createObjectURL(file);
      
      audio.onloadedmetadata = () => {
        resolve(audio.duration);
        URL.revokeObjectURL(audio.src);
      };
      
      audio.onerror = () => {
        resolve(0); // Default to 0 if can't get duration
        URL.revokeObjectURL(audio.src);
      };
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = new FormData();
      if (file) data.append('audio', file);
      
      Object.keys(formData).forEach(key => {
        if (key !== 'filepath') {
          data.append(key, formData[key]);
        }
      });

      if (editingId) {
        await axios.put(`${APP_BASE_URL}/api/audios/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post(`${APP_BASE_URL}/api/audios`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      await fetchAudios(currentPage, searchTerm);
      setView('list');
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };


  // Handle list actions
  const handleDelete = async (id) => {
    if (window.confirm(language === 'en' 
      ? 'Are you sure you want to delete this audio?' 
      : 'Tem certeza que deseja excluir este áudio?')) {
      try {
        await axios.delete(`${APP_BASE_URL}/api/audios/${id}`);
        setAudios(audios.filter(audio => audio.id !== id));
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setView('form');
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 
  

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Render list view
  const renderList = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {language === 'en' ? 'Audio Management' : 'Gestão de Áudios'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {language === 'en' 
              ? `Showing ${audios.length} of ${totalItems} items` 
              : `Mostrando ${audios.length} de ${totalItems} itens`}
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
          {error && (
            <button
              onClick={() => fetchAudios(currentPage, searchTerm)}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full shadow-md transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              {language === 'en' ? 'Retry' : 'Tentar novamente'}
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audios.map((audio) => (
              <div key={audio.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {audio.title_en || audio.title_pt || (language === 'en' ? 'Untitled' : 'Sem título')}
                    </h2>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                      {audio.display_date ? format(parseISO(audio.display_date), 'dd/MM/yyyy') : '-'}
                    </span>
                  </div>
                  
                  {(audio.description_en || audio.description_pt) && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {language === 'en' 
                        ? (audio.description_en || audio.description_pt || 'No description') 
                        : (audio.description_pt || audio.description_en || 'Sem descrição')}
                    </p>
                  )}
                
                  <div className="mb-4">
                    <AudioPlayer
                      src={`${APP_BASE_URL}/audio/${audio.filename.replaceAll(' ','%20')}`}
                      controls
                      className="w-full rounded-lg"
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      {audio.format}
                    </span>
                    {/**<span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDuration(audio.duration)}
                    </span> */}
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      {(audio.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-end space-x-3">
                  <button
                    onClick={() => handleEdit(audio.id)}
                    disabled={isEditing}
                    className="flex items-center gap-1 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors disabled:opacity-50"
                  >
                    {isEditing && audio.id === editingId ? (
                      <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        {language === 'en' ? 'Edit' : 'Editar'}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(audio.id)}
                    disabled={isDeleting}
                    className="flex items-center gap-1 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {language === 'en' ? 'Delete' : 'Excluir'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-1">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                >
                  &laquo;
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`px-3 py-1 rounded-md ${currentPage === pageNum 
                        ? 'bg-blue-500 text-white' 
                        : 'border border-gray-300 dark:border-gray-600'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                >
                  &raquo;
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Render form view
  const renderForm = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {editingId 
            ? (language === 'en' ? 'Edit Audio' : 'Editar Áudio') 
            : (language === 'en' ? 'Add New Audio' : 'Adicionar Áudio')}
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
              placeholder={language === 'en' ? 'Optional' : 'Opcional'}
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
              placeholder={language === 'en' ? 'Optional' : 'Opcional'}
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
              rows="3"
              className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder={language === 'en' ? 'Optional' : 'Opcional'}
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
              rows="3"
              className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder={language === 'en' ? 'Optional' : 'Opcional'}
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
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="audio">
              {language === 'en' ? 'Audio File' : 'Arquivo de Áudio'} *
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed dark:border-gray-600 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {file 
                      ? file.name 
                      : (editingId 
                        ? formData.filename 
                        : (language === 'en' ? 'Click to select audio file' : 'Clique para selecionar arquivo de áudio'))}
                  </p>
                </div>
                <input
                  type="file"
                  id="audio"
                  name="audio"
                  onChange={handleFileChange}
                  accept="audio/*"
                  className="hidden"
                  required={!editingId}
                />
              </label>
              {file && (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
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
                {language === 'en' ? 'Save Audio' : 'Salvar Áudio'}
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

export default AudioManager;