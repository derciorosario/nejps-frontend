import React,{useEffect, useState} from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { t } from 'i18next';
import PagesHero from '../../components/Section/pagesHero';
import SectionTopContent from '../../components/Section/sectionTopContent';
import { useData } from '../../contexts/DataContext';
import HomilyListPage from '../../components/Cards/HomilyCard';

function App({}) {

    
   const data=useData()

    useEffect(()=>{
      data._scrollToSection('home','instant')
     },[])
  

  return (
     <>
 <DefaultLayout>
                       <PagesHero name={t('menu.homilies')}/>
                       <div className="relative bg-white">
                           <section>
                                   <div  id="move_after_pagination">
                                    <SectionTopContent title={t('menu.homilies')} paragraph={t('paragraphs.homily-messages')}/> 
                                    </div>                
                                   
                                    <HomilyListPage/>
                                    
                           </section>
                       </div>
              </DefaultLayout>
     </>
                       
  );
}

export default App;
