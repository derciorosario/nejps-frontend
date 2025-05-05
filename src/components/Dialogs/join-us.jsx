import React from 'react'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

export default function JoinAsDonor({}) {
  const { t, i18n } = useTranslation();
  const [loading,setLoading]=useState(false)
  const data=useData()

  let initial_form={
    name:'',
    email:'',
    address:'',
    phone:'',
    whatsapp_contact:''
  }
  const [form,setForm]=useState(initial_form)

  async function SubmitForm(){
    setLoading(true)
    
    try{

        /**if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))){
            toast.error(t('common.invalid-email'))
            setLoading(false)
            return
        } */
        await data.makeRequest({method:'post',url:`api/join-as-volunteer`,data:{
         ...form,
        }, error: ``},0)
       
        setLoading(false)
        setForm(initial_form)
        toast.success(t('common.data-sent'))
        data._closeAllPopUps()


    }catch(e){
      console.log(e.message)
      if(e.response?.status==500){
        toast.error(t('common.unexpected-error'))
      }else  if(e.message=='Failed to fetch' || e.message=="Network Error"){
        toast.error(t('common.check-network'))
      }
      setLoading(false)

    }
  }

  
  const [valid,setValid]=useState(false)


  useEffect(()=>{
    let v=true

    if(
       !form.name ||
       !form.phone 
    ){
      v=false
    }
    setValid(v)

 },[form])

 

  return (
            
        <div style={{zIndex:999}} id="crud-modal" tabindex="-1" aria-hidden="true" class={`overflow-y-auto _join  bg-[rgba(0,0,0,0.7)] flex ease-in delay-100 transition-all ${!data._openPopUps.join ? 'opacity-0 pointer-events-none translate-y-[50px]':''} overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100vh] max-h-full`}>
            
            <div class="relative p-4 w-full max-w-[600px] max-h-full">
                <div class="relative bg-white rounded-lg shadow">

                    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 class="text-lg font-semibold text-gray-900">
                          {t('common.join-form-title')}
                        </h3>
                    </div>
                  
                   <div className="p-4 mt-2">
                     <p className="text-gray-600 text-[0.9rem]">{t('common.join-form-text')}</p>
                   </div>

                    <div class="p-4 md:p-5">
                        <div class="grid gap-4 mb-4 grid-cols-2">
                            <div class="col-span-2">
                                <label for="name" class="block mb-2 text-sm font-medium text-gray-900">{t('common.name')} <span className="text-red-500">*</span></label>
                                <input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required=""/>
                            </div>
                            <div class="col-span-2 sm:col-span-1">
                                <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 ">{t('common.phone')} <span className="text-red-500">*</span></label>
                                <div className="flex items-center">
                                    <input onChange={(e)=>setForm({...form,phone:e.target.value.replace(/[^0-9]/g, '')})} value={form.phone} name="price" id="phone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"  required=""/>
                                </div>
                            </div>
                            <div class="col-span-2 sm:col-span-1">
                                <label for="whatsapp" class="block mb-2 text-sm font-medium text-gray-900 ">{t('common.whatsapp-contact')} <span className="text-gray-500 ml-1">({t('common.optional')})</span></label>
                                <div className="flex items-center">
                                    <input onChange={(e)=>setForm({...form,whatsapp_contact:e.target.value.replace(/[^0-9]/g, '')})} value={form.whatsapp_contact} name="price" id="whatsapp" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"  required=""/>
                                </div>
                            </div>
                            <div class="col-span-2 sm:col-span-1">
                                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">Email <span className="text-gray-500 ml-1">({t('common.optional')})</span></label>
                                <input onChange={(e)=>setForm({...form,email:e.target.value})} value={form.email} name="price" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"  required=""/>
                            </div>
                            
                            <div class="col-span-2 sm:col-span-1">
                                <label for="address" class="block mb-2 text-sm font-medium text-gray-900 ">{t('common.address')} <span className="text-gray-500 ml-1">({t('common.optional')})</span></label>
                                <input onChange={(e)=>setForm({...form,address:e.target.value})} value={form.address} name="price" id="address" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"  required=""/>
                            </div>
                        </div>


                        <div className="mt-5">

                </div>
                        <button onClick={SubmitForm}  class={`text-white mt-5 ${(loading || !valid) ? 'pointer-events-none':''} inline-flex items-center  ${valid ? 'bg-rose-600':'bg-gray-400'} focus:ring-4 focus:outline-none font-medium rounded-[0.3rem] text-sm px-5 py-2.5 text-center`}>
                            {loading && <div className="animate-spin mr-1"><Loader w={20} h={20}/> </div> }  {loading ? t('common.sending')+"..." : t('common.send')}
                        </button>

                    </div>
                </div>


                <div onClick={()=>{
                    data._closeAllPopUps()
                }} className="w-[30px] cursor-pointer h-[30px] absolute right-5 top-5 rounded-full bg-gray-300 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                </div>


                <div className="h-[75px]">{/*** for iphone browser bar */}</div>


            </div>
        </div> 

  )
}
