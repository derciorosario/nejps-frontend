import React, { useEffect, useState } from 'react'
import DefaultAdminLayout from '../../layout/DefaultAdminLayout'
import { useData } from '../../../contexts/DataContext'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import FormLayout from '../../layout/DefaultFormLayout'
import { useAuth } from '../../../contexts/AuthContext'
import toast from 'react-hot-toast'
import DefaultFormSkeleton from '../../components/Skeleton/defaultForm'
import LogoFile from '../../components/Inputs/logo'


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
    name: "",
    logo_filename: "",
    email:"",
    phone:"",
    address: "",
    role_pt:'',
    role_en:'',
    whatsapp_contact:"",
    description_pt:"",
    description_en:"",
    status:"pending"
  }

  const [form,setForm]=useState(initial_form)

  function handleUploadedFiles(upload){
    setForm({...form,[upload.key]:upload.filename})
  }

  useEffect(()=>{
    let v=true
    if(
       !form.name || 
       !form.address ||
       !form.phone ||
       !form.role_en ||
       !form.role_pt 
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

     let r=await data.makeRequest({method:'post',url:`api/volunteer/`+id,withToken:true,data:form_data, error: ``},0);
     setForm({...form,r})
     toast.success('Actualizado com sucesso')
     setLoading(false)

   }else{

     let response=await data.makeRequest({method:'post',url:`api/volunteer/`,withToken:true,data:form_data, error: ``},0);
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

        let response=await data.makeRequest({method:'get',url:`api/volunteer/`+id,withToken:true, error: ``},0);
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
          <FormLayout  hide={!itemToEditLoaded && id} title={id ? 'Editar peril' : 'Adicionar peril'} verified_inputs={verified_inputs} form={form}
          
          button={(
                <div className={`mt-[40px]`}>
                    <FormLayout.Button onClick={()=>{
                        SubmitForm()
                    }} valid={valid} loading={loading} label={id ? "Actualizar" : 'Enviar'}/>
                </div>
          )}

          >
          <div className="mb-10 w-full">
                 <LogoFile res={handleUploadedFiles} _upload={{key:'logo_filename',filename:form.logo_filename}} label={'Foto'}/>
           </div>

          <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              r={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'name'])} 
              label={'Nome'} 
              onChange={(e) => setForm({...form, name: e.target.value})} 
              field={'name'} 
              value={form.name}
          />

          

          <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'email'])} 
              label={'Email'} 
              onChange={(e) => setForm({...form, email: e.target.value})} 
              field={'email'} 
              value={form.email}
          />

           <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'phone'])} 
              label={'Contacto'} 
              onChange={(e) => setForm({...form, phone: e.target.value})} 
              field={'phone'} 
              r={true}
              value={form.phone}
          />
           <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'whatsapp_contact'])} 
              label={'Número de whatsapp)'} 
              onChange={(e) => setForm({...form, whatsapp_contact: e.target.value})} 
              field={'role_en'} 
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
              r={true}
          />

          <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              r={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'role_pt'])} 
              label={'Função (pt)'} 
              onChange={(e) => setForm({...form, role_pt: e.target.value})} 
              field={'role_pt'} 
              value={form.role_pt}
          />

            <FormLayout.Input 
                verified_inputs={verified_inputs} 
                form={form}
                r={true}
                onBlur={() => setVerifiedInputs([...verified_inputs, 'role_en'])} 
                label={'Função (en)'} 
                onChange={(e) => setForm({...form, role_en: e.target.value})} 
                field={'role_en'} 
                value={form.role_en}
            />

             <FormLayout.Input 
                        verified_inputs={verified_inputs} 
                        form={form}
                        r={true}
                        selectOptions={
                          [
                            { name: 'Pendente', value: 'pending',disabled:true },
                            { name: 'Activo', value: 'active' },
                            { name: 'Inativo', value: 'inactive' },
                          ]
                        }
                        onBlur={() => setVerifiedInputs([...verified_inputs, 'status'])} 
                        label={'Estado'} 
                        onChange={(e) => setForm({...form, status: e.target.value})} 
                        field={'status'} 
                        value={form.status}
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
        />

  </FormLayout>


          </div>
      </DefaultAdminLayout>
     </>
  )
}
