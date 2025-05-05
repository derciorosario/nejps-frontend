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
import ItemsLoader from '../../components/loaders/itemsLoader';
import { useLocation } from 'react-router-dom';
import BasicPagination from '../../admin/components/pagination/basic-pagination';

function App({}) {
  const data=useData()
  const [YouTubeVideoLink,setYouTubeVideoLink]=useState(null)
  const [showDonationDialog,setShowDonationDialog]=useState(false)
  const [showHowToDonateDialog,setShowHowToDonateDialog]=useState(false)
  const {pathname}=useLocation()
  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [search,setSearch]=useState('')

  let required_data=['campaigns']

  useEffect(()=>{ 
        data.handleLoaded('remove',required_data)
        data._get(required_data,{campaigns:{name:search,page:currentPage}}) 
  },[pathname,search,currentPage])



  useEffect(()=>{
  if(data.updateTable || updateFilters){
        data.setUpdateTable(null)
        setUpdateFilters(null)
        data.handleLoaded('remove',required_data)
        setCurrentPage(1)
        setLoading(false)
        data._get(required_data,{campaigns:{name:search,page:1}}) 
  }
 },[data.updateTable])

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
                                    {!data._loaded.includes('campaigns') && <ItemsLoader/>}               
                                    {data._loaded.includes('campaigns') && <CampaignList campaigns={data._campaigns.data || []} setShowHowToDonateDialog={setShowHowToDonateDialog} showDonationDialog={showDonationDialog} setShowDonationDialog={setShowDonationDialog}/>}
                                    <BasicPagination center={true} color={true} show={data._loaded.includes('campaigns')} from={'campaigns'} setCurrentPage={setCurrentPage} total={data._campaigns?.total}  current={data._campaigns?.currentPage} last={data._campaigns?.pages}/>
                            </section>
                       </div>
              </DefaultLayout>
     </>
  );
}

export default App;
