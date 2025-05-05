import { t } from 'i18next'
import React from 'react'
import { useData } from '../../contexts/DataContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function BasicPopUp({title,setMessage,message}) {
  const data=useData()
  const navigate=useNavigate()
  return (
     <div id="info-popup" style={{zIndex:99}} tabindex="-1" class={`overflow-y-auto   bg-[rgba(0,0,0,0.3)] ${!message ? 'opacity-0 translate-y-[60px] pointer-events-none':''} fixed top-0 right-0 items-center flex justify-center left-0  w-full  delay-0 ease-in transition-all md:inset-0 h-[100vh]`}>
      <div class="relative _basic_popup p-4 bg-white rounded-lg shadow w-[500px]  max-md:w-[90%]  md:p-8 table">
                <div class="mb-4  font-light">
                    <h3 class="mb-3 text-2xl font-bold text-gray-900 max-sm:text-[1rem]">{title}</h3>
                    <p className="text-[18px]">
                        {message}
                    </p>
                </div>

                <div className="mt-2 mb-5">
                       <p className="text-gray-900 font-light">{t('common.share-website')}</p>
                       <div className="flex my-3 items-center w-full bg-gray-100 rounded-full py-2 px-2">
                           <span className="text-gray-600">{t('common.share-in')}:</span>
                           <div className="flex items-center gap-x-2 ml-5">
                              <a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https://vip.dronlinemz.com/">
                                    <svg className="fill-black" xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 0 24 24"><path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.615v-6.96h-2.338v-2.725h2.338v-2c0-2.325 1.42-3.592 3.5-3.592.699-.002 1.399.034 2.095.107v2.42h-1.435c-1.128 0-1.348.538-1.348 1.325v1.735h2.697l-.35 2.725h-2.348V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"/></svg>
                              </a>
                              <a target="_blank" href="https://www.linkedin.com/sharing/share-offsite/?url=https://vip.dronlinemz.com">
                                    <svg className="fill-black" xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 0 24 24"><path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8.339 18.337H5.667v-8.59h2.672v8.59zM7.003 8.574a1.548 1.548 0 1 1 0-3.096 1.548 1.548 0 0 1 0 3.096zm11.335 9.763h-2.669V14.16c0-.996-.018-2.277-1.388-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248h-2.667v-8.59h2.56v1.174h.037c.355-.675 1.227-1.387 2.524-1.387 2.704 0 3.203 1.778 3.203 4.092v4.71z"/></svg>
                              </a>
                              <a target="_blank" href="https://twitter.com/intent/tweet?url=https://vip.dronlinemz.com&text=Seja um dos Primeiros a Aceder à Saúde do Futuro!">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="24" viewBox="0 0 24 24"><path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"/></svg>
                              </a>
                              <a target="_blank" href="https://api.whatsapp.com/send?text=Seja um dos Primeiros a Aceder à Saúde do Futuro! https://vip.dronlinemz.com">
                                    <svg className="fill-black" height="21px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 308 308" xml:space="preserve"><g id="XMLID_468_"><path id="XMLID_469_" d="M227.904,176.981c-0.6-0.288-23.054-11.345-27.044-12.781c-1.629-0.585-3.374-1.156-5.23-1.156
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
                           </div>

                       </div>

                       <span className="block text-center">{t('common.or')}</span>

                       <div className="flex items-center justify-center mt-2">
                            <span onClick={()=>{
                                  navigator.clipboard.writeText('https://vip.dronlinemz.com').then(() => {
                                    toast(t('common.link-copied'));
                                  }).catch(err => {
                                    alert('Failed to copy text: ', err);
                                  })
                            }} className=" cursor-pointer flex p-1 py-1 text-gray-500 text-[14px] rounded-full bg-gray-300">{t('common.copy-link')}</span>
                       </div>
                </div>
                <div class="justify-between items-center pt-0 space-y-4 sm:flex sm:space-y-0">
                   <div class="items-center space-y-4 sm:space-x-4 sm:flex sm:space-y-0">
                        <button onClick={()=>{
                          setMessage(null)
                          navigate('/')
                        }} id="confirm-button" type="button" class="py-2 px-4 w-full text-sm font-medium text-center rounded-lg text-white bg-primary-700 sm:w-auto bg-honolulu_blue-500 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300">{t('common.close')}</button>
                    </div>
                </div>
    </div>
    </div>

  )
}

export default BasicPopUp