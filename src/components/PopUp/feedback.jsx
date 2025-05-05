import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { t } from 'i18next'
import toast from 'react-hot-toast';
import ButtonLoader from '../../admin/components/Loaders/button';

function Feedback({}) {

  const data=useData()
  const [chosenIndex,setChosenIndex]=useState(null)
  const [rateSelected,setRateSelected]=useState(false)
  const [message,setMessage]=useState('')
  const [loading,setLoading]=useState(false)
  const [name,setName]=useState('')
  const [phone,setPhone]=useState('')

  async function SubmitForm(){

    setLoading(true)

    try{

        await data.makeRequest({method:'post',url:`api/feedback`,withToken:true,data:{
          rating:chosenIndex || 0,comments:message || '',
          name,
          phone
        }, error: ``},0)

        setLoading(false)
        toast.success(t('common.thanks-for-your-feedback'))
        data._closeAllPopUps()
        document.getElementById('feedback').style.display="none"

    }catch(e){

    
        console.log({e})
      if(e.response?.status==500){
        toast.error(t('common.unexpected-error'))
      }else  if(e.message=='Failed to fetch'){
        toast.error(t('common.check-network'))
      }

      setLoading(false)

    }
  }

  return (
    <div style={{zIndex:999}} className={`w-full flex pb-[100px] px-3 items-end justify-center ${!data._openPopUps.feedback ? 'opacity-0 pointer-events-none translate-y-[100px]':''} fixed left-0 top-0 h-[100vh] bg-[rgba(0,0,0,0.3)] z-50 transition ease-in delay-100`}>
    
          <div className="max-w-[600px] bg-white p-4 rounded-[0.3rem] _feedback">

           <div class="flex justify-between mb-6">
                <h2 class="text-[20px] max-sm:text-[17px] flex-1 mr-3 lg:text-2xl font-bold text-gray-900">{t('common.share-your-option')}</h2>
                <div onClick={()=>data._closeAllPopUps()} className="bg-rose-600 cursor-pointer hover:opacity-90 w-[40px] h-[40px] right-3 top-3 z-30 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </div>
           </div>
         <div class="mb-2">
            <div>
                <label for="first_name" class="block mb-1 text-sm font-medium text-gray-900">{t('common.name')}<span className="text-gray-500 ml-1 text-[13px]">{`(opcional)`.toLowerCase()}</span></label>
                <input value={name} type="text" onChange={(e)=>setName(e.target.value)} id="first_name" class="bg-gray-50 mb-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
            </div>
            <div>
                <label for="last_name" class="block mb-1 text-sm font-medium text-gray-900">{t('common.phone')}<span className="text-gray-500 ml-1 text-[13px]">{`(opcional)`.toLowerCase()}</span></label>
                <input value={phone} onChange={(e)=>setPhone(e.target.value)} type="text" id="last_name" class="bg-gray-50 mb-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
            </div>
            <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
                <label for="comment" class="sr-only">Your comment</label>
                <textarea onChange={(e)=>setMessage(e.target.value)} id="comment" rows="4"
                    class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                    placeholder={t('common.leave-feedback')} required></textarea>
            </div>

            <div className={`flex items-center ${loading ? 'hidden':''}`}>

            <button onClick={()=>{
                SubmitForm()
            }} 
                class={`inline-flex  mr-[20px] items-center py-2.5 px-4 text-xs font-medium text-center text-white ${rateSelected || message ? 'bg-rose-600':'bg-gray-300 pointer-events-none'} rounded-lg   hover:bg-primary-800`}>
                {t('common.send')}
            </button>

            <span className="flex mr-2">{t('common.rate')}</span>

            <div  onMouseLeave={()=>{
                         
                         if(!rateSelected)  setChosenIndex(null)

                        }} 
                 className="flex items-center gap-x-2 flex-wrap">

                {[1,2,3,4,5].map((_,_i)=>(

                    <span onMouseEnter={()=>{
                         if(!rateSelected)  setChosenIndex(_i)
                        }} 
                        onClick={()=>{
                          setChosenIndex(_i)
                          setRateSelected(true)
                        }}
                        className="cursor-pointer">
                       {(chosenIndex!=null && chosenIndex >= _i) ? <svg className="h-[24px] max-sm:h-[19px]" xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" fill={`${rateSelected ? '#e11d48':'#5f6368'}`}><path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/></svg>
                        : <svg className="h-[24px] max-sm:h-[19px]" xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"  fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
                       }       
                    </span>

                ))
                
                }
            </div>
            </div>

            {loading && <div className="flex items-center mt-2">
                 <ButtonLoader/>
                 <span>{t('common.loading')}</span>
            </div>}
         </div>


          </div>
    </div>
  )
}

export default Feedback