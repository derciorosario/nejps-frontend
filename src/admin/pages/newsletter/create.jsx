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

  let initial_form={ email:'' }

 
  const [form,setForm]=useState(initial_form)

  useEffect(()=>{
    let v=true
    if(
       !form.email
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

     let r=await data.makeRequest({method:'post',url:`api/newsletter/`+id,withToken:true,data:form_data, error: ``},0);
     setForm({...form,r})
     toast.success('Actualizado com sucesso')
     setLoading(false)

   }else{

     let response=await data.makeRequest({method:'post',url:`api/newsletter/`,withToken:true,data:form_data, error: ``},0);
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
          msg="Email já existe"
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

        let response=await data.makeRequest({method:'get',url:`api/newsletter/`+id,withToken:true, error: ``},0);
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
              setTimeout(()=>navigate('/'),200)
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
          <FormLayout  hide={!itemToEditLoaded && id} title={id ? 'Editar email' : 'Adicionar email'} verified_inputs={verified_inputs} form={form}
          
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
              onBlur={() => setVerifiedInputs([...verified_inputs, 'email'])} 
              label={'Email'} 
              onChange={(e) => setForm({...form, email: e.target.value})} 
              field={'email'} 
              value={form.email}
          />


        
        
  </FormLayout>


          </div>
      </DefaultAdminLayout>
     </>
  )
}
