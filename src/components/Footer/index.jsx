import React, { useState } from 'react';
import { FaHome, FaEnvelope, FaMapMarkerAlt, FaPhone, FaPaperPlane } from 'react-icons/fa';
import { useData } from '../../contexts/DataContext';
import i18next, { t } from 'i18next';


import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const Footer = () => {

  const navigate = useNavigate()

  const data=useData()
  const [valid,setValid]=useState(false)
  const [loading,setLoading]=useState(false);

  let initial_form={
    email:''
  }

  let [form,setForm]=useState(initial_form)

  async function SubmitForm(){

  if(loading){
    return
  }

  if(!form.email){
    toast.error(t('common.insert-email'))
    return
  }

  if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))){
    toast.error(t('common.invalid-email'))
    setLoading(false)
    return
  }

  setLoading(true)

  try{

    let form_data={
        ...form
    }
    await data.makeRequest({method:'post',url:`api/newsletter/`,withToken:true,data:form_data, error: ``},0);
    toast.success(t('common.added-successfully'))
    setForm(initial_form)
    setLoading(false)

}catch(e){

    let msg="Acorreu um erro, tente novamente"
    console.log(e)
    setLoading(false)

    if(e.response){
      if(e.response.status==409){
        toast.success(t('common.added-successfully'))
        setForm(initial_form)
        return
      }
      if(e.response.status==400){
          msg="Dados inválidos"
      }
      if(e.response.status==500){
          msg="Erro, inesperado. Contacte seu administrador"
      }

    }else if(e.code=='ERR_NETWORK'){
          msg="Verfique sua internet e tente novamente"
    }

    toast.error(msg)
    setLoading(false)
}

}

  return (
    <>
     <div  onClick={()=>{
           window.location.href="https://wa.me/258823751030"
     }} style={{zIndex:48}} className={`w-[40px] shadow h-[40px] max-md:h-[45px] max-md:w-[45px] cursor-pointer  ${data.scrollY < 100 ? 'opacity-0 scale-50':''} ease-in transition-all delay-100 fixed  right-4 bottom-4 rounded-full flex items-center justify-center bg-[#25D366]  shadow-sm`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488L3 21.116l4.759-1.249a8.981 8.981 0 0 0 4.29 1.093h.004c4.947 0 8.975-4.027 8.977-8.977a8.926 8.926 0 0 0-2.627-6.35m-6.35 13.812h-.003a7.446 7.446 0 0 1-3.798-1.041l-.272-.162-2.824.741.753-2.753-.177-.282a7.448 7.448 0 0 1-1.141-3.971c.002-4.114 3.349-7.461 7.465-7.461a7.413 7.413 0 0 1 5.275 2.188 7.42 7.42 0 0 1 2.183 5.279c-.002 4.114-3.349 7.462-7.461 7.462m4.093-5.589c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112s-.58.729-.711.879-.262.168-.486.056-.947-.349-1.804-1.113c-.667-.595-1.117-1.329-1.248-1.554s-.014-.346.099-.458c.101-.1.224-.262.336-.393.112-.131.149-.224.224-.374s.038-.281-.019-.393c-.056-.113-.505-1.217-.692-1.666-.181-.435-.366-.377-.504-.383a9.65 9.65 0 0 0-.429-.008.826.826 0 0 0-.599.28c-.206.225-.785.767-.785 1.871s.804 2.171.916 2.321c.112.15 1.582 2.415 3.832 3.387.536.231.954.369 1.279.473.537.171 1.026.146 1.413.089.431-.064 1.327-.542 1.514-1.066.187-.524.187-.973.131-1.067-.056-.094-.207-.151-.43-.263"/></svg> 
     </div>

    <div className="bg-gray-900 text-white py-12 px-6 md:px-16 relative" id="contact">
      <div className="grid md:grid-cols-3 gap-10">
        {/* About Us */}
        <div>

          <h2 className="text-xl font-bold uppercase mb-2">{t('menu.about-us')}</h2>
          <div className="w-10 h-1 bg-pink-600 mb-4" />
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            {t('common.about-footer-content')}
          </p>
          {data._settings?.contact && <div className="flex items-center gap-3 mb-3">
            <FaPhone className="text-pink-600 shrink-0" />
            <span className="w-full break-all">{data._settings?.contact}</span>
          </div>}
          {data._settings?.website && <div className="flex items-center gap-3 mb-3">
            <FaHome className="text-pink-600 shrink-0" />
            <span className="w-full break-all">{data._settings?.website}</span>
          </div>}
          {data._settings?.email && <div className="flex items-center gap-3 mb-3">
            <FaEnvelope className="text-pink-600 shrink-0" />
            <span className="w-full break-all">{data._settings?.email}</span>
          </div>}

          {data._settings?.address && <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-pink-600 shrink-0" />
            <span className="w-full break-all">{data._settings?.address}</span>
          </div>}

      </div>
        {/* Recent Posts */}
        <div>
          <h2 className="text-xl font-bold uppercase mb-2">{t('common.recent-campaigns')}</h2>
          <div className="w-10 h-1 bg-pink-600 mb-4" />
          {((data._home_campaigns.data || []).filter((_,_i)=>_i <= 1)).map((post, index) => (
            <div onClick={()=>{
                 data._scrollToSection('home');
                 data.setSelectedCampaign(post);
                navigate('/campaign/' + post.id);
            }} className={`flex ${index!=0 ? 'border-t border-[#41414a]':''} items-start cursor-pointer hover:opacity-40 gap-4 py-3`} key={index}>
              <img src={data.APP_BASE_URL+"/file/"+post.image_filename} className={`w-16 h-16 ${!post.image_filename ? 'pointer-events-none bg-gray-300':''} object-cover rounded`} />
              <div>
                <p className="font-medium text-sm">{post['title_'+i18next.language]}</p>
                <p className="text-xs text-gray-400 mt-1">{post.date.split('T')[0]?.split('-')?.reverse()?.join('/')}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Twitter Widget */}
        <div>
          <h2 className="text-xl font-bold uppercase mb-2">{t('common.social-media')}</h2>
          <div className="w-10 h-1 bg-pink-600 mb-4" />
          <div className="flex items-center gap-x-2">
                     <a target="_blank" href={data._settings?.facebook_link}>
                          <svg className="fill-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 0 24 24"><path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.615v-6.96h-2.338v-2.725h2.338v-2c0-2.325 1.42-3.592 3.5-3.592.699-.002 1.399.034 2.095.107v2.42h-1.435c-1.128 0-1.348.538-1.348 1.325v1.735h2.697l-.35 2.725h-2.348V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"/></svg>
                     </a>
                    {/** <a target="_blank" href="https://www.instagram.com/dronlinemz?igsh=NGloMWhyMjRnZ2hi">
                          <svg className="fill-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 0 24 24"><path d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008z"/><circle cx="16.806" cy="7.207" r="1.078"/><path d="M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71 0 2.442 0 2.753.056 3.71.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419 4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217zm-1.218 9.532a5.043 5.043 0 0 1-.311 1.688 2.987 2.987 0 0 1-1.712 1.711 4.985 4.985 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 0 1-1.669-.311 2.985 2.985 0 0 1-1.719-1.711 5.08 5.08 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654 0-2.437 0-2.686.053-3.655a5.038 5.038 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 0 1 1.67.311 2.991 2.991 0 0 1 1.712 1.712 5.08 5.08 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655 0 2.436 0 2.698-.043 3.654h-.011z"/></svg>
                     </a>
                      */}
                     <a target="_blank" href={data._settings?.whatsapp_link}>
                       <svg className="fill-white flex-shrink-0" height="21px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 308 308" xml:space="preserve"><g id="XMLID_468_"><path id="XMLID_469_" d="M227.904,176.981c-0.6-0.288-23.054-11.345-27.044-12.781c-1.629-0.585-3.374-1.156-5.23-1.156
                         c-3.032,0-5.579,1.511-7.563,4.479c-2.243,3.334-9.033,11.271-11.131,13.642c-0.274,0.313-0.648,0.687-0.872,0.687
                         c-0.201,0-3.676-1.431-4.728-1.888c-24.087-10.463-42.37-35.624-44.877-39.867c-0.358-0.61-0.373-0.887-0.376-0.887
                         c0.088-0.323,0.898-1.135,1.316-1.554c1.223-1.21,2.548-2.805,3.83-4.348c0.607-0.731,1.215-1.463,1.812-2.153
                         c1.86-2.164,2.688-3.844,3.648-5.79l0.503-1.011c2.344-4.657,0.342-8.587-0.305-9.856c-0.531-1.062-10.012-23.944-11.02-26.348
                         c-2.424-5.801-5.627-8.502-10.078-8.502c-0.413,0,0,0-1.732,0.073c-2.109,0.089-13.594,1.601-18.672,4.802
                         c-5.385,3.395-14.495,14.217-14.495,33.249c0,17.129,10.87,33.302,15.537,39.453c0.116,0.155,0.329,0.47,0.638,0.922
                         c17.873,26.102,40.154,45.446,62.741,54.469c21.745,8.686,32.042,9.69,37.896,9.69c0.001,0,0.001,0,0.001,0
                         c2.46,0,4.429-0.193,6.166-0.364l1.102-0.105c7.512-0.666,24.02-9.22,27.775-19.655c2.958-8.219,3.738-17.199,1.77-20.458
                         C233.168,179.508,230.845,178.393,227.904,176.981z"></path><path id="XMLID_470_" d="M156.734,0C73.318,0,5.454,67.354,5.454,150.143c0,26.777,7.166,52.988,20.741,75.928L0.212,302.716
                         c-0.484,1.429-0.124,3.009,0.933,4.085C1.908,307.58,2.943,308,4,308c0.405,0,0.813-0.061,1.211-0.188l79.92-25.396
                         c21.87,11.685,46.588,17.853,71.604,17.853C240.143,300.27,308,232.923,308,150.143C308,67.354,240.143,0,156.734,0z
                         M156.734,268.994c-23.539,0-46.338-6.797-65.936-19.657c-0.659-0.433-1.424-0.655-2.194-0.655c-0.407,0-0.815,0.062-1.212,0.188
                         l-40.035,12.726l12.924-38.129c0.418-1.234,0.209-2.595-0.561-3.647c-14.924-20.392-22.813-44.485-22.813-69.677
                         c0-65.543,53.754-118.867,119.826-118.867c66.064,0,119.812,53.324,119.812,118.867
                         C276.546,215.678,222.799,268.994,156.734,268.994z"></path></g></svg>
                     </a>

                     <a target="_blank" href={data._settings?.youtube_link}>
                         <svg fill="#fff" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 64 64" height="35px"><path d="M 32 15 C 14.938 15 12.659656 15.177734 10.472656 17.427734 C 8.2856563 19.677734 8 23.252 8 32 C 8 40.748 8.2856562 44.323266 10.472656 46.572266 C 12.659656 48.821266 14.938 49 32 49 C 49.062 49 51.340344 48.821266 53.527344 46.572266 C 55.714344 44.322266 56 40.748 56 32 C 56 23.252 55.714344 19.677734 53.527344 17.427734 C 51.340344 15.177734 49.062 15 32 15 z M 32 19 C 45.969 19 49.379156 19.062422 50.535156 20.232422 C 51.691156 21.402422 52 24.538 52 32 C 52 39.462 51.691156 42.597578 50.535156 43.767578 C 49.379156 44.937578 45.969 45 32 45 C 18.031 45 14.620844 44.937578 13.464844 43.767578 C 12.308844 42.597578 12.03125 39.462 12.03125 32 C 12.03125 24.538 12.308844 21.402422 13.464844 20.232422 C 14.620844 19.062422 18.031 19 32 19 z M 27.949219 25.017578 L 27.949219 38.982422 L 40.095703 31.945312 L 27.949219 25.017578 z"/></svg>
                     </a>
             
              </div>
              <p className="italic text-sm mt-4 text-gray-400">
                {t('common.news-letter-text')}
              </p>
              <div className="flex mt-4">

                <input
                  value={form.email}
                  onChange={e=>setForm({...form,email:e.target.value})}
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 bg-gray-800 text-white placeholder-gray-400"
                />
                <button onClick={SubmitForm} className="bg-pink-600 p-4">
                  {!loading ? <FaPaperPlane /> : <div className="animate-spin"><Loader/></div>}
                </button>

              </div>

              <button onClick={()=>{
                     setTimeout(()=>data._showPopUp('feedback'))
              }} className="bg-pink-600 _feedback items-center mt-10 hover:bg-pink-700 flex text-white text-sm rounded-full px-4 py-3">
                <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M80-400q-33 0-56.5-23.5T0-480v-240q0-12 5-23t13-19l198-198 30 30q6 6 10 15.5t4 18.5v8l-28 128h208q17 0 28.5 11.5T480-720v50q0 6-1 11.5t-3 10.5l-90 212q-7 17-22.5 26.5T330-400H80Zm238-80 82-194v-6H134l24-108-78 76v232h238ZM744 0l-30-30q-6-6-10-15.5T700-64v-8l28-128H520q-17 0-28.5-11.5T480-240v-50q0-6 1-11.5t3-10.5l90-212q8-17 23-26.5t33-9.5h250q33 0 56.5 23.5T960-480v240q0 12-4.5 22.5T942-198L744 0ZM642-480l-82 194v6h266l-24 108 78-76v-232H642Zm-562 0v-232 232Zm800 0v232-232Z"/></svg>
                {t('common.send-feedback')}
              </button>
                                                

        </div>
      </div>
    </div>
    <div className="w-full  relative py-4 px-6 md:px-16 items-center bg-[#1d2024] flex justify-between">
         <div className="text-white">
             &copy; {new Date().getFullYear()} <span className="max-md:hidden">{t('common.all-right-reserved')}</span>
         </div>
         <div className="flex mr-10 flex-col text-[0.9rem] text-gray-500">
          <span>{t('common.developed-by')} <a href="https://derflash.com" target="_blank" className="text-white">DERFLASH</a></span>  
        </div>
      
      </div>
    </>
  );
};

export default Footer;
