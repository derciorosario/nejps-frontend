import React, { useEffect, useState } from 'react'
import DefaultAdminLayout from '../../layout/DefaultAdminLayout'
import { useData } from '../../../contexts/DataContext'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import FormLayout from '../../layout/DefaultFormLayout'
import FileInput from '../../components/Inputs/file'
import { useAuth } from '../../../contexts/AuthContext'
import toast from 'react-hot-toast'
import DefaultFormSkeleton from '../../components/Skeleton/defaultForm'

import {
    HandCoins,
} from "lucide-react";

export default function CreateAdminDonations({hideLayout,itemToShow,setItemToShow}) {
  const data=useData()
  const { id } = useParams()
  const {pathname,search } = useLocation()
  const {user=null}=useAuth()
  const [loading,setLoading]=useState(false);
  const [itemToEditLoaded,setItemToEditLoaded]=useState(false)
  const [verified_inputs,setVerifiedInputs]=useState([])
  const [valid,setValid]=useState(false)

  let initial_form={
    name: "",
    date: "",
    payment_method: "",
    time: "",
    amount: "",
    proof:"",
    donor_id:""
  }

  let required_data=['donors_list']

  useEffect(()=>{ 
    if(!user) return
    data.handleLoaded('remove',required_data)
    data._get(required_data) 
  },[user,pathname])
 
  const [form,setForm]=useState(initial_form)
  function handleUploadedFiles(upload){
    setForm({...form,[upload.key]:upload.filename})
  }

  useEffect(()=>{
    let v=true
    if(
       !form.date ||
       !form.payment_method ||
       !form.amount ||
       !form.proof 
    ){
       v=false
    }

    setValid(v)

 },[form])


 async function SubmitForm(){

  setLoading(true)

  try{

   let form_data={
     ...form,
     campaign_id:id
   }

   if(itemToShow?.update_id){

     let r=await data.makeRequest({method:'post',url:`api/donation/`+itemToShow?.update_id,withToken:true,data:form_data, error: ``},0);
     setForm({...form,r})
     toast.success('Actualizado com sucesso')
     setLoading(false)

   }else{

     let response=await data.makeRequest({method:'post',url:`api/donation/`,withToken:true,data:form_data, error: ``},0);
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

    toast.error(msg)
    setLoading(false)
   
 }

}


useEffect(()=>{

    

    if(!user || itemToShow?.action=="create"){
        return
    }

    (async()=>{
      try{

        let response=await data.makeRequest({method:'get',url:`api/donation/`+itemToShow?.update_id,withToken:true, error: ``},100);
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
              setEdit(null)
          }
          if(e.response.status==500){
              msg="Erro, inesperado. Contacte seu administrador"
          }

        }else if(e.code=='ERR_NETWORK'){
              msg="Verfique sua internet e tente novamente"
        }

        toast.error(msg)
    }
    
  })()

},[user,pathname])

console.log({form})


  return (
      <DefaultAdminLayout hide={hideLayout}>
          <div class="pt-6 px-4">
          {(!itemToEditLoaded && itemToShow?.update_id || !data._loaded.includes('donors_list')) && <div className="mt-10">
                <DefaultFormSkeleton/>
         </div>}
          <FormLayout  hide={!itemToEditLoaded && itemToShow?.update_id || !data._loaded.includes('donors_list')} title={itemToShow?.update_id ? 'Editar doação' : 'Adicionar doação'} verified_inputs={verified_inputs} form={form}
          bottomContent={(
              <div>
                  <div className="mt-5">
                    {(itemToEditLoaded || !itemToShow?.update_id) && <FileInput r={true}  _upload={{key:'proof',filename:form.proof}} res={handleUploadedFiles} label={'Comprovativo'}/>}
                  </div>
              </div>
          )}

          button={(
                <div className={`mt-[40px]`}>
                    <FormLayout.Button onClick={()=>{
                        SubmitForm()
                    }} valid={valid} loading={loading} label={itemToShow?.update_id ? "Actualizar" : 'Enviar'}/>
                </div>
           )}
          >

          <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              type={'number'}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'amount'])} 
              label={'Valor'} 
              onChange={(e) => setForm({...form,amount:e.target.value})} 
              field={'amount'} 
              value={form.amount}
              r={true}
          />

          <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              r={true}
              selectOptions={data._donors_list.map(i=>({...i,value:i.id}))}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'donor_id'])} 
              label={'Doador'} 
              onChange={(e) => setForm({...form, donor_id: e.target.value})} 
              field={'donor'} 
              value={form.donor_id}
          />


          <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              r={true}
              selectOptions={
                [
                  { name: 'M-pesa', value: 'mpesa' },
                  { name: 'E-mola', value: 'emola' },
                  { name: 'M-kesh', value: 'mkesh' },
                  { name: 'Em numerário', value: 'cash' },
                  { name: 'Cartão bancário', value: 'creditcard' },
                  { name: 'Millennium BIM', value: 'bim' },
                  /* { name: 'BCI', value: 'bci' },
                  { name: 'Standard Bank', value: 'standardbank' },
                  { name: 'Moza Banco', value: 'moza' },
                  { name: 'FNB', value: 'fnb' },
                  { name: 'Letshego', value: 'letshego' },
                  { name: 'Socremo', value: 'socremo' },,
                  { name: 'Access Bank', value: 'accessbank' },
                  { name: 'Ecobank', value: 'ecobank' }*/
                ]
                
              }
              onBlur={() => setVerifiedInputs([...verified_inputs, 'payment_method'])} 
              label={'Método de pagamento'} 
              onChange={(e) => setForm({...form, payment_method: e.target.value})} 
              field={'payment_method'} 
              value={form.payment_method}
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
              onBlur={() => setVerifiedInputs([...verified_inputs, 'time'])} 
              label={'Hora'} 
              onChange={(e) => setForm({...form, time: e.target.value})} 
              field={'time'} 
              type={'time'}
              value={form.time}
          />

  </FormLayout>


          </div>
      </DefaultAdminLayout>
  )
}
