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
  let required_data=['payment_methods']


  useEffect(()=>{ 
    if(!user || updateFilters || data.updateTable) return
    data.handleLoaded('remove',required_data)
    data._get(required_data,{payment_methods:{name:search,page:currentPage}}) 
  },[user,pathname,search,currentPage])


  useEffect(()=>{

    if(data.updateTable || updateFilters){
         data.setUpdateTable(null)
         setUpdateFilters(null)
         data.handleLoaded('remove',required_data)
         setCurrentPage(1)
         setLoading(false)
         data._get(required_data,{payment_methods:{name:search,page:1}}) 
    }

 },[data.updateTable,updateFilters])


  return (
     <DefaultAdminLayout refresh={true} addBtn={{label:'Adicionar',onClick:()=>{
           navigate('/admin/payment-methods/create')
      }}}>
          <div class="pt-6 px-4">
            
            <div className={`mb-4 ${!data._loaded.includes('payment-methods') ? 'hidden':''}`}>
                <TopTotals items={[{
                    name:'Categorias de galeria',
                    value:data._payment_methods?.total
                }]}/>
            </div>

        <BaiscTable  addRes={()=>{
                     
              }}  loaded={data._loaded.includes('payment_methods')} header={[
                        'ID',
                        'Número',
                        'NIB',
                        'Criado em'
                      ]
              }

               body={(data._payment_methods.data || []).map((i,_i)=>(

                         <BaiscTable.Tr>
                         <BaiscTable.Td onClick={()=>navigate('/admin/payment-method/'+i.id)}>{i.id}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/payment-method/'+i.id)}>{
                                  i.type === "cash" ? "Em numerário" :
                                  i.type === "mpesa" ? "M-pesa" :
                                  i.type === "emola" ? "E-mola" :
                                  i.type === "mkesh" ? "M-Kesh" :
                                  i.type === "creditcard" ? "Cartão bancário" :
                                  i.type === "bci" ? "BCI" :
                                  i.type === "fnb" ? "FNB" :
                                  i.type === "standardbank" ? "Standard Bank" :
                                  i.type === "bim" ? "Millennium BIM" :
                                  i.type === "letshego" ? "Letshego" :
                                  i.type === "socremo" ? "Socremo" :
                                  i.type === "moza" ? "Moza Banco" :
                                  i.type === "accessbank" ? "Access Bank" :
                                  i.type === "ecobank" ? "Ecobank" :
                                  "Desconhecido"
                              }
                         </BaiscTable.Td>
                         
                         <BaiscTable.Td onClick={()=>navigate('/admin/payment-method/'+i.id)}>{i.number}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/payment-method/'+i.id)}>{i.nib || '-'}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/payment-method/'+i.id)}>{i.createdAt.split('T')[0]?.split('-')?.reverse()?.join('/') + " "+i.createdAt.split('T')[1].slice(0,5)}</BaiscTable.Td>
                        </BaiscTable.Tr>
                    ))}
          />
            <BasicPagination show={data._loaded.includes('payment_methods')} from={'payment_methods'} setCurrentPage={setCurrentPage} total={data._payment_methods?.total}  current={data._payment_methods?.page} last={data._payment_methods?.totalPages}/>
          </div>
      </DefaultAdminLayout>
  )
}
