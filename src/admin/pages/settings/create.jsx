import React, { useEffect, useState } from 'react'
import DefaultAdminLayout from '../../layout/DefaultAdminLayout'
import { useData } from '../../../contexts/DataContext'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import FormLayout from '../../layout/DefaultFormLayout'
import { useAuth } from '../../../contexts/AuthContext'
import toast from 'react-hot-toast'
import DefaultFormSkeleton from '../../components/Skeleton/defaultForm'

export default function CreateAdminEvents() {
  const data=useData()
  const { id } = useParams()
  const {pathname} = useLocation()
  const navigate = useNavigate()
  const {user=null}=useAuth()
  const [loading,setLoading]=useState(id ? true : false);
  const [itemToEditLoaded,setItemToEditLoaded]=useState(false)
  const [verified_inputs,setVerifiedInputs]=useState([])
  const [valid,setValid]=useState(false)

  let initial_form={
    contact: "",
    address: "",
    website:"",
    email:"",
    whatsapp_contact:""
  }

  const [form,setForm]=useState(initial_form)

  useEffect(()=>{
    let v=true
    if(
       !form.contact || 
       !form.email 
    ){
       v=false
    }
    setValid(v)
 },[form])


 async function SubmitForm(){

  setLoading(true)

  try{

  
     let r=await data.makeRequest({method:'post',url:`api/settings`,withToken:true,data:form, error: ``},0);
     toast.success('Actualizado com sucesso')
     setLoading(false)

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

    if(!user){
        return
    }

    (async()=>{
      try{

        let response=await data.makeRequest({method:'get',url:`api/settings`,withToken:true, error: ``},0);
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
          {!itemToEditLoaded && <div className="mt-10">
                <DefaultFormSkeleton/>
         </div>}
          <FormLayout  hide={!itemToEditLoaded} title={'Atualizar configurações'} verified_inputs={verified_inputs} form={form}
          
          button={(
                <div className={`mt-[40px]`}>
                    <FormLayout.Button onClick={()=>{
                        SubmitForm()
                    }} valid={valid} loading={loading} label={"Actualizar"}/>
                </div>
          )}
          
          >
        
          <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'email'])} 
              label={'Email'} 
              r={true}
              onChange={(e) => setForm({...form, email: e.target.value})} 
              field={'email'} 
              value={form.email}
          />

           <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'contact'])} 
              label={'Contacto'} 
              onChange={(e) => setForm({...form, contact: e.target.value})} 
              field={'contact'} 
              r={true}
              value={form.contact}
          />

           <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'whatsapp_contact'])} 
              label={'Número de whatsapp)'} 
              onChange={(e) => setForm({...form, whatsapp_contact: e.target.value})} 
              field={'whatsapp_contact'} 
              value={form.whatsapp_contact}
          />

          <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'address'])} 
              label={'Endereço'} 
              onChange={(e) => setForm({...form, address: e.target.value})} 
              field={'address'} 
              value={form.address}
          />

         <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'website'])} 
              label={'website'} 
              onChange={(e) => setForm({...form, website: e.target.value})} 
              field={'website'} 
              value={form.website}
          />


          <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'facebook_link'])} 
              label={'Facebook link'} 
              onChange={(e) => setForm({...form, facebook_link: e.target.value})} 
              field={'facebook_link'} 
              value={form.facebook_link}
          />

          <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'whatsapp_link'])} 
              label={'Whatsapp link'} 
              onChange={(e) => setForm({...form, whatsapp_link: e.target.value})} 
              field={'whatsapp_link'} 
              value={form.whatsapp_link}
          /> 

            <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'youtube_link'])} 
              label={'Youtube link'} 
              onChange={(e) => setForm({...form, youtube_link: e.target.value})} 
              field={'youtube_link'} 
              value={form.youtube_link}
          /> 

  </FormLayout>
          </div>
      </DefaultAdminLayout>
     </>
  )
}
