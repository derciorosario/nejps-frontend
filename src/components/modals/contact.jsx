import React from 'react'
import { useData } from '../../contexts/DataContext'
import rightImage from '../../assets/images/contact-1.jpg'
import { t } from 'i18next'

export default function Contact() {
  const data=useData()
  return (
    
    <div id="contact" className={`w-full ${!data.showContact ? 'opacity-0 pointer-events-none':''} fixed h-[100vh] bg-gray-700 z-50 flex justify-center items-center`}>
              
              <div className={`flex ease-in duration-75 transition-all ${!data.showContact ? ' translate-y-[100px]':''} max-sm:w-[80%] w-[500px] bg-white rounded-[0.4rem] overflow-hidden relative`}>
                

                      <div className="p-5">
                             <h2 className="font-bold text-[25px]">{t('common.get-in-touch')}</h2>
                             <p className="w-[300px] text-gray-600 mb-5">
                                {t('common.have-question')}
                             </p>
                             <div className="flex mb-3">
                                 <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M17.707 12.293a.999.999 0 0 0-1.414 0l-1.594 1.594c-.739-.22-2.118-.72-2.992-1.594s-1.374-2.253-1.594-2.992l1.594-1.594a.999.999 0 0 0 0-1.414l-4-4a.999.999 0 0 0-1.414 0L3.581 5.005c-.38.38-.594.902-.586 1.435.023 1.424.4 6.37 4.298 10.268s8.844 4.274 10.269 4.298h.028c.528 0 1.027-.208 1.405-.586l2.712-2.712a.999.999 0 0 0 0-1.414l-4-4.001zm-.127 6.712c-1.248-.021-5.518-.356-8.873-3.712-3.366-3.366-3.692-7.651-3.712-8.874L7 4.414 9.586 7 8.293 8.293a1 1 0 0 0-.272.912c.024.115.611 2.842 2.271 4.502s4.387 2.247 4.502 2.271a.991.991 0 0 0 .912-.271L17 14.414 19.586 17l-2.006 2.005z"/></svg>  
                                 <a href="tel:258856462304">+258 856462304</a>
                             </div>

                             <div className="flex">
                                 <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.044l7.386 5.745a.994.994 0 0 0 1.228 0L20 9.044 20.002 18H4z"/></svg>
                                 <a href="mailto:team@derflash.com">team@derflash.com</a>
                             </div>

                      </div>

                      <div  className="flex-1 max-sm:hidden">
                            <img src={rightImage}/>
                      </div>


                      <div onClick={()=>{
                            data.setShowContact(false)
                       }} className="w-[30px] absolute cursor-pointer h-[30px] z-50 right-2 top-2 shadow rounded-full bg-white flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" className="fill-gray-700"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                      </div>

              </div>
    </div>
  )
}
