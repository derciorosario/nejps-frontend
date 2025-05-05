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
    name: "",
    number: "",
    nib:"",
    type:""
  }
 
  const [form,setForm]=useState(initial_form)

  useEffect(()=>{
    let v=true
    if(
       !form.number ||
       !form.type
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
    
     let r=await data.makeRequest({method:'post',url:`api/payment-method/`+id,withToken:true,data:form_data, error: ``},0);
     setForm({...form,r})
     toast.success('Actualizado com sucesso')
     setLoading(false)

   }else{
     let response=await data.makeRequest({method:'post',url:`api/payment-method/`,withToken:true,data:form_data, error: ``},0);
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

        let response=await data.makeRequest({method:'get',url:`api/payment-method/`+id,withToken:true, error: ``},0);
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
          <FormLayout  hide={!itemToEditLoaded && id} title={id ? 'Editar Método de pagamento' : 'Adicionar método de pagamento'} verified_inputs={verified_inputs} form={form}
          

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
              selectOptions={
                [
                  { name: 'M-pesa', value: 'mpesa' },
                  { name: 'E-mola', value: 'emola' },
                  { name: 'M-kesh', value: 'mkesh' },
                  { name: 'Cartão bancário', value: 'creditcard' },
                  { name: 'Millennium BIM', value: 'bim' },
                  { name: 'BCI', value: 'bci' },
                  { name: 'Standard Bank', value: 'standardbank' },
                  { name: 'Moza Banco', value: 'moza' },
                  { name: 'FNB', value: 'fnb' },
                  { name: 'Letshego', value: 'letshego' },
                  { name: 'Socremo', value: 'socremo' },,
                  { name: 'Access Bank', value: 'accessbank' },
                  { name: 'Ecobank', value: 'ecobank' }
                ]
                
              }
              onBlur={() => setVerifiedInputs([...verified_inputs, 'type'])} 
              label={'Tipo'} 
              onChange={(e) => setForm({...form, type: e.target.value})} 
              field={'type'} 
              value={form.type}
          />

          {/**<FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              r={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'name'])} 
              label={'Nome'} 
              onChange={(e) => setForm({...form, name: e.target.value})} 
              field={'name'} 
              value={form.name}
          />*/}


          <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              r={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'number'])} 
              label={'Número'} 
              onChange={(e) => setForm({...form, number: e.target.value})} 
              field={'number'} 
              value={form.number}
          />

          <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'nib'])} 
              label={'NIB'}
              hide={form.type=="mpesa" || form.type=="mkesh" || form.type=="emola" || form.type=="cash"} 
              onChange={(e) => setForm({...form, nib: e.target.value})} 
              field={'nib'} 
              value={form.nib}
          />

  </FormLayout>


          </div>
      </DefaultAdminLayout>
     </>
  )
}
