import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO, isToday } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import AudioPlayer from 'react-audio-player';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import i18next from 'i18next';

const DailyContentSection = ({}) => {
  const [homily, setHomily] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { APP_BASE_URL } = useData();
  const navigate = useNavigate();

  // Function to fetch data with retry logic
  const fetchWithRetry = async (url, params, maxRetries = Infinity, retryDelay = 3000) => {
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        const response = await axios.get(url, { params });
        return response.data.data;
      } catch (err) {
        retries++;
        if (retries >= maxRetries) {
          throw err;
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchDailyContent = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        
        // Fetch homily with retry
        const homilyData = await fetchWithRetry(
          `${APP_BASE_URL}/api/homilies`,
          { date: today, signal: abortController.signal }
        ).catch(err => {
          if (err.name !== 'AbortError') throw err;
          return [];
        });
        
        const todayHomily = homilyData.find(item => 
          item.display_date && isToday(parseISO(item.display_date))
        );
        if (isMounted && todayHomily) setHomily(todayHomily);
        
        // Fetch audio with retry
        const audioData = await fetchWithRetry(
          `${APP_BASE_URL}/api/audios`,
          { date: today, signal: abortController.signal }
        ).catch(err => {
          if (err.name !== 'AbortError') throw err;
          return [];
        });
        
        const todayAudio = audioData.find(item => 
          item.display_date && isToday(parseISO(item.display_date))
        );
        if (isMounted && todayAudio) setAudio(todayAudio);

      } catch (err) {
        if (isMounted && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDailyContent();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [i18next.language, APP_BASE_URL]);

  const getYouTubeThumbnail = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[rgb(225_29_72)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-[rgb(225_29_72)] text-red-700 p-4 rounded">
        <p>{error}</p>
        <p className="mt-2 text-sm">
          {i18next.language === 'pt' 
            ? 'Tentando reconectar...' 
            : 'Attempting to reconnect...'}
        </p>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 ">
      {/* Header */}
      <div className="bg-[#11181A] px-6 py-4 rounded-t-xl">
        <h2 className="text-2xl font-bold text-white">
          {i18next.language === 'pt' ? 'CONTEÚDO DO DIA' : "TODAY'S CONTENT"}
        </h2>
        <p className="text-[#db2777]">
          {format(new Date(), 'PPPP', { locale: i18next.language === 'pt' ? ptBR : enUS })}
        </p>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white p-6 rounded-b-xl shadow-lg">
        
        {/* Homily */}
        <div className={`bg-[#f8f9fa] p-6 rounded-lg ${!homily ? 'border-2 border-dashed border-[#db2777]/30' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-[#11181A]">
              {i18next.language === 'pt' ? 'HOMILIA' : 'HOMILY'}
            </h3>
            {!homily && (
              <button 
                onClick={() => navigate('/homilies')}
                className="text-sm bg-[rgb(225_29_72)] hover:bg-[#db2777] text-white px-3 py-1 rounded-full transition-colors"
              >
                {i18next.language === 'pt' ? 'Ver todas' : 'View all'}
              </button>
            )}
          </div>
          
          {homily ? (
            <>
              <div className="mb-4">
                <h4 className="font-medium text-[#11181A]">
                  {i18next.language === 'pt' ? homily.title_pt : homily.title_en || homily.title_pt}
                </h4>
                {(homily.description_pt || homily.description_en) && (
                  <p className="text-[#11181A]/80 mt-2">
                    {i18next.language === 'pt' 
                      ? homily.description_pt || homily.description_en 
                      : homily.description_en || homily.description_pt}
                  </p>
                )}
              </div>
              
              {homily.youtube_link && (
                <div className="mb-4">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeThumbnail(homily.youtube_link)}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-64 rounded-lg"
                      title={i18next.language === 'pt' ? homily.title_pt : homily.title_en}
                    ></iframe>
                  </div>
                  <a
                    href={homily.youtube_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[rgb(225_29_72)] hover:text-[#db2777] mt-2"
                  >
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                    {i18next.language === 'pt' ? 'Assistir no YouTube' : 'Watch on YouTube'}
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-[#db2777]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-[#11181A]/70">
                {i18next.language === 'pt' 
                  ? 'Nenhuma homilia disponível para hoje' 
                  : 'No homily available for today'}
              </p>
              <button 
                onClick={() => navigate('/homilies')}
                className="mt-4 bg-[rgb(225_29_72)] hover:bg-[#db2777] text-white px-4 py-2 rounded-full inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                {i18next.language === 'pt' ? 'Ver lista de homilias' : 'View homilies list'}
              </button>
            </div>
          )}
        </div>

        {/* Audio */}
        <div className={`bg-[#f8f9fa] p-6 rounded-lg ${!audio ? 'border-2 border-dashed border-[#db2777]/30' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-[#11181A]">
              {i18next.language === 'pt' ? 'EVANGELHO ' : 'GOSPEL'}
            </h3>
            {!audio && (
              <button 
                onClick={() => navigate('/audios')}
                className="text-sm bg-[rgb(225_29_72)] hover:bg-[#db2777] text-white px-3 py-1 rounded-full transition-colors"
              >
                {i18next.language === 'pt' ? 'Ver todos' : 'View all'}
              </button>
            )}
          </div>
          
          {audio ? (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <h4 className="font-medium text-[#11181A]">
                    {i18next.language === 'pt' ? audio.title_pt : audio.title_en || audio.title_pt}
                  </h4>
                  {(audio.description_pt || audio.description_en) && (
                    <p className="text-sm text-[#11181A]/80">
                      {i18next.language === 'pt' 
                        ? audio.description_pt || audio.description_en 
                        : audio.description_en || audio.description_pt}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="bg-[#e9ecef] p-3 rounded-lg">
                <AudioPlayer
                  src={`${APP_BASE_URL}/audio/${audio.filename}`}
                  controls
                  className="w-full"
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-[#db2777]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <p className="mt-2 text-[#11181A]/70">
                {i18next.language === 'pt' 
                  ? 'Nenhum áudio disponível para hoje' 
                  : 'No audio available for today'}
              </p>
              <button 
                onClick={() => navigate('/audios')}
                className="mt-4 bg-[rgb(225_29_72)] hover:bg-[#db2777] text-white px-4 py-2 rounded-full inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                {i18next.language === 'pt' ? 'Ver lista de áudios' : 'View audios list'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DailyContentSection;