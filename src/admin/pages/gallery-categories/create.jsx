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
  const {pathname,search } = useLocation()
  const navigate = useNavigate()
  const {user=null}=useAuth()
  const [loading,setLoading]=useState(id ? true : false);
  const [itemToEditLoaded,setItemToEditLoaded]=useState(false)
  const [verified_inputs,setVerifiedInputs]=useState([])
  const [valid,setValid]=useState(false)

  let initial_form={
    name_pt: "",
    name_en: "",
  }

 
  const [form,setForm]=useState(initial_form)


  useEffect(()=>{
    let v=true
    if(
       !form.name_pt ||
       !form.name_en 
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

     let r=await data.makeRequest({method:'post',url:`api/gallery-category/`+id,withToken:true,data:form_data, error: ``},0);
     setForm({...form,r})
     toast.success('Actualizado com sucesso')
     setLoading(false)

   }else{

     let response=await data.makeRequest({method:'post',url:`api/gallery-category/`,withToken:true,data:form_data, error: ``},0);
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
          msg="Nome já existe"
      }   
      if(e.response.status==400){
          msg="Dados inválidos"
      }
      if(e.response.status==404){
        msg="Item não encontrado"
      }
      if(e.response.status==500){
          msg="Erro, inesperado. Contacte seu administrador"
      }

    }else if(e.code=='ERR_NETWORK'){
          msg="Verfique sua internet e tente novamente"
    }
    toast.remove()
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

        let response=await data.makeRequest({method:'get',url:`api/gallery-category/`+id,withToken:true, error: ``},0);
        setItemToEditLoaded(response)
        setForm({...response})
        setLoading(false)

      }catch(e){

        console.log({e})

        let msg="Acorreu um erro, tente novamente"

        setLoading(false)

        if(e.response){

          if(e.response.status==409){
            msg="Nome já existe"
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
          <FormLayout  hide={!itemToEditLoaded && id} title={id ? 'Editar categoria' : 'Adicionar categoria'} verified_inputs={verified_inputs} form={form}
          

          bottomContent={(
              <div>
                
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
              onBlur={() => setVerifiedInputs([...verified_inputs, 'name_pt'])} 
              label={'Nome (pt)'} 
              onChange={(e) => setForm({...form, name_pt: e.target.value})} 
              field={'name_pt'} 
              value={form.name_pt}
          />


          <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              r={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'name_en'])} 
              label={'Nome (en)'} 
              onChange={(e) => setForm({...form, name_en: e.target.value})} 
              field={'name_en'} 
              value={form.name_en}
          />

  </FormLayout>


          </div>
      </DefaultAdminLayout>
     </>
  )
}
