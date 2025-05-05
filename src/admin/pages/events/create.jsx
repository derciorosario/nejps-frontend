import React, { useEffect, useState } from 'react'
import DefaultAdminLayout from '../../layout/DefaultAdminLayout'
import { useData } from '../../../contexts/DataContext'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import FormLayout from '../../layout/DefaultFormLayout'
import FileInput from '../../components/Inputs/file'
import { useAuth } from '../../../contexts/AuthContext'
import toast from 'react-hot-toast'
import DefaultFormSkeleton from '../../components/Skeleton/defaultForm'


export default function CreateAdminEvents() {
  const data=useData()
  const { id } = useParams()
  const {pathname,search } = useLocation()
  const navigate = useNavigate()
  const {user=null}=useAuth()
  const [loading,setLoading]=useState(id ? true : false);
  const [itemToEditLoaded,setItemToEditLoaded]=useState(false)
  const [verified_inputs,setVerifiedInputs]=useState([])
  const [valid,setValid]=useState(false)

  let initial_form={
    title_pt: "",
    title_en: "",
    start_time:"",
    end_time:"",
    image_filename: "",
    location: "",
    date: "",
    description_pt:"",
    description_en:"",
    goal: "",
    report_link:"",
    start_time:"",
    end_time:""
  }

 
  const [form,setForm]=useState(initial_form)


  function handleUploadedFiles(upload){
    setForm({...form,[upload.key]:upload.filename})
  }

  useEffect(()=>{
    let v=true
    if(
       !form.title_pt ||
       !form.title_en ||
       !form.image_filename ||
       !form.location ||
       !form.date ||
       !form.description_pt ||
       !form.description_en 
    ){
       v=false
    }

    setValid(v)

 },[form])


 async function SubmitForm(){

  setLoading(true)

  try{

   let form_data={
     ...form
   }

   if(id){

     let r=await data.makeRequest({method:'post',url:`api/event/`+id,withToken:true,data:form_data, error: ``},0);
     setForm({...form,r})
     toast.success('Actualizado com sucesso')
     setLoading(false)

   }else{

     let response=await data.makeRequest({method:'post',url:`api/event/`,withToken:true,data:form_data, error: ``},0);
     console.log({response})
     toast.success('Adicionado com sucesso!')
     setForm(initial_form)
     setLoading(false)
     setVerifiedInputs([])

   }
  

 }catch(e){
 
    let msg="Acorreu um erro, tente novamente"
    console.log(e)
    setLoading(false)

    if(e.response){
      if(e.response.status==409){
          msg="Titulo já existe"
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


useEffect(()=>{

    if(!user || !id){
        return
    }

    (async()=>{
      try{

        let response=await data.makeRequest({method:'get',url:`api/event/`+id,withToken:true, error: ``},0);
        setItemToEditLoaded(response)
        setForm({...response})
        setLoading(false)

      }catch(e){

        console.log({e})

        let msg="Acorreu um erro, tente novamente"

        setLoading(false)

        if(e.response){

          if(e.response.status==409){
            msg="Email já existe"
          } 
          
          if(e.response.status==404){
              msg="Item não encontrado"
              setTimeout(()=>navigate('/dashboard'),200)
          }
          if(e.response.status==500){
              msg="Erro, inesperado. Contacte seu administrador"
          }

        }else if(e.code=='ERR_NETWORK'){
              msg="Verfique sua internet e tente novamente"
        }
        toast.remove()
        toast.error(msg)
    }
    
  })()

},[user,pathname])


 

  return (
     <>
    
       <DefaultAdminLayout>
          <div class="pt-6 px-4">
          {!itemToEditLoaded && id && <div className="mt-10">
                <DefaultFormSkeleton/>
         </div>}
          <FormLayout  hide={!itemToEditLoaded && id} title={id ? 'Editar evento' : 'Adicionar evento'} verified_inputs={verified_inputs} form={form}
          
          bottomContent={(
              <div>
                  <div className="flex flex-col gap-x-4 flex-wrap mt-4">
                    {(form.id || !id) && <FileInput onlyImages={true} _upload={{key:'image_filename',filename:form.image_filename}} res={handleUploadedFiles} label={'Imagem'} r={true}/>}
                      <div className="max-w-[500px] flex items-center justify-center bg-gray-300 h-[150px] rounded-[0.3rem]">
                         {!form.image_filename &&  <svg class="w-8 h-8 stroke-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20.5499 15.15L19.8781 14.7863C17.4132 13.4517 16.1808 12.7844 14.9244 13.0211C13.6681 13.2578 12.763 14.3279 10.9528 16.4679L7.49988 20.55M3.89988 17.85L5.53708 16.2384C6.57495 15.2167 7.09388 14.7059 7.73433 14.5134C7.98012 14.4396 8.2352 14.4011 8.49185 14.3993C9.16057 14.3944 9.80701 14.7296 11.0999 15.4M11.9999 21C12.3154 21 12.6509 21 12.9999 21C16.7711 21 18.6567 21 19.8283 19.8284C20.9999 18.6569 20.9999 16.7728 20.9999 13.0046C20.9999 12.6828 20.9999 12.3482 20.9999 12C20.9999 11.6845 20.9999 11.3491 20.9999 11.0002C20.9999 7.22883 20.9999 5.34316 19.8283 4.17158C18.6568 3 16.7711 3 12.9998 3H10.9999C7.22865 3 5.34303 3 4.17145 4.17157C2.99988 5.34315 2.99988 7.22877 2.99988 11C2.99988 11.349 2.99988 11.6845 2.99988 12C2.99988 12.3155 2.99988 12.651 2.99988 13C2.99988 16.7712 2.99988 18.6569 4.17145 19.8284C5.34303 21 7.22921 21 11.0016 21C11.3654 21 11.7021 21 11.9999 21ZM7.01353 8.85C7.01353 9.84411 7.81942 10.65 8.81354 10.65C9.80765 10.65 10.6135 9.84411 10.6135 8.85C10.6135 7.85589 9.80765 7.05 8.81354 7.05C7.81942 7.05 7.01353 7.85589 7.01353 8.85Z" stroke="stroke-current" stroke-width="1.6" stroke-linecap="round"></path>
                          </svg>}
                          {form.image_filename && <img className="object-cover border w-auto h-full" src={data.APP_BASE_URL+"/file/"+form.image_filename?.replaceAll(' ','%20')}/>}
                      </div>
                   </div>
                 
              </div>
          )}
          button={(
                <div className={`mt-[40px]`}>
                    <FormLayout.Button onClick={()=>{
                        SubmitForm()
                    }} valid={valid} loading={loading} label={id ? "Actualizar" : 'Enviar'}/>
                </div>
           )}
          >


          <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              r={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'title_pt'])} 
              label={'Titulo (pt)'} 
              onChange={(e) => setForm({...form, title_pt: e.target.value})} 
              field={'title_pt'} 
              value={form.title_pt}
          />


          <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              r={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'title_en'])} 
              label={'Titulo (en)'} 
              onChange={(e) => setForm({...form, title_en: e.target.value})} 
              field={'title_en'} 
              value={form.title_en}
          />

          
           <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'location'])} 
              label={'Destino'} 
              onChange={(e) => setForm({...form, location: e.target.value})} 
              field={'location'} 
              value={form.location}
              r={true}
          />

          <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'date'])} 
              label={'Data'} 
              onChange={(e) => setForm({...form, date: e.target.value})} 
              field={'date'} 
              type={'date'}
              value={form.date}
              r={true}
          />

          <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'start_time'])} 
              label={'Hora de inicio'} 
              onChange={(e) => setForm({...form, start_time: e.target.value})} 
              field={'start_time'} 
              type={'time'}
              value={form.start_time}
          />

           <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'end_time'])} 
              label={'Hora de fim'} 
              onChange={(e) => setForm({...form, end_time: e.target.value})} 
              field={'end_time'} 
              type={'time'}
              value={form.end_time}
          />

          <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'description_pt'])} 
              label={'Descrição (pt)'} 
              textarea={true}
              onChange={(e) => setForm({...form, description_pt: e.target.value})} 
              field={'description_pt'} 
              value={form.description_pt}
              r={true}
          />

         <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              textarea={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'description_en'])} 
              label={'Descrição (en)'} 
              onChange={(e) => setForm({...form, description_en: e.target.value})} 
              field={'description_en'} 
              value={form.description_en}
              r={true}
          />

        
  </FormLayout>


          </div>
      </DefaultAdminLayout>
     </>
  )
}
