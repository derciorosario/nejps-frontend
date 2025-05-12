import React,{useEffect, useState} from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { t } from 'i18next';
import PagesHero from '../../components/Section/pagesHero';
import SectionTopContent from '../../components/Section/sectionTopContent';
import { useData } from '../../contexts/DataContext';
import VolunteerList from '../../components/Cards/VolunteerCard';
import BasicPagination from '../../admin/components/pagination/basic-pagination';
import ItemsLoader from '../../components/loaders/itemsLoader';
import { useLocation } from 'react-router-dom';

function App({}) {

      const data=useData()
      const {pathname}=useLocation()
      const [currentPage,setCurrentPage]=useState(1)
      const [updateFilters,setUpdateFilters]=useState(null)
      const [search,setSearch]=useState('')
    
      let required_data=['volunteers']
    
      useEffect(()=>{ 
            data.handleLoaded('remove',required_data)
            data._get(required_data,{volunteers:{name:search,page:currentPage,h_n:true}}) 
      },[pathname,search,currentPage])
    
    
      useEffect(()=>{
      if(data.updateTable || updateFilters){
            data.setUpdateTable(null)
            setUpdateFilters(null)
            data.handleLoaded('remove',required_data)
            setCurrentPage(1)
            setLoading(false)
            data._get(required_data,{volunteers:{name:search,page:1}}) 
      }
     },[data.updateTable])
  
     useEffect(()=>{
        data._scrollToSection('home','instant')
     },[])
    

    return (
     <>
               <DefaultLayout>
                       <PagesHero  img={'img-1'} name={t('common.see-our-volunteers')}/>
                       <div className="relative bg-white">
                            <section className="pb-20">
                                     <SectionTopContent title={t('common.our-volunteers')} paragraph={t('paragraphs.volunteers')}/>             
                                     {!data._loaded.includes('volunteers') && <ItemsLoader/>} 
                                     {data._loaded.includes('volunteers') && <VolunteerList volunteers={data._volunteers.data || []}/>}
                                     <BasicPagination goTo={()=>data._scrollToSection('move_after_pagination')} center={true} color={true} show={data._loaded.includes('volunteers')} from={'volunteers'} setCurrentPage={setCurrentPage} total={data._volunteers?.total}  current={data._volunteers?.page} last={data._volunteers?.totalPages}/>
                            </section>

                       </div>
              </DefaultLayout>

     </>
  );
}

export default App;
