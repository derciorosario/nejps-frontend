import React, { useEffect, useState } from 'react'
import DefaultAdminLayout from '../../layout/DefaultAdminLayout'
import TopTotals from '../../components/totals/topTotals'
import { useData } from '../../../contexts/DataContext'
import BaiscTable from '../../components/tables/default-table'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import BasicPagination from '../../components/pagination/basic-pagination'

export default function AdminEvents() {

  const data=useData()
  const navigate=useNavigate()
  const {user}=useAuth()
  const {pathname}=useLocation()
  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [search,setSearch]=useState('')
  const [loading,setLoading]=useState(false)
  let required_data=['events']

  useEffect(()=>{ 
    if(!user || updateFilters || data.updateTable) return
    data.handleLoaded('remove',required_data)
    data._get(required_data,{events:{name:search,page:currentPage}}) 
  },[user,pathname,search,currentPage])


  useEffect(()=>{
    if(data.updateTable || updateFilters){
         data.setUpdateTable(null)
         setUpdateFilters(null)
         data.handleLoaded('remove',required_data)
         setCurrentPage(1)
         setLoading(false)
         data._get(required_data,{events:{name:search,page:1}}) 
    }
 },[data.updateTable,updateFilters])


  return (
      <DefaultAdminLayout refresh={true} addBtn={{label:'Adicionar',onClick:()=>{
           navigate('/admin/events/create')
      }}}>
          <div class="pt-6 px-4">
            
            <div className={`mb-4 ${!data._loaded.includes('events') ? 'hidden':''}`}>
                <TopTotals items={[{
                    name:'Eventos',
                    value:data._events?.total
                }]}/>
            </div>

        <BaiscTable  addRes={()=>{
                     
              }}  loaded={data._loaded.includes('events')} header={[
                      <BaiscTable.MainActions  data={data} options={{
                      deleteFunction:'default',
                      deleteUrl:'api/events/delete'}
                      } items={data._events?.data || []}/>,
                        'ID',
                        'Titulo',
                        'Descrição',
                        'Localização',
                        'Data',
                        'Hora de inicio',
                        'Hora de fim',
                        'Criado em'
                      ]
              }

               body={(data._events.data || []).map((i,_i)=>(

                         <BaiscTable.Tr>
                          <BaiscTable.Td>
                                <BaiscTable.Actions data={data}  options={{
                                    deleteFunction:'default',
                                    deleteUrl:'api/events/delete',
                                    id:i.id}
                                }/>
                          </BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/event/'+i.id)}>{i.id}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/event/'+i.id)} minWidth={250}>{data.text_l(i['title_pt'],100)}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/event/'+i.id)} minWidth={250}>{data.text_l(i['description_pt'],100)}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/event/'+i.id)}>{i.location}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/event/'+i.id)}>{i.date.split('-')?.reverse()?.join('/')}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.start_time || '-'}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.end_time || '-'}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/event/'+i.id)}>{i.createdAt.split('T')[0]?.split('-')?.reverse()?.join('/') + " "+i.createdAt.split('T')[1].slice(0,5)}</BaiscTable.Td>
                         <BaiscTable.AdvancedActions data={data} w={200} id={i.id} items={[
                             {name:'Eliminar',onClick:()=>{
                                   setTimeout(()=>{
                                         data.setItemsToDelete({...data.itemsToDelete,url:'api/events/delete',items:[i.id]})
                                         data._showPopUp('delete')
                                   },100)
                              },icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"></path></svg>)},
                              ]}/>
                        </BaiscTable.Tr>
                    ))}
          />

             <BasicPagination show={data._loaded.includes('events')} from={'events'} setCurrentPage={setCurrentPage} total={data._events?.total}  current={data._events?.page} last={data._events?.totalPages}/>
          </div>
      </DefaultAdminLayout>
  )
}
