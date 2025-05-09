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
import EventCards from '../../components/Cards/EventCards';

function App({}) {
  const data=useData()
  const [YouTubeVideoLink,setYouTubeVideoLink]=useState(null)
  const [showDonationDialog,setShowDonationDialog]=useState(false)
  const [showHowToDonateDialog,setShowHowToDonateDialog]=useState(false)
  const {pathname}=useLocation()
  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [search,setSearch]=useState('')

  let required_data=['events']

  useEffect(()=>{ 
        data.handleLoaded('remove',required_data)
        data._get(required_data,{events:{name:search,page:currentPage}}) 
  },[pathname,search,currentPage])


  useEffect(()=>{
  if(data.updateTable || updateFilters){
        data.setUpdateTable(null)
        setUpdateFilters(null)
        data.handleLoaded('remove',required_data)
        setCurrentPage(1)
        setLoading(false)
        data._get(required_data,{events:{name:search,page:1}}) 
  }
 },[data.updateTable])

  useEffect(()=>{
    data._scrollToSection('home','instant')
  },[])

  return (
     <>
               <YouTubeVideoPopUp link={YouTubeVideoLink} setLink={setYouTubeVideoLink}/>
               <DonationsDialog show={showDonationDialog} setShow={setShowDonationDialog}/>
               <HowToDonateDialog show={showHowToDonateDialog} setShow={setShowHowToDonateDialog}/>
               <DefaultLayout>
                       <PagesHero name={t('menu.events')}/>
                       <div className="relative bg-white">
                            <section className="pb-20">
                                    <div  id="move_after_pagination">
                                      <SectionTopContent title={t('common.events')} paragraph={t('paragraphs.events')}/>  
                                    </div>
                                    {!data._loaded.includes('events') && <ItemsLoader/>}               
                                    {data._loaded.includes('events') && <EventCards events={data._events.data || []} setShowHowToDonateDialog={setShowHowToDonateDialog} showDonationDialog={showDonationDialog} setShowDonationDialog={setShowDonationDialog}/>}
                                    <BasicPagination goTo={()=>data._scrollToSection('move_after_pagination')} center={true} color={true} show={data._loaded.includes('events')} from={'events'} setCurrentPage={setCurrentPage} total={data._events?.total}  current={data._events?.page} last={data._events?.totalPages}/>
                            </section>
                       </div>
              </DefaultLayout>
     </>
  );
}

export default App;
