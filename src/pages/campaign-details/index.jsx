import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import i18next, { t } from 'i18next';
import PagesHero from '../../components/Section/pagesHero';
import YouTubeVideoPopUp from '../../components/video/YoutubeVideoPopUp';
import { useData } from '../../contexts/DataContext';
import DonationsDialog from '../../components/Dialogs/donations-dialog';
import HowToDonateDialog from '../../components/Dialogs/how-to-donate-dialog';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function App({}) {
  const data = useData();
  const [YouTubeVideoLink, setYouTubeVideoLink] = useState(null);
  const [showDonationDialog, setShowDonationDialog] = useState(false);
  const [showHowToDonateDialog, setShowHowToDonateDialog] = useState(false);
  const { pathname } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  // Gallery popup state
  const [galleryPopup, setGalleryPopup] = useState({
    isOpen: false,
    currentIndex: 0
  });

  useEffect(() => {
    data._scrollToSection('home', 'instant');
  }, []);

  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (data.selectedCampaign && data.selectedCampaign?.id == id) {
      return;
    }

    (async () => {
      try {
        let response = await data.makeRequest({ 
          method: 'get', 
          url: `api/campaign/` + id, 
          withToken: true, 
          params: { h_n: "true", with_images: "true" }, 
          error: `` 
        }, 5);
        data.setSelectedCampaign(response);

      } catch (e) {
        console.log({ e });
        let msg = "Acorreu um erro, tente novamente";

        if (e.response) {
          if (e.response.status == 409) {
            msg = "Email já existe";
          } 
          if (e.response.status == 404) {
            msg = "Item não encontrado";
            navigate('/');
          }
          if (e.response.status == 500) {
            msg = "Erro, inesperado. Contacte seu administrador";
          }
        } else if (e.code == 'ERR_NETWORK') {
          msg = "Verfique sua internet e tente novamente";
        }

        toast.error(msg);
      }
    })();
  }, [pathname]);

  useEffect(() => {
    if (data.selectedCampaign && data.selectedCampaign?.image_filename) {
      setImageLoaded(true);
    }
  }, [data.selectedCampaign]);

  // Open gallery popup with clicked image
  const openGallery = (index) => {
    setGalleryPopup({
      isOpen: true,
      currentIndex: index
    });
  };

  // Navigate through images in gallery
  const navigateGallery = (direction) => {
    const newIndex = direction === 'prev' 
      ? (galleryPopup.currentIndex - 1 + data.selectedCampaign.images.length) % data.selectedCampaign.images.length
      : (galleryPopup.currentIndex + 1) % data.selectedCampaign.images.length;
    
    setGalleryPopup(prev => ({
      ...prev,
      currentIndex: newIndex
    }));
  };

  // Close gallery popup
  const closeGallery = () => {
    setGalleryPopup({
      isOpen: false,
      currentIndex: 0
    });
  };


  let raised = (data.selectedCampaign?.donations || []).map(item => parseFloat(item.amount || 0)).reduce((acc, curr) => acc + curr, 0);
  if (data.selectedCampaign?.insert_amount_raised_manually) {
    raised = parseFloat(data.selectedCampaign?.raised || 0);
  }
  const progress = Math.min((parseFloat(raised) / parseFloat(data.selectedCampaign?.goal)) * 100, 100);
  
  return (
    <>
      <YouTubeVideoPopUp link={YouTubeVideoLink} setLink={setYouTubeVideoLink} />
      <DonationsDialog show={showDonationDialog} setShow={setShowDonationDialog} />
      <HowToDonateDialog show={showHowToDonateDialog} setShow={setShowHowToDonateDialog} />

      {/* Gallery Popup */}
      {galleryPopup.isOpen && data.selectedCampaign?.images && (
        <div style={{zIndex:99}} className="fixed inset-0 bg-black bg-opacity-90  flex items-center justify-center p-4">
          <button 
            onClick={closeGallery}
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition"
          >
            <FaTimes />
          </button>
          
          <button 
            onClick={() => navigateGallery('prev')}
            className="absolute left-4 md:left-10 text-white text-3xl hover:text-gray-300 transition"
          >
            <FaChevronLeft size={30} />
          </button>
          
          <div className="max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex-grow flex items-center justify-center">
              <img
                src={`${data.APP_BASE_URL}/file/${data.selectedCampaign.images[galleryPopup.currentIndex].url?.replaceAll(' ', '%20')}`}
                alt={data.selectedCampaign.images[galleryPopup.currentIndex][`title_${i18next.language}`] || 'Campaign image'}
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
            
            {(data.selectedCampaign.images[galleryPopup.currentIndex].title_pt || 
             data.selectedCampaign.images[galleryPopup.currentIndex].title_en) && (
              <div className="text-white text-center mt-4 px-4 py-2 bg-black bg-opacity-50 rounded">
                <p className="text-lg">
                  {data.selectedCampaign.images[galleryPopup.currentIndex][`title_${i18next.language}`] || 
                   (i18next.language === 'pt' ? 'Sem título' : 'No title')}
                </p>
                <p className="text-sm opacity-80 mt-1">
                  {galleryPopup.currentIndex + 1} / {data.selectedCampaign.images.length}
                </p>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => navigateGallery('next')}
            className="absolute right-4 md:right-10 text-white text-3xl hover:text-gray-300 transition"
          >
            <FaChevronRight size={30} />
          </button>
        </div>
      )}

      <DefaultLayout loading={!data.selectedCampaign || !imageLoaded}>
        <PagesHero img={'img-1'} name={t('common.campaign-details')} />
        <div className="relative bg-white">
          <section className="py-20 max-w-[900px] mx-auto px-5">
            <img 
              className="w-full max-md:h-auto  h-auto object-cover cursor-pointer rounded" 
              src={data.APP_BASE_URL + "/file/" + data.selectedCampaign?.image_filename} 
              onLoad={() => setImageLoaded(true)}
              onClick={() => openGallery(-1)} // -1 indicates main image
            />
            <h2 className="text-[30px] max-md:text-[20px] py-3">{data.selectedCampaign?.['title_' + i18next.language]}</h2>
            <p className="text-sm text-gray-700 leading-snug text-justify">
              {data.selectedCampaign?.[`description_` + i18next.language]}
            </p>

            <div>


              {/* Goal and Donation Section */}
          
              <div className="mt-12 bg-gray-50 p-6 rounded-lg">
                {data.selectedCampaign?.['goal_'+i18next.language] && <div>
                <h3 className="text-xl font-semibold mb-4">
                  {i18next.language === 'pt' ? 'Objectivo' : 'Goal'}
                </h3>
                <p className="mb-2">
                  {data.selectedCampaign?.[`goal_` + i18next.language]}
                </p>
                </div>}
                {data.selectedCampaign?.goal!=0 && <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ 
                      width: `${progress}%` 
                    }}
                  ></div>
                  
                </div>}
                <div className="flex justify-between text-sm mb-4 mt-2">
                  <span>
                    {i18next.language === 'pt' ? 'Arrecadado' : 'Raised'}: {data._cn(raised)}MZN
                  </span>
                  {data.selectedCampaign?.goal!=0 && <span>
                    {i18next.language === 'pt' ? 'Objectivo' : 'Goal'}: {data._cn(data.selectedCampaign?.goal)}MZN
                  </span>}
                </div>
                
                <div className="flex items-center gap-x-2 relative">
                            <button
                              onClick={() => {
                                setShowHowToDonateDialog(true);
                              }}
                              className="bg-rose-600 border-white border text-white px-6 py-3 rounded shadow hover:bg-rose-700"
                            >
                              {t("common.donate")}
                            </button>
                            {data.selectedCampaign?.donations.length != 0 && (
                              <button
                                onClick={() => {
                                  setShowDonationDialog(data.selectedCampaign);
                                }}
                                className="text-rose-600 border border-rose-600 hover:bg-rose-700 hover:text-white bg-white text-sm rounded px-4 py-3"
                              >
                                {t("common.see-donations")}
                              </button>
                            )}
                </div>
              </div>
           

            {/* YouTube Video Section */}
            {data.selectedCampaign?.youtube_link && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">
                  {i18next.language === 'pt' ? 'Vídeo' : 'Video'}
                </h3>
                <div className="aspect-w-16 aspect-h-9">
                  <button
                    onClick={() => setYouTubeVideoLink(data.selectedCampaign?.youtube_link)}
                    className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden relative"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${data.selectedCampaign?.youtube_link.split('v=')[1]}/hqdefault.jpg`}
                      alt="YouTube thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path>
                        </svg>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}


            
            </div>

            {/* Campaign Images Gallery */}
            {data.selectedCampaign?.images?.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-semibold mb-6">
                  {i18next.language === 'pt' ? 'Mais imagens' : 'More images'}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {data.selectedCampaign?.images.map((image, index) => (
                    <div 
                      key={image.id} 
                      className="rounded relative overflow-hidden shadow-md bg-white cursor-pointer hover:shadow-lg transition"
                      onClick={() => openGallery(index)}
                    >
                      <img
                        src={`${data.APP_BASE_URL}/file/${image.url?.replaceAll(' ', '%20')}`}
                        alt={image[`title_${i18next.language}`] || 'Campaign image'}
                        className="w-full h-48 object-cover"
                      />
                      
                      {(image["title_" + i18next.language]) && (
                         <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-40 px-2 py-1 rounded-md">
                          {image["title_" + i18next.language]}
                        </div>
                     )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rest of your content (goal, donation button, video, etc.) */}
            {/* ... */}
          </section>
        </div>
      </DefaultLayout>
    </>
  );
}

export default App;