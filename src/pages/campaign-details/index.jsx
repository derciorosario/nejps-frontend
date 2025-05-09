import React,{useEffect, useState} from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import i18next, { t } from 'i18next';
import PagesHero from '../../components/Section/pagesHero';
import YouTubeVideoPopUp from '../../components/video/YoutubeVideoPopUp';
import { useData } from '../../contexts/DataContext';
import DonationsDialog from '../../components/Dialogs/donations-dialog';
import HowToDonateDialog from '../../components/Dialogs/how-to-donate-dialog';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

function App({}) {

  const data=useData()
  const [YouTubeVideoLink,setYouTubeVideoLink]=useState(null)
  const [showDonationDialog,setShowDonationDialog]=useState(false)
  const [showHowToDonateDialog,setShowHowToDonateDialog]=useState(false)
  const {pathname}=useLocation()
  const { id } = useParams()
  const navigate=useNavigate()

  useEffect(()=>{
        data._scrollToSection('home','instant')
  },[])

  const [loading,setLoading]=useState(false)
  const [imageLoaded,setImageLoaded]=useState(false)

  useEffect(()=>{

    if(data.selectedCampaign && data.selectedCampaign?.id==id){
        return
    }

  
    (async()=>{
      try{

        let response=await data.makeRequest({method:'get',url:`api/campaign/`+id,withToken:true,params:{h_n:"true"}, error: ``},0);
        data.setSelectedCampaign(response)

      }catch(e){

        console.log({e})

        let msg="Acorreu um erro, tente novamente"

        if(e.response){
          if(e.response.status==409){
            msg="Email já existe"
          } 
          if(e.response.status==404){
              msg="Item não encontrado"
              navigate('/')
          }
          if(e.response.status==500){
              msg="Erro, inesperado. Contacte seu administrador"
          }

        }else if(e.code=='ERR_NETWORK'){
              msg="Verfique sua internet e tente novamente"
        }

        toast.error(msg)
    }

  })()
},[pathname])

useEffect(()=>{
    if(data.selectedCampaign && data.selectedCampaign?.image_filename){
        setImageLoaded(true)
    }
},[data.selectedCampaign])

  return (
     <>
               <YouTubeVideoPopUp link={YouTubeVideoLink} setLink={setYouTubeVideoLink}/>
               <DonationsDialog show={showDonationDialog} setShow={setShowDonationDialog}/>
               <HowToDonateDialog show={showHowToDonateDialog} setShow={setShowHowToDonateDialog}/>

               <DefaultLayout loading={!data.selectedCampaign || !imageLoaded}>
                       <PagesHero img={'img-1'} name={data.selectedCampaign?.['title_'+i18next.language]}/>
                       <div className="relative bg-white">
                            <section className="py-20  max-w-[900px] mx-auto px-5">
                                    <img className="w-full h-[500px] object-cover" src={data.APP_BASE_URL + "/file/" +data.selectedCampaign?.image_filename} onLoad={()=>setImageLoaded(true)}/>
                                    <h2 className="text-[40px]">{data.selectedCampaign?.['title_'+i18next.language]}</h2>
                                    <p className="text-sm text-gray-700 leading-snug text-justify">
                                                {data.selectedCampaign?.[`description_` + i18next.language]}
                                    </p>
                            </section>
                       </div>
              </DefaultLayout>
     </>
  );
}

export default App;
