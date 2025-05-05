import React, { useEffect, useState } from 'react'
import DefaultAdminLayout from '../../layout/DefaultAdminLayout'
import { useData } from '../../../contexts/DataContext'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import FormLayout from '../../layout/DefaultFormLayout'
import FileInput from '../../components/Inputs/file'
import { useAuth } from '../../../contexts/AuthContext'
import toast from 'react-hot-toast'
import DefaultFormSkeleton from '../../components/Skeleton/defaultForm'
import FormCard from '../../components/Cards/form-card'


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

  let initial_form={}

 
  const [form,setForm]=useState(initial_form)



useEffect(()=>{

    if(!user || !id){
        return
    }

    (async()=>{
      try{

        let response=await data.makeRequest({method:'get',url:`api/contact/`+id,withToken:true, error: ``},0);
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
          <FormLayout  hide={!itemToEditLoaded && id} title={id ? 'Detalhes do contacto' : ''} verified_inputs={verified_inputs} form={form}>
                  <FormCard hide={!itemToEditLoaded && id} items={[
                     {name:'Nome',value:form.name || '-'},
                     {name:'Contacto',value:form.phone || '-'},
                     {name:'Email',value:form.email || '-'},
                     {name:'Criado em',value:form.createdAt?.split('T')[0]?.split('-')?.reverse()?.join('/') + " "+form.createdAt?.split('T')[1].slice(0,5)},
                     {name:'Mensagem',value:form.message || '-'},
                  ]}/>
        </FormLayout>


          </div>
      </DefaultAdminLayout>
     </>
  )
}
