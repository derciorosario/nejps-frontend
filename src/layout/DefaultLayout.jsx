import React,{useState} from 'react'
import { useData } from '../contexts/DataContext'
import Preloader from '../components/loaders/preloader'
import Header from '../components/header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import WhatsAppOption from '../components/modals/chooseWhatsappOption'
import Feedback from '../components/PopUp/feedback'
import { useLocation } from 'react-router-dom'
import JoinAsDonor from '../components/Dialogs/join-us'

function DefaultLayout({children}) {
  const [openSidebar,setOpenSidebar]=useState(false)
  const [showWhatsappOptions,setShowWhatsappOptions]=useState(false)
  const data=useData()
  const {pathname} = useLocation()

  return (
   <>
     <Preloader showAnyway={(!data.initialized || !data.isPreloaderLoaded) && (pathname=="/" || pathname=="/campaigns")}/> 
     <Feedback/>
     <JoinAsDonor/>
    <div id={'top'} className="min-h-[100vh] relative overflow-hidden">
          <WhatsAppOption show={showWhatsappOptions} setShow={setShowWhatsappOptions}/>
          <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar}/>
          <div onClick={()=>{
            if(openSidebar)  setOpenSidebar(false)
            }} className={`${openSidebar ? 'p-2 blur-md':''} overflow-hidden w-full transition duration-150 ease-in-out`}>
                <Header  setShowWhatsappOptions={setShowWhatsappOptions} setOpenSidebar={setOpenSidebar} openSidebar={openSidebar}/>
                {children}
                <Footer  setShowWhatsappOptions={setShowWhatsappOptions}/>
            </div>
       
    </div>
   </>
  )
}

export default DefaultLayout