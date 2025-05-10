
import {
    LayoutDashboard,
    HandCoins,
    CalendarCheck2,
    Image,
    SlidersHorizontal,
    Megaphone,
    Plus,
    LogOut,
    Tags,
    CreditCard,
    UserPlus,
    Handshake,
    ThumbsUp,
    Mail,
    Newspaper,
    User,
    Users,
    InfoIcon
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Delete from "../components/modals/delete";
import { useData } from "../../contexts/DataContext";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Preloader from "../../components/loaders/preloader";


export default function DefaultAdminLayout({children,addBtn,hide,refresh}) {
    if(hide){
        return children
    }
    const {pathname}=useLocation()
    const navigate=useNavigate()
    const data=useData()
    const [openMenu,setOpenMenu]=useState()
    const {user} = useAuth()

     useEffect(()=>{
          data.setSelectedTableItems([])
    },[pathname])

    if(!user){
       return <Preloader showAnyway={true}/>
    }


    return (
     <div>
        <Delete show={data._openPopUps.delete}/>
        <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
           <div className="px-3 py-3 lg:px-5 lg:pl-3">
              <div className="flex items-center justify-between">
                 <div className="flex items-center justify-start">
                    <button onClick={()=>setOpenMenu(!openMenu)} id="toggleSidebarMobile" aria-expanded="true" aria-controls="sidebar" className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded">
                       <svg id="toggleSidebarMobileHamburger" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                       </svg>
                       <svg id="toggleSidebarMobileClose" className="w-6 h-6 hidden" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                       </svg>
                    </button>
                    <a className="text-xl font-bold flex items-center lg:ml-2.5">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => {
                               navigate('/dashboard')   
                    }}>
                    <div className="text-rose-600 text-[20px] font-bold">❤️</div>
                    <div className="mr-2">
                        <div className="text-lg font-bold">Abraço Sereno</div>
                    </div>
                    </div>
                    </a>
                    
                   
                 </div>
                 <div className="flex items-center">
                     
                     {addBtn && <a onClick={addBtn.onClick} class="inline-flex cursor-pointer ml-5 text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-[0.3rem] text-sm px-5 py-2.5 text-center items-center mr-3">
                           <Plus size={19}/>
                           <label className="max-lg:hidden cursor-pointer">{addBtn.label}</label>
                     </a>}
                     {refresh && <div onClick={()=>
                              data.setUpdateTable(Math.random())
                              } className="mr-2 cursor-pointer hover:opacity-65">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/></svg>
                     </div>}
                 </div>
                 
              </div>
           </div>
        </nav>
        <div className="flex overflow-hidden bg-white pt-16">
           <aside id="sidebar" className={`fixed  z-20 h-full top-0 left-0 pt-16 flex lg:flex flex-shrink-0 flex-col w-64 transition-width ${!openMenu ? 'max-lg:w-[0px]':''} duration-75`} aria-label="Sidebar">
              <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
                 <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                    <div className="flex-1 px-3 bg-white divide-y space-y-1">
                       <ul className="space-y-2 pb-2">
                          <li>
                             <a onClick={()=>{
                                      navigate('/dashboard')
                             }} className="text-base cursor-pointer text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                                 <LayoutDashboard size={24}/>
                                <span className={`ml-3 ${pathname=="/" || pathname.includes('/dashboard') ? 'font-semibold':''}`}>Dashboard</span>
                             </a>
                          </li>
                          <li>
                             <a onClick={()=>{
                                navigate('/admin/campaigns')
                             }} target="_blank" className="text-base cursor-pointer text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                                <Megaphone className="flex-shrink-0" size={24} />
                                <span className={`ml-3 flex-1 whitespace-nowrap ${pathname.includes('/admin/campaign') || pathname.includes('/admin/campaign/create') ? 'font-semibold':''}`} >Campanhas</span>
                            </a>
                          </li>
                          <li>
                             <a onClick={()=>{
                                navigate('/admin/events')
                             }} className="text-base cursor-pointer text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                                <CalendarCheck2 className="flex-shrink-0" size={24} />
                                <span className={`ml-3 flex-1 whitespace-nowrap ${pathname.includes('/admin/event') || pathname.includes('/admin/event/create') ? 'font-semibold':''}`} >Eventos</span>
                             </a>
                          </li>
                          
                          <li>
                             <a onClick={()=>{
                                navigate('/admin/gallery')
                             }} className="text-base cursor-pointer text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                                 <Image className="flex-shrink-0" size={24} />
                                <span className={`ml-3 flex-1 whitespace-nowrap ${(pathname.includes('/admin/gallery') && !pathname.includes('categories') && !pathname.includes('category')) || pathname.includes('/admin/gallery/update') ? 'font-semibold':''}`} >Galeria</span>
                             </a>
                          </li>

                          <li>
                             <a onClick={()=>{
                                navigate('/admin/gallery-categories')
                             }} className="text-base  cursor-pointer text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                                 <Tags className="flex-shrink-0" size={24} />
                                 <span className={`ml-3 flex-1 ${pathname.includes('/admin/gallery-category') || pathname.includes('/admin/gallery-categories') ? 'font-semibold':''}`} >Categorias de Galeria</span>
                             </a>
                          </li>

                          <li>
                             <a onClick={()=>{
                                navigate('/admin/payment-methods')
                             }} className="text-base cursor-pointer text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                                 <CreditCard className="flex-shrink-0" size={24} />
                                <span className={`ml-3 flex-1 ${pathname.includes('/admin/payment-method') || pathname.includes('/admin/payment-method/update') ? 'font-semibold':''}`}>Método de pagamento </span>
                             </a>
                          </li>

                          <li>
                             <a onClick={()=>{
                                navigate('/admin/donors')
                             }} className="text-base cursor-pointer text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group">
                                 <Users className="flex-shrink-0" size={24} />
                                <span className={`ml-3 flex-1 ${pathname.includes('/admin/donors') || pathname.includes('/admin/donors/update') ? 'font-semibold':''}`}>Doadores</span>
                             </a>
                          </li>

                          <li>
                             <a onClick={()=>{
                                navigate('/admin/volunteers')
                             }} className="text-base cursor-pointer text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                                 <Handshake className="flex-shrink-0" size={24} />
                                <span className={`ml-3 flex-1 whitespace-nowrap ${pathname.includes('/admin/volunteer') || pathname.includes('/admin/volunteer/update') ? 'font-semibold':''}`}>Voluntários</span>
                             </a>
                          </li> 

                          <li>
                             <a onClick={()=>{
                                navigate('/admin/feedback')
                             }} className="text-base cursor-pointer text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                                 <ThumbsUp className="flex-shrink-0" size={24} />
                                <span className={`ml-3 flex-1 whitespace-nowrap ${pathname.includes('/admin/feedback') || pathname.includes('/admin/feedback/update') ? 'font-semibold':''}`}>Feedback</span>
                             </a>
                          </li>

                          <li>
                             <a onClick={()=>{
                                navigate('/admin/contacts')
                             }} className="text-base cursor-pointer text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                                 <Mail className="flex-shrink-0" size={24} />
                                <span className={`ml-3 flex-1 whitespace-nowrap ${pathname.includes('/admin/contact') || pathname.includes('/admin/contact/update') ? 'font-semibold':''}`}>Contacto</span>
                             </a>
                          </li>

                          <li>
                             <a onClick={()=>{
                                navigate('/admin/newsletter')
                             }} className="text-base cursor-pointer text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group">
                                 <Newspaper className="flex-shrink-0" size={24} />
                                <span className={`ml-3 flex-1 whitespace-nowrap ${pathname.includes('/admin/newsletter') || pathname.includes('/admin/newsletter/update') ? 'font-semibold':''}`}>Newspaper</span>
                             </a>
                          </li>

                          <li>
                             <a onClick={()=>{
                                navigate('/admin/settings')
                             }} className="text-base cursor-pointer text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group">
                                 <InfoIcon className="flex-shrink-0" size={24} />
                                <span className={`ml-3 flex-1 whitespace-nowrap ${pathname.includes('/admin/settings') ? 'font-semibold':''}`}>Informação da página</span>
                             </a>
                        </li>


                          
                          <li>
                             <a onClick={()=>{
                                 if (!window.confirm('Tem certeza que deseja sair?')) return;
                                 localStorage.removeItem('token')
                                 window.location.href="/login"
                             }} className="text-base cursor-pointer text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ">
                                 <LogOut size={24} />
                                <span className={`ml-3 flex-1 whitespace-nowrap`} >Sair</span>
                             </a>
                          </li>
                         
                         
                       </ul>
                     
                    </div>
                 </div>
              </div>
           </aside>
           <div onClick={()=>setOpenMenu(false)} className={`bg-gray-900 opacity-50 ${!openMenu ? 'hidden':''} fixed inset-0 z-10`} id="sidebarBackdrop"></div>
           <div id="main-content" className="h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-64">
              <main>
                 {children}
              </main>
           </div>
        </div>
      
     </div>
     
     
       );
     }
     