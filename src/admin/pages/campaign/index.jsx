import React, { useEffect, useState } from 'react'
import DefaultAdminLayout from '../../layout/DefaultAdminLayout'
import TopTotals from '../../components/totals/topTotals'
import { useData } from '../../../contexts/DataContext'
import BaiscTable from '../../components/tables/default-table'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import i18next from 'i18next'
import BasicPagination from '../../components/pagination/basic-pagination'

export default function AdminCampaigns() {
  const data=useData()
  const navigate=useNavigate()
  const {user}=useAuth()
  const {pathname}=useLocation()
  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [search,setSearch]=useState('')
  const [loading,setLoading]=useState(false)
  

  let required_data=['campaigns']

  useEffect(()=>{ 
    if(!user || updateFilters || data.updateTable) return
    data.handleLoaded('remove',required_data)
    data._get(required_data,{campaigns:{name:search,page:currentPage}}) 
  },[user,pathname,search,currentPage])



  useEffect(()=>{
    if(data.updateTable || updateFilters){
         data.setUpdateTable(null)
         setUpdateFilters(null)
         data.handleLoaded('remove',required_data)
         setCurrentPage(1)
         setLoading(false)
         data._get(required_data,{campaigns:{name:search,page:1}}) 
    }
 },[data.updateTable])


  return (
      <DefaultAdminLayout refresh={true} addBtn={{label:'Adicionar',onClick:()=>{
           navigate('/admin/campaigns/create')
      }}}>
          <div class="pt-6 px-4">
            
            <div className={`mb-4 ${!data._loaded.includes('campaigns') ? 'hidden':''}`}>
                <TopTotals items={[{
                    name:'Campanhas',
                    value:data._campaigns?.total
                }]}/>
            </div>

        <BaiscTable  addRes={()=>{
                     
            }}  loaded={data._loaded.includes('campaigns')} header={[
                    <BaiscTable.MainActions  data={data} options={{
                    deleteFunction:'default',
                    deleteUrl:'api/campaigns/delete'}
                    } items={data._campaigns?.data || []}/>,

                    'ID',
                    'Titulo',
                    'Descrição',
                    'Destino',
                    'Objectivo',
                    'Arrecadado',
                    'Relatório da Campanha',
                    'Data',
                    'Criado em'
                    ]
             }

               body={(data._campaigns.data || []).map((i,_i)=>(
                    
                         <BaiscTable.Tr>
                         <BaiscTable.Td>
                              <BaiscTable.Actions data={data}  options={{
                                   deleteFunction:'default',
                                   deleteUrl:'api/campaigns/delete',
                                   id:i.id}
                              }/>
                         </BaiscTable.Td>

                         <BaiscTable.Td onClick={()=>navigate('/admin/campaign/'+i.id)}>{i.id}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/campaign/'+i.id)} minWidth={250}>{data.text_l(i['title_pt'],100)}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/campaign/'+i.id)} minWidth={250}>{data.text_l(i['description_pt'],100)}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/campaign/'+i.id)}>{i.location}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/campaign/'+i.id)}>{data._cn(i.goal)}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/campaign/'+i.id)}>{data._cn(i.donations.map(item => parseFloat(item.amount || 0)).reduce((acc, curr) => acc + curr, 0))}</BaiscTable.Td>
                         <BaiscTable.Td>
                             {i.report_link && <div onClick={()=>{
                                window.open(data.APP_BASE_URL+"/file/"+i.report_link, '_blank')
                             }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z"/></svg>
                             </div>}
                             {!i.report_link && '-'}
                         </BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/campaign/'+i.id)}>{i.date.split('-')?.reverse()?.join('/')}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/campaign/'+i.id)}>{i.createdAt.split('T')[0]?.split('-')?.reverse()?.join('/') + " "+i.createdAt.split('T')[1].slice(0,5)}</BaiscTable.Td>
                         <BaiscTable.AdvancedActions data={data} w={200} id={i.id} items={[
                             {name:'Eliminar',onClick:()=>{
                                   setTimeout(()=>{
                                         data.setItemsToDelete({...data.itemsToDelete,url:'api/campaigns/delete',items:[i.id]})
                                         data._showPopUp('delete')
                                   },100)
                              },icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"></path></svg>)},
                              ]}/>
                        </BaiscTable.Tr>
                    ))}
          />
         <BasicPagination show={data._loaded.includes('campaigns')} from={'campaigns'} setCurrentPage={setCurrentPage} total={data._campaigns?.total}  current={data._campaigns?.currentPage} last={data._campaigns?.pages}/>
          </div>
      </DefaultAdminLayout>
  )
}
