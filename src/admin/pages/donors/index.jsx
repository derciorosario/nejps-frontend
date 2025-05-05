import React, { useEffect, useState } from 'react'
import DefaultAdminLayout from '../../layout/DefaultAdminLayout'
import TopTotals from '../../components/totals/topTotals'
import { useData } from '../../../contexts/DataContext'
import BaiscTable from '../../components/tables/default-table'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import BasicPagination from '../../components/pagination/basic-pagination'
import DonorDonations from '../../components/Dialog/donorDonations'

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

  let required_data=['donors']


  useEffect(()=>{ 
    if(!user || updateFilters || data.updateTable) return
    data.handleLoaded('remove',required_data)
    data._get(required_data,{donors:{name:search,page:currentPage}}) 
  },[user,pathname,search,currentPage])


  useEffect(()=>{
    if(data.updateTable || updateFilters){
         data.setUpdateTable(null)
         setUpdateFilters(null)
         data.handleLoaded('remove',required_data)
         setCurrentPage(1)
         setLoading(false)
         data._get(required_data,{donors:{name:search,page:1}}) 
    }
 },[data.updateTable,updateFilters])


  return (
    <>

      <DonorDonations show={showDonations} setShow={setShowDonations}/>
      <DefaultAdminLayout refresh={true} addBtn={{label:'Adicionar',onClick:()=>{
          navigate('/admin/donors/create')
      }}}>

          <div class="pt-6 px-4">
            <div className={`mb-4 ${!data._loaded.includes('donors') ? 'hidden':''}`}>
                <TopTotals items={[{
                    name:'Doadores',
                    value:data._donors?.total
                }]}/>
            </div>

        <BaiscTable addRes={()=>{
                     
        }} loaded={data._loaded.includes('donors')} header={[
                      <BaiscTable.MainActions  data={data} options={{
                      deleteFunction:'default',
                      deleteUrl:'api/donors/delete'}
                      } items={data._donors?.data || []}/>,
                        'ID',
                        'Nome',
                        'Email',
                        'Número de contacto',
                        'Endereço',
                        'Total arrecadado',
                        'Doações',
                        'Criado em'
                      ]
              }

               body={(data._donors.data || []).map((i,_i)=>(
                         <BaiscTable.Tr>
                         <BaiscTable.Td>
                                <BaiscTable.Actions data={data}  options={{
                                    deleteFunction:'default',
                                    deleteUrl:'api/donors/delete',
                                    id:i.id}
                                }/>
                         </BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/donor/'+i.id)}>{i.id}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/donor/'+i.id)}>{i.name}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/donor/'+i.id)}>{i.email || '-'}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/donor/'+i.id)}>{i.phone || '-'}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/donor/'+i.id)}>{i.address || '-'}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/donor/'+i.id)}>{data._cn(i.totalAmount)}</BaiscTable.Td>
                         <BaiscTable.Td>
                                {i.donations.length == 0 ? <span className="px-5">0</span> : <span onClick={()=>setShowDonations(i)} className="underline relative px-5 text-blue-500 cursor-pointer">{i.donations.length}</span>}
                         </BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/donor/'+i.id)}>{i.createdAt.split('T')[0]?.split('-')?.reverse()?.join('/') + " "+i.createdAt.split('T')[1].slice(0,5)}</BaiscTable.Td>
                         <BaiscTable.AdvancedActions data={data} w={200} id={i.id} items={[
                             {name:'Eliminar',onClick:()=>{
                                   setTimeout(()=>{
                                         data.setItemsToDelete({...data.itemsToDelete,url:'api/donors/delete',items:[i.id]})
                                         data._showPopUp('delete')
                                   },100)
                              },icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"></path></svg>)},
                           ]}/>
                        </BaiscTable.Tr>
                    ))}
          />

             <BasicPagination show={data._loaded.includes('donors')} from={'donors'} setCurrentPage={setCurrentPage} total={data._donors?.total}  current={data._donors?.page} last={data._donors?.totalPages}/>
          </div>
      </DefaultAdminLayout>
    </>
  )
}
