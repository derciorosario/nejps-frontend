import React, { useEffect, useState } from 'react'
import DefaultAdminLayout from '../../layout/DefaultAdminLayout'
import TopTotals from '../../components/totals/topTotals'
import { useData } from '../../../contexts/DataContext'
import BaiscTable from '../../components/tables/default-table'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import i18next from 'i18next'
import BasicPagination from '../../components/pagination/basic-pagination'

export default function AdminDonations({hideLayout,itemToShow,setItemToShow}) {
  const data=useData()
  const navigate=useNavigate()
  const {user}=useAuth()
  const { id } = useParams()
  const {pathname}=useLocation()
  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [search,setSearch]=useState('')
  const [loading,setLoading]=useState(false)

  let required_data=['donations']
  


  useEffect(()=>{ 
    if(!user || updateFilters || data.updateTable) return
    data.handleLoaded('remove',required_data)
    data._get(required_data,{donations:{name:search,page:currentPage,campaign_id:id}}) 
  },[user,pathname,search,currentPage])



  useEffect(()=>{
    
    if(data.updateTable || updateFilters){
         data.setUpdateTable(null)
         setUpdateFilters(null)
         data.handleLoaded('remove',required_data)
         setCurrentPage(1)
         setLoading(false)
         data._get(required_data,{donations:{name:search,page:1,campaign_id:id}}) 
    }

 },[data.updateTable])


 function globalOnclick(id){
    setItemToShow({
      ...itemToShow,
      action:'update',
      name:'create-donations',
      update_id:id
     })
  }


  return (
      <DefaultAdminLayout refresh={true} hide={hideLayout} addBtn={{label:'Adicionar',onClick:()=>{
           navigate('/admin/donations/create')
      }}}>
          <div class="pt-6 px-4">
            
            <div className={`mb-4 ${!data._loaded.includes('donations') ? 'hidden':''}`}>
                <TopTotals items={[{
                    name:'Doações',
                    value:data._donations?.total
                }]}/>
            </div>

        <BaiscTable  addRes={()=>{
                     
            }}  loaded={data._loaded.includes('donations')} header={[
                    <BaiscTable.MainActions  data={data} options={{
                    deleteFunction:'default',
                    deleteUrl:'api/donations/delete'}
                    } items={data._donations?.data || []}/>,
                    'ID',
                    'Nome do doador',
                    'Valor',
                    'Método de pagamento',
                    'Data',
                    'Hora',
                    'Comprovativo',
                    'Criado em'
                    ]
             }

               body={(data._donations.data || []).map((i,_i)=>(
                    
                         <BaiscTable.Tr>
                         <BaiscTable.Td>
                              <BaiscTable.Actions data={data}  options={{
                                   deleteFunction:'default',
                                   deleteUrl:'api/donations/delete',
                                   id:i.id}
                              }/>
                         </BaiscTable.Td>

                         <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.id}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.donor?.name || '-'}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{data._cn(i.amount)}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{
                                  i.payment_method === "cash" ? "Em numerário" :
                                  i.payment_method === "mpesa" ? "M-pesa" :
                                  i.payment_method === "emola" ? "E-mola" :
                                  i.payment_method === "mkesh" ? "M-Kesh" :
                                  i.payment_method === "creditcard" ? "Cartão bancário" :
                                  i.payment_method === "bci" ? "BCI" :
                                  i.payment_method === "fnb" ? "FNB" :
                                  i.payment_method === "standardbank" ? "Standard Bank" :
                                  i.payment_method === "bim" ? "Millennium BIM" :
                                  i.payment_method === "letshego" ? "Letshego" :
                                  i.payment_method === "socremo" ? "Socremo" :
                                  i.payment_method === "moza" ? "Moza Banco" :
                                  i.payment_method === "accessbank" ? "Access Bank" :
                                  i.payment_method === "ecobank" ? "Ecobank" :
                                  "Desconhecido"
                     }
                    </BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.date.split('-')?.reverse()?.join('/')}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.time}</BaiscTable.Td>
                         <BaiscTable.Td>
                             {i.proof && <div onClick={()=>{
                                window.open(data.APP_BASE_URL+"/file/"+i.proof, '_blank')
                             }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z"/></svg>
                             </div>}
                             {!i.proof && '-'}
                         </BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.createdAt.split('T')[0]?.split('-')?.reverse()?.join('/') + " "+i.createdAt.split('T')[1].slice(0,5)}</BaiscTable.Td>
                         <BaiscTable.AdvancedActions data={data} w={200} id={i.id} items={[
                             {name:'Eliminar',onClick:()=>{
                                   setTimeout(()=>{
                                         data.setItemsToDelete({...data.itemsToDelete,url:'api/donations/delete',items:[i.id]})
                                         data._showPopUp('delete')
                                   },100)
                              },icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"></path></svg>)},
                              ]}/>
                        </BaiscTable.Tr>
                    ))}
          />


             <BasicPagination show={data._loaded.includes('donations')} from={'donations'} setCurrentPage={setCurrentPage} total={data._donations?.total}  current={data._donations?.currentPage} last={data._donations?.pages}/>



          </div>
      </DefaultAdminLayout>
  )
}
