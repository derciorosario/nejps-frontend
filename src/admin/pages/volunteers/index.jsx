import React, { useEffect, useState } from 'react'
import DefaultAdminLayout from '../../layout/DefaultAdminLayout'
import TopTotals from '../../components/totals/topTotals'
import { useData } from '../../../contexts/DataContext'
import BaiscTable from '../../components/tables/default-table'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import BasicPagination from '../../components/pagination/basic-pagination'
import DonorDonations from '../../components/Dialog/donorDonations'
import BasicFilter from '../../components/Filters/basic-filters'
import i18next from 'i18next'
import toast from 'react-hot-toast'

export default function Admindonors() {

  const data=useData()
  const navigate=useNavigate()
  const {user}=useAuth()
  const {pathname}=useLocation()
  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [search,setSearch]=useState('')
  const [loading,setLoading]=useState(false)
  const [showDonations,setShowDonations]=useState(false)
  let required_data=['volunteers']


  const [filterOptions,setFilterOptions]=useState([
    {
        open:false,
        field:'status',
        name:"Estado",
        t_name:'status',
        search:'',
        items:[
           {name:"Pendente",id:'pending'},
           {name:"Active",id:'active'},
           {name:"Inativo",id:'inactive'}
        ],
        param:'status',
        fetchable:false,
        loaded:true,
        selected_ids:[],
        default_ids:[]
      },
])


  useEffect(()=>{ 
    if(!user || updateFilters || data.updateTable) return
    data.handleLoaded('remove',required_data)
    data._get(required_data,{volunteers:{name:search,page:currentPage,...data.getParamsFromFilters(filterOptions)}}) 
  },[user,pathname,search,currentPage])


  useEffect(()=>{
    if(data.updateTable || updateFilters){
         data.setUpdateTable(null)
         setUpdateFilters(null)
         data.handleLoaded('remove',required_data)
         setCurrentPage(1)
         setLoading(false)
         data._get(required_data,{volunteers:{name:search,page:1,...data.getParamsFromFilters(filterOptions)}}) 
    }
 },[data.updateTable,updateFilters])

 async function handleItems({id,status}){ 

    data._closeAllPopUps()
    toast.remove()
    toast.loading('A actualizar...') 
    setLoading(true)
   
    try{
  
         await data.makeRequest({method:'post',url:`api/volunteers/status`,withToken:true,data:{
              status,
              id
        }, error: ``},0);
  
       toast.remove()
       toast.success("Actualizado com sucesso")
       data.setUpdateTable(Math.random())
 
    }catch(e){


        console.log({e})
       toast.remove()
       let msg="Acorreu um erro, tente novamente"
 
       setLoading(false)
 
       if(e.response){
         if(e.response.status==409){
           msg="Nome já existe"
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
}

  return (
    <>
      <DonorDonations show={showDonations} setShow={setShowDonations}/>
      <DefaultAdminLayout refresh={true} addBtn={{label:'Adicionar',onClick:()=>{
          navigate('/admin/volunteers/create')
      }}}>

          <div class="pt-6 px-4">

            <div className={`mb-4 ${!data._loaded.includes('volunteers') ? 'hidden':''}`}>
                <TopTotals items={[{
                    name:'Voluntários',
                    value:data._volunteers?.total
                }]}/>
            </div>
        <BasicFilter
         
         makeFiltersVisible={true}   setUpdateFilters={setUpdateFilters} filterOptions={filterOptions}  setFilterOptions={setFilterOptions}/>
        <BaiscTable addRes={()=>{
                        
        }} loaded={data._loaded.includes('volunteers')} header={[
                      <BaiscTable.MainActions  data={data} options={{
                      deleteFunction:'default',
                      deleteUrl:'api/volunteers/delete'}
                      } items={data._volunteers?.data || []}/>,
                        'ID',
                        'Nome',
                        'Função',
                        'Estado',
                        'Email',
                        'Número de contacto',
                        'Número de whatsapp',
                        'Endereço',
                        'Criado em'
                      ]
              }

               body={(data._volunteers.data || []).map((i,_i)=>(
                         <BaiscTable.Tr>
                         <BaiscTable.Td>

                                <BaiscTable.Actions data={data}  options={{
                                    deleteFunction:'default',
                                    deleteUrl:'api/volunteers/delete',
                                    id:i.id}
                                }/>

                         </BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/volunteer/'+i.id)}>{i.id}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/volunteer/'+i.id)}>{i.name}</BaiscTable.Td> 
                         <BaiscTable.Td  onClick={()=>navigate('/admin/volunteer/'+i.id)}>{i.role_pt  ? i['role_'+i18next.language] : '-'}</BaiscTable.Td>
                        
                         <BaiscTable.Td onClick={()=>setEdit(i)}>
                            
                                <button style={{border:0}} type="button"  class={`text-white cursor-default ${i.status=="pending" ? "bg-[#eab308]" : i.status=="active" ? 'bg-green-500':'bg-gray-400'} focus:outline-none  font-medium rounded-[0.3rem] text-sm px-2 py-1 text-center inline-flex items-center`}>
                                     {i.status=="pending" ? 'Pendente' : i.status=="inactive" ? "Inativo" : "Activo"}
                                </button>
                         </BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/volunteer/'+i.id)}>{i.email || '-'}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/volunteer/'+i.id)}>{i.phone || '-'}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/volunteer/'+i.id)}>{i.whatsapp_contact || '-'}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/volunteer/'+i.id)}>{i.address || '-'}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/volunteer/'+i.id)}>{i.createdAt.split('T')[0]?.split('-')?.reverse()?.join('/') + " "+i.createdAt.split('T')[1].slice(0,5)}</BaiscTable.Td>
                         <BaiscTable.AdvancedActions data={data} w={200} id={i.id} items={[
                             {name:'Eliminar',onClick:()=>{
                                   setTimeout(()=>{
                                         data.setItemsToDelete({...data.itemsToDelete,url:'api/volunteers/delete',items:[i.id]})
                                         data._showPopUp('delete')
                                   },100)
                              },icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"></path></svg>)},
                              {name:'Desabilitar',hide:i.status=="inactive",onClick:()=>{handleItems({status:'inactive',id:i.id})},icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>)},
                              {name:'Activar',hide:i.status=="active",onClick:()=>{handleItems({status:'active',id:i.id})},icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>)},
                         
                           ]}/>
                        </BaiscTable.Tr>
                    ))}
          />

             <BasicPagination show={data._loaded.includes('volunteers')} from={'volunteers'} setCurrentPage={setCurrentPage} total={data._volunteers?.total}  current={data._volunteers?.page} last={data._volunteers?.totalPages}/>
          </div>
      </DefaultAdminLayout>
    </>
  )
}
