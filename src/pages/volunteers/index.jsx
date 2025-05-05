import React,{useEffect, useState} from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import CampaignList from '../../components/Cards/CampaignCard';
import { t } from 'i18next';
import PagesHero from '../../components/Section/pagesHero';
import HeroDonations from '../../components/Silders/heroDonations';
import SectionTopContent from '../../components/Section/sectionTopContent';
import YouTubeVideoPopUp from '../../components/video/YoutubeVideoPopUp';
import { useData } from '../../contexts/DataContext';
import DonationsDialog from '../../components/Dialogs/donations-dialog';
import HowToDonateDialog from '../../components/Dialogs/how-to-donate-dialog';
import toast from 'react-hot-toast';

function App({}) {
  const data=useData()
  const [YouTubeVideoLink,setYouTubeVideoLink]=useState(null)
  const [showDonationDialog,setShowDonationDialog]=useState(false)
  const [showHowToDonateDialog,setShowHowToDonateDialog]=useState(false)

  useEffect(()=>{
    data._scrollToSection('home')
  },[])


  

     

  return (
     <>
               <YouTubeVideoPopUp link={YouTubeVideoLink} setLink={setYouTubeVideoLink}/>
               <DonationsDialog show={showDonationDialog} setShow={setShowDonationDialog}/>
               <HowToDonateDialog show={showHowToDonateDialog} setShow={setShowHowToDonateDialog}/>
               <DefaultLayout>
                       <PagesHero name={t('menu.campaigns')}/>
                       <div className="relative bg-white">
                            <section className="bg-gray-200 px-10 max-md:px-5">
                                    <HeroDonations showHowToDonateDialog={showHowToDonateDialog} setShowHowToDonateDialog={setShowHowToDonateDialog} showDonationDialog={showDonationDialog} setShowDonationDialog={setShowDonationDialog} YouTubeVideoLink={YouTubeVideoLink} setYouTubeVideoLink={setYouTubeVideoLink}/>
                            </section>
                            <section className="pb-20">
                                    <SectionTopContent title={t('common.causes')} paragraph={t('paragraphs.causes')}/>                 
                                    <CampaignList setShowHowToDonateDialog={setShowHowToDonateDialog} showDonationDialog={showDonationDialog} setShowDonationDialog={setShowDonationDialog}/>
                            </section>
                       </div>
              </DefaultLayout>

     </>
  );
}

export default App;
