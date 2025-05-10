import React, { useEffect, useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import { t } from "i18next";
import { FaEnvelope, FaMapMarkedAlt, FaPhone } from "react-icons/fa";
import PagesHero from "../../components/Section/pagesHero";
import { useData } from "../../contexts/DataContext";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

export default function ContactForm() {

    const data=useData()
    const {pathname,search} = useLocation()
    const navigate = useNavigate()
    const [verified_inputs,setVerifiedInputs]=useState([])
    const [valid,setValid]=useState(false)
    const [loading,setLoading]=useState(false);

    let initial_form={
      name:'',
      email:'',
      message:'',
      phone:''
    }

    let [form,setForm]=useState(initial_form)

    async function SubmitForm(){

      if(loading){
        return
      }

      if(!valid){
        toast.error(t('common.fill-all-required-fills'))
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
        await data.makeRequest({method:'post',url:`api/contact/`,withToken:true,data:form_data, error: ``},0);
        toast.success(t('common.message-sent-successfull'))
        setForm(initial_form)
        setLoading(false)

    }catch(e){

        let msg="Acorreu um erro, tente novamente"
        console.log(e)
        setLoading(false)
    
        if(e.response){
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


  useEffect(()=>{

      let v=true
      if(
         !form.message ||
         !form.email 
      ){
         v=false
      }
      setValid(v)

   },[form])


    useEffect(()=>{
       data._scrollToSection('home')
     },[])


  return (

    <DefaultLayout>
                       <PagesHero name={t('menu.contact')}/>
                       
                       <div className="relative bg-white">

                           <section className="pb-20">
                                   <div className="max-w-[1300px] mx-auto pt-10">

                                    <div className="min-h-screen bg-white p-6 flex flex-col md:flex-row justify-center items-start gap-10">
                                      <div className="flex-1">
                                        <h2 className="text-3xl font-bold mb-6">
                                          {t('common.contact-text')}
                                        </h2>
                                        <div className="space-y-4">
                                          <div>
                                            <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
                                              {t('common.name')}
                                            </label>
                                            <input
                                              value={form.name}
                                              onChange={e=>setForm({...form,name:e.target.value})}
                                              id="name"
                                              type="text"
                                              className="w-full border border-gray-300 p-3 rounded-md"
                                            />
                                          </div>

                                          <div>
                                            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
                                              Email<span className="text-red-500">*</span>
                                            </label>
                                            <input
                                              onChange={e=>setForm({...form,email:e.target.value})}
                                              value={form.email}
                                              id="email"
                                              type="email"
                                              className="w-full border border-gray-300 p-3 rounded-md"
                                              required
                                            />
                                          </div>

                                          <div>
                                            <label htmlFor="phone" className="block mb-1 font-medium text-gray-700">
                                              {t('common.phone')}
                                            </label>
                                            <input
                                              onChange={e=>setForm({...form,phone:e.target.value})}
                                              value={form.phone}
                                              id="phone"
                                              type="tel"
                                              className="w-full border border-gray-300 p-3 rounded-md"
                                            />
                                          </div>

                                          <div>
                                            <label htmlFor="message" className="block mb-1 font-medium text-gray-700">
                                              {t('common.leave-a-message')} <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                              onChange={e=>setForm({...form,message:e.target.value})}
                                              value={form.message}
                                              id="message"
                                              className="w-full border border-gray-300 p-3 rounded-md h-40"
                                              required
                                            ></textarea>
                                          </div>

                                          <button
                                            onClick={SubmitForm}
                                            type="submit"
                                            className="bg-rose-600 text-white font-semibold px-6 py-3 rounded-md flex items-center gap-2 hover:bg-rose-700"
                                          >
                                            {loading && <div className="animate-spin"><Loader/></div>}
                                            {loading ? t('common.loading')+"..." : t('common.send')}
                                            
                                           {!loading && <svg
                                              className="w-4 h-4"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              viewBox="0 0 24 24"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 12h14M12 5l7 7-7 7"
                                              ></path>
                                            </svg>}
                                          </button>
                                        </div>
                                      </div>

                                      <div className="flex flex-col gap-6 w-full md:w-1/3">
                                        {data._settings?.address && <div className="bg-white shadow-md p-6 rounded-lg text-center border border-gray-200">
                                          <div className="text-rose-600 text-4xl mb-2 flex justify-center">
                                            <FaMapMarkedAlt className="text-pink-600" />
                                          </div>
                                          <h3 className="font-semibold">{t('common.location')}</h3>
                                          <p className="text-rose-600">{data._settings?.address}</p>
                                        </div>}
                                        {data._settings?.email && <div className="bg-white shadow-md p-6 rounded-lg text-center border border-gray-200">
                                          <div className="text-rose-600 text-4xl mb-2 flex justify-center">
                                          <FaEnvelope className="text-pink-600" />
                                          </div>
                                          <h3 className="font-semibold">{t('common.send-email')}</h3>
                                          <p className="text-rose-600">{data._settings?.email}</p>
                                        </div>}
                                        {data._settings?.contact && <div className="bg-white shadow-md p-6 rounded-lg text-center border border-gray-200">
                                          <div className="text-rose-600 text-4xl mb-2 flex justify-center">
                                            <FaPhone className="text-pink-600" />
                                          </div>
                                          <h3 className="font-semibold">{t('common.call-us')}</h3>
                                          <p className="text-rose-600">{data._settings?.contact}</p>
                                        </div>}
                                      </div>
                                    </div>

                                    </div>
                           </section>
                       </div>
              </DefaultLayout>

   
  );
}
