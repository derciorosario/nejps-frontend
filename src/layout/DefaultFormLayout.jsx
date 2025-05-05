
import { t } from 'i18next';
import React, { useEffect,useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

const FormLayout = () => {     
  return (
    <></>
  )
}

FormLayout.Input = ({onChange,value,label,placeholder,type,textarea,select_options,r}) => {      
    return (
                 
       <div class="mb-5">
                       <label class="mb-3 flex items-center w-full text-base font-medium text-[#07074D]">
                           {label} {r && <span className="text-red-500 !text-[14px] ml-2">*</span>} {/**({t('common.required')}) */}
                       </label>
                       {textarea ? (
                          <textarea rows={6} onChange={onChange} type={type} value={value}  placeholder={placeholder} class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-honolulu_blue-400 focus:shadow-md" ></textarea>
                       ) : select_options ? (
                          <select onChange={onChange} class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-honolulu_blue-400 focus:shadow-md">
                                <option value={''} selected disabled>{t('common.select-an-option')}</option>
                                {select_options.map((i,_i)=>(
                                    <option value={i.value}>{i.name}</option>
                                ))}
                          </select>
                       ) : (
                          <input onChange={onChange} type={type} value={value}  placeholder={placeholder} class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-honolulu_blue-400 focus:shadow-md" />
                       )}
      </div>
    )
}

FormLayout.Options = ({onChange,value,label,options,radioname,input_value,type,input_type}) => { 
    const data=useData()
    return (
        
         
            <div class="mb-8">
                            <label class="mb-3 block text-base font-medium text-[#07074D]">
                                {label}
                            </label>
                            <div class="flex items-center gap-x-6 flex-wrap gap-y-2 text-gray-600">
                                {options.map((i,_i)=>(
                                    <div class="flex items-center">
                                        {input_type=="checkbox" ? (
                                             <input onChange={()=>onChange(i.value)} checked={data.form?.[radioname]?.includes(i.value)} type="checkbox" name={radioname} id={radioname+_i} className={`h-5 w-5 flex-shrink-0 ${i.hide_option ? 'hidden':''}`}/>
                                        ) : (
                                            <input onChange={()=>onChange(i.value)} checked={value==i.value || (i.select_options || []).some(f=>f.value==value)} type="radio" name={radioname} id={radioname+_i} className={`h-5 w-5 flex-shrink-0 ${i.hide_option ? 'hidden':''}`}/>
                                        )}
                                        <label for={radioname+_i} class={`pl-3 text-base font-medium ${i.hide_option ? 'hidden':''}`}>
                                            {i.name}
                                        </label>
                                        {i.select_options && (value==i.value || (i.select_options || []).some(f=>f.value==value)) && (
                                            <select onChange={(e)=>onChange(e.target.value)} class="ml-3 rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-honolulu_blue-400 focus:shadow-md">
                                                <option value={value==i.value ? value : ''} selected disabled>{t('common.select-an-option')}</option>
                                                {i.select_options.map((j,_j)=>(
                                                    <option value={j.value}>{j.name}</option>
                                                ))}
                                            </select>
                                        )}
                                        {((data.form?.[radioname]?.includes('other') || value=="other") && i.value=="other" ) && (
                                            <input onChange={(e)=>onChange(e.target.value,'isInputValue')}  type={type} value={input_value}  class={` w-full ${!i.hide_option ? 'ml-4':''} rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-honolulu_blue-400 focus:shadow-md`} />
                                        )}
                                    </div>
                                ))}
                            </div>
            </div>
       
    )
}


FormLayout.InputBox = ({children}) => {      
    return (     
        <div className="flex max-md:flex-col m-3">
           {children}
        </div>
    )
}





FormLayout.SendButton = ({done,v,onClick}) => {
       
    const { t, i18n } = useTranslation();
    const {pathname} = useLocation()

    const [buttonText,setButtonText]= useState('')
    const [confimBTN,setConfirmBTN]= useState(false)
    useEffect(()=>{
        let confim=false
        if(pathname.replaceAll('/','')=="ticketsbuystep-1"){
            setButtonText(t('common.keep-on-paying'))
        }else if(pathname.replaceAll('/','')=="ticketsbuystep-2" || pathname.replaceAll('/','')=="expositorstep-3" || pathname.replaceAll('/','')=="speakerstep-2"){
            setButtonText(t('common.confirm'))
            confim=true
        }
        if(pathname.replaceAll('/','')=="expositorstep-1" || pathname.replaceAll('/','')=="expositorstep-2" || pathname.replaceAll('/','')=="speakerstep-1"){
            setButtonText(t('common.continue'))
        }

        setConfirmBTN(confim)
    },[pathname,i18n.language])

   


    


    return (
            <button onClick={onClick} className={` ${v ? 'hover:opacity-70':' bg-gray-300 cursor-not-allowed'} ${v && confimBTN ? ' bg-green-500' : v ? 'bg-app_primary-400':''}  text-white  mt-[20px] px-3 py-2 rounded-[0.3rem]`}>{buttonText}</button>
    )
}

export default FormLayout

