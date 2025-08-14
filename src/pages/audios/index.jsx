import React,{useEffect, useState} from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { t } from 'i18next';
import PagesHero from '../../components/Section/pagesHero';
import SectionTopContent from '../../components/Section/sectionTopContent';
import { useData } from '../../contexts/DataContext';
import AudioListPage from '../../components/Cards/AudioCard';

function App({}) {

    
   const data=useData()

    useEffect(()=>{
      data._scrollToSection('home','instant')
     },[])
  

  return (
     <>
              <DefaultLayout>
                       <PagesHero name={t('menu.daily-audios')}/>
                       <div className="relative bg-white">
                           <section>
                                   <div  id="move_after_pagination">
                                    <SectionTopContent title={t('menu.daily-audios')} paragraph={t('paragraphs.evangelical-messages')}/> 
                                    </div>                
                                   
                                    <AudioListPage/>
                                    
                           </section>
                       </div>
              </DefaultLayout>
     </>
                       
  );
}

export default App;
