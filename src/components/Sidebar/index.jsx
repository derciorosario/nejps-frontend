import React,{useEffect,useState} from 'react'
import { useTranslation } from 'react-i18next';
import { useData } from '../../contexts/DataContext';
import {  useLocation, useNavigate } from 'react-router-dom';

function Sidebar({openSidebar,setOpenSidebar}) {

    const { t, i18n } = useTranslation();
    const {pathname} = useLocation()

    const data= useData()

    const [menu,setMenu]=useState([])

    const navigate = useNavigate()

    function goto(){

      if(window.location.href.includes('/?about')){
           data._scrollToSection('about')
      }else if(window.location.href.includes('/?contact')){
           data._scrollToSection('contact')
      }else if(window.location.href.includes('/?services')){
        data._scrollToSection('services')
      }else if(pathname=="/"){
          data._scrollToSection('home')
      }
  
    }
  
    useEffect(()=>{
       goto()
    },[])

   
    useEffect(()=>{

        setMenu([
            {name:t('menu.home'),path:'/'},
            {name:t('menu.about-us'),path:'/?about'},
            {name:t('menu.contact'),path:'/?contact'},
            {name:t('menu.services'),path:'/?services'},
        ])

    },[i18n.language])

  return (
    <div style={{zIndex:9999}} className={`min-w-[300px] ${!openSidebar ? ' translate-x-[100%] ':''} h-[100vh] transition duration-150 ease-in-out bg-white fixed right-0`}>
           <div onClick={()=>setOpenSidebar(false)} className="bg-honolulu_blue-500 cursor-pointer hover:opacity-90 w-[40px] h-[40px] fixed right-3 top-3 z-30 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
           </div>

          <div className="mt-5 flex flex-col p-12">
            {menu.map(i=>(
                        <a className="hover:text-app_primary-500 mb-3 text-[24px] font-bold cursor-pointer"  onClick={()=>{
                          navigate(i.path)
                          goto()
                          setOpenSidebar(!openSidebar)
                        }}>{i.name}</a>
            ))}
          </div>
    </div>
  )
}

export default Sidebar