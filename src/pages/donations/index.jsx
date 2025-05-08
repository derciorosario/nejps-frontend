import React,{useEffect, useState} from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { t } from 'i18next';
import PagesHero from '../../components/Section/pagesHero';
import SectionTopContent from '../../components/Section/sectionTopContent';
import YouTubeVideoPopUp from '../../components/video/YoutubeVideoPopUp';
import DonationCards from '../../components/Cards/donationsCard';
import { useData } from '../../contexts/DataContext';
import { useLocation } from 'react-router-dom';
import BasicPagination from '../../admin/components/pagination/basic-pagination';
import ItemsLoader from '../../components/loaders/itemsLoader';

function App({}) {

  const [YouTubeVideoLink,setYouTubeVideoLink]=useState(null)
  const data=useData()

    const {pathname}=useLocation()
    const [currentPage,setCurrentPage]=useState(1)
    const [updateFilters,setUpdateFilters]=useState(null)
    const [search,setSearch]=useState('')
  
    let required_data=['donations']
  
    useEffect(()=>{ 
          data.handleLoaded('remove',required_data)
          data._get(required_data,{donations:{name:search,page:currentPage,h_n:true}}) 
    },[pathname,search,currentPage])
  
  
    useEffect(()=>{
    if(data.updateTable || updateFilters){
          data.setUpdateTable(null)
          setUpdateFilters(null)
          data.handleLoaded('remove',required_data)
          setCurrentPage(1)
          setLoading(false)
          data._get(required_data,{donations:{name:search,page:1}}) 
    }
   },[data.updateTable])

    useEffect(()=>{
      data._scrollToSection('home','instant')
     },[])
  

  return (
     <>
               <YouTubeVideoPopUp link={YouTubeVideoLink} setLink={setYouTubeVideoLink}/>
               <DefaultLayout>
                       <PagesHero name={t('menu.donations')}/>
                       <div className="relative bg-white">
                           <section className="pb-20">
                                   <div  id="move_after_pagination">
                                    <SectionTopContent title={t('menu.donations')} paragraph={t('paragraphs.donations')}/> 
                                    </div>                
                                    {data._loaded.includes('donations') && <div className="px-5 flex gap-x-3 flex-wrap justify-center gap-y-2">
                                        <div className="inline-flex px-2 items-center py-2 border border-gray-200 rounded bg-gray-100">
                                            <span className="text-sm mr-2">{t('common.total-donations')}:</span>
                                            <label>{data._donations?.total}</label>
                                        </div>
                                        <div className="inline-flex px-2 items-center py-2 border border-gray-200 rounded bg-gray-100">
                                            <span className="text-sm mr-2">{t('common.raised')}:</span>
                                            <label>{data._cn(data._donations.totalAmount || 0)}MZN</label>
                                        </div>
                                    </div>}
                                    {!data._loaded.includes('donations') && <ItemsLoader/>} 
                                    {data._loaded.includes('donations') && <DonationCards donations={data._donations.data || []}/>}
                                    <BasicPagination goTo={()=>data._scrollToSection('move_after_pagination')} center={true} color={true} show={data._loaded.includes('donations')} from={'donations'} setCurrentPage={setCurrentPage} total={data._donations?.total}  current={data._donations?.currentPage} last={data._donations?.pages}/>
                           </section>
                       </div>
              </DefaultLayout>
     </>
                       
  );
}

export default App;
