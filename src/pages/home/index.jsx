import React,{useEffect,useState} from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { useData } from '../../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import i18next, { t } from 'i18next';
import AOS from "aos";
import "aos/dist/aos.css"; 
import FullPageSlider from '../../components/Silders/heroSlider';
import HeroDonations from '../../components/Silders/heroDonations';
import { Target, Eye, Flag } from "lucide-react";
import AboutImg from '../../assets/img/about/1.jpg'
import YouTubeVideoPopUp from '../../components/video/YoutubeVideoPopUp';
import CampaignList from '../../components/Cards/CampaignCard';
import SectionTopContent from '../../components/Section/sectionTopContent';
import EventCards from '../../components/Cards/EventCards';
import ImageGallery from '../../components/Cards/GalleryCard';
import DonationsDialog from '../../components/Dialogs/donations-dialog';
import HowToDonateDialog from '../../components/Dialogs/how-to-donate-dialog';
import VolunteersSlider from '../../components/Silders/volunteersSlider';


function App({}) {
  
  const data=useData()
  const [activeSlide, setActiveSlide] = useState(0); 
  const [YouTubeVideoLink,setYouTubeVideoLink]=useState(null)
  const [showDonationDialog,setShowDonationDialog]=useState(false)
  const [showHowToDonateDialog,setShowHowToDonateDialog]=useState(false)

  useEffect(() => {
    AOS.init({
      duration: 700,
      delay: 200, 
      easing: 'ease-in-out', 
      offset: 50, 
    }); 
  }, []);

  const navigate = useNavigate()

  /** title_pt: 'Ajude-nos a salvar pessoas em situação de rua',
      title_en: 'Help us save homeless people', */
  const heroContent = [
    {
      title_pt: 'Ajude-nos a levar esperança a quem mais precisa',
      title_en: 'Help us bring hope to those in need',
      paragraph_en: 'Together, we can make a difference in the lives of those who have lost everything. Your support means hope.',
      paragraph_pt: 'Juntos, podemos fazer a diferença na vida de quem perdeu tudo. Seu apoio é sinônimo de esperança.',
    },
    {
      title_pt: 'Seja a esperança de alguém hoje',
      title_en: 'Be someone’s hope today',
      paragraph_en: 'A simple action can light up a life. Join our mission and bring change where it’s needed most.',
      paragraph_pt: 'Uma ação simples pode iluminar uma vida. Junte-se à nossa missão e leve transformação onde mais precisa.',
    },
    {
      title_pt: 'Estenda a mão e transforme vidas',
      title_en: 'Lend a hand and change lives',
      paragraph_en: 'A small gesture can mean everything to someone in need. Let’s build a future with dignity for all.',
      paragraph_pt: 'Um pequeno gesto pode significar tudo para quem precisa. Vamos construir um futuro com dignidade para todos.',
    }
  ];
  

 
  let aboutItems = [
    {
      icon: <Target size={24} />,
      title_pt: "Missão",
      title_en: "Mission",
      paragraph_pt:
       // "A nossa missão é promover a dignidade humana, inclusão social e apoio às pessoas em situação de vulnerabilidade, através de acções solidárias e com empatia.",
       " Nossa missão é transformar a vida daqueles que cruzam nosso caminho, proporcionando uma rede de apoio sólida e esperança para um futuro melhor.",
      paragraph_en:
        "Our mission is to promote human dignity, social inclusion, and support for people in vulnerable situations through solidarity and empathy-driven actions.",
    },
    {
      icon: <Eye size={24} />,
      title_pt: "Visão",
      title_en: "Vision",
      paragraph_pt:
        "Queremos contribuir para uma sociedade mais humana e solidária, onde todas as pessoas tenham acesso ao apoio necessário para viver com dignidade.",
      paragraph_en:
        "We aim to contribute to a more humane and supportive society, where everyone has access to the support they need to live with dignity.",
    },
    {
      icon: <Flag size={24} />,
      title_pt: "Objectivo",
      title_en: "Goal",
      paragraph_pt:
        "Mobilizar recursos e pessoas para apoiar comunidades carenciadas, oferecendo ajuda concreta e contínua que melhore as condições de vida.",
      paragraph_en:
        "To mobilize resources and people to support underprivileged communities, providing concrete and continuous help that improves living conditions.",
    },
  ];
  

  return (
     <>
              <DonationsDialog show={showDonationDialog} setShow={setShowDonationDialog}/>
              <YouTubeVideoPopUp link={YouTubeVideoLink} setLink={setYouTubeVideoLink}/>
              <HowToDonateDialog show={showHowToDonateDialog} setShow={setShowHowToDonateDialog}/>
              
              <DefaultLayout>
                      <section id="home" className="home-hero max-md:pt-[50px]  w-full bg-app_primary-main min-h-[120vh] max-md:min-h-[70vh] relative">
                                <div className="hero-slider  top-0 left-0 absolute w-full h-full">
                                      <FullPageSlider activeSlide={activeSlide} setActiveSlide={setActiveSlide}/>  
                                </div>
                                {heroContent.map((i,_i)=>{
                                   return (
                                   <div className={`w-full ${activeSlide==_i ? 'opacity-100 active':'opacity-0'} min-h-[120vh]  max-md:min-h-[70vh] text-c flex flex-col justify-center bg-[rgba(0,0,0,0.4)] px-[70px] max-md:px-5 absolute left-0 top-0`}>
                                     <div className="h-[90px] md:hidden"></div>
                                     <h2 className="text-[47px] max-md:text-[30px] uppercase font-semibold text-white max-w-[800px] _animate_left">            
                                        {i[`title_`+i18next.language]}
                                     </h2>
                                    <p className="text-white max-md:my-2 text-[15px] max-md:text-[16px] max-w-[700px] _animate_top">{i[`paragraph_`+i18next.language]}</p>
                                    <div className="mt-4 gap-x-3 flex z-10 _animate_top _join">
                                      <button onClick={()=>{
                                           setTimeout(()=>data._showPopUp('join'))
                                          // data._scrollToSection('about')
                                      }} className="text-rose-600 hover:bg-rose-700 hover:text-white bg-white text-sm rounded px-4 py-3">{t('common.become-member')}</button>
                                      <button onClick={()=>{
                                           navigate('/campaigns')
                                      }} className="bg-rose-600 hover:bg-rose-700 text-white text-sm rounded px-4 py-3">{t('common.our-causes')}</button>
                                    </div>
                                  </div>
                                )})}

                      </section>

                      {(data._home_campaigns.data || []).length!=0 && <section className="bg-gray-200 px-10 max-md:px-5">
                           <div className="md:------translate-y-[25%]">
                                <HeroDonations showHowToDonateDialog={showHowToDonateDialog} setShowHowToDonateDialog={setShowHowToDonateDialog} showDonationDialog={showDonationDialog} setShowDonationDialog={setShowDonationDialog} YouTubeVideoLink={YouTubeVideoLink} setYouTubeVideoLink={setYouTubeVideoLink}/>
                           </div>
                      </section>}

                      <div id="about" className="-translate-y-[50px]"></div>
                      <section  className="bg-white  lg:flex __lg:items-center lg:justify-between">
                        <div className="lg:w-1/2 mb-10 lg:mb-0 h-full">
                           <img
                             src={AboutImg}
                             alt="Volunteers"
                             className="shadow-lg w-full"
                           />
                         </div>
       
                         <div className="lg:w-1/2 lg:px-12 max-lg:px-5 py-10">
                           <h2 className="text-3xl max-md:text-[24px] font-bold text-gray-900 mb-4 max-md:text-center">
                             {t('common.about-title')}
                           </h2>
                           <p className="text-gray-600 mb-8 max-md:text-[14px] max-md:text-center">
                             {t('common.about-paragraph')}
                           </p>
                           <div className="space-y-6">
                             {aboutItems.map((i,_i)=>(
                               <div className="p-6 shadow">
                                   <div className="flex items-start gap-4 max-md:flex-col max-md:items-center">
                                     <div className="bg-red-600 text-white p-4 rounded-full">
                                        {i.icon}
                                     </div>
                                     <div className=" max-md:flex flex-col items-center">
                                       <h3 className="text-lg font-semibold mb-2">{i[`title_`+i18next.language]}</h3>
                                       <p className="text-gray-600 max-md:text-center max-md:text-[14px]">
                                        {i[`paragraph_`+i18next.language]}
                                       </p>
                                     {/** <button variant="link" className="text-red-600 px-0 mt-2">READ MORE</button> */}
                                     </div>
                                   </div>
                             </div>
                             ))}
                            
                           </div>
                         </div>
                       </section>
                       
                       {(data._home_campaigns.data || []).length!=0 && <section id="campaigns" className="bg-gray-100 pb-20">
                         <SectionTopContent title={t('common.our-campaigns')} paragraph={t('paragraphs.campaigns')}/>
                         <CampaignList campaigns={(data._home_campaigns.data || []).filter((_,_i)=>_i <= 5)} showHowToDonateDialog={showHowToDonateDialog} setShowHowToDonateDialog={setShowHowToDonateDialog} showDonationDialog={showDonationDialog} setShowDonationDialog={setShowDonationDialog}/>
                         {((data._home_campaigns.data || []).length >= 4) && <button onClick={()=>{
                                  navigate('/campaigns')
                          }} className="mt-6 bg-rose-600 mx-auto flex items-center text-white px-4 py-2 rounded hover:bg-rose-700 text-sm font-semibold self-start">
                              {t('common.see-all-campaigns')}  
                              <span  className="ml-2"><svg className={`-rotate-90`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="m480-340 180-180-57-56-123 123-123-123-57 56 180 180Zm0 260q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></span>
                          </button>}
                       </section>}

                       {(data._home_events.data || []).length!=0 && <section id="events" className="bg-white pb-20">
                          <SectionTopContent title={t('common.our-events')} paragraph={t('paragraphs.events')}/>
                          <EventCards events={(data._home_events.data || []).filter((_,_i)=>_i <= 4)}/>
                         {((data._home_events.data || []).length >= 5) && <button onClick={()=>{
                              navigate('/events')
                          }} className="mt-6 bg-rose-600 mx-auto flex items-center text-white px-4 py-2 rounded hover:bg-rose-700 text-sm font-semibold self-start">
                              {t('common.see-all-events')}  
                              <span  className="ml-2"><svg className={`-rotate-90`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="m480-340 180-180-57-56-123 123-123-123-57 56 180 180Zm0 260q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></span>
                          </button>}
                       </section>}

                       <section className="bg-[#111827] py-24 px-4 sm:px-6 lg:px-8 relative">
                          <div className=" w-full h-full bg-[rgba(0,0,0,0.3)]  object-cover absolute left-0 top-0">
                          </div>
                          <div className="max-w-4xl mx-auto text-center relative z-10">
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
                              {t('common.join-title')}
                            </h2>
                            <p className="text-[14px] text-gray-50 mb-8">
                              {t('common.join-text')}
                            </p>
                              <div
                                onClick={()=>{
                                  setTimeout(()=>data._showPopUp('join'))
                                }}
                                className="_join inline-block cursor-pointer bg-rose-500 text-white text-lg font-medium px-6 py-3 rounded-full hover:bg-rose-500 transition"
                              >
                                Junte-se a Nós
                              </div>
                          </div>
                        </section>

                       
                        {(data._gallery_categories.data || []).length!=0 && <section id="projects" className="bg-gray-100 pb-20">
                          <SectionTopContent title={t('common.our-gallery')} paragraph={t('paragraphs.gallery')}/>
                          <ImageGallery/>
                       </section>}

                       {(data._home_volunteers.data || []).length!=0 && <section id="volunteers" className="bg-white pb-20">
                         <SectionTopContent title={t('common.volunteers-title')} paragraph={t('paragraphs.volunteers')}/>
                         <VolunteersSlider/>
                         
                       </section>}

              </DefaultLayout>
     </>
  );
}

export default App;
