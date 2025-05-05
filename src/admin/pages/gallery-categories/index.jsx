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
  let required_data=['gallery_categories']


  useEffect(()=>{ 
    if(!user || updateFilters || data.updateTable) return
    data.handleLoaded('remove',required_data)
    data._get(required_data,{gallery_categories:{name:search,page:currentPage}}) 
  },[user,pathname,search,currentPage])


  useEffect(()=>{

    if(data.updateTable || updateFilters){
         data.setUpdateTable(null)
         setUpdateFilters(null)
         data.handleLoaded('remove',required_data)
         setCurrentPage(1)
         setLoading(false)
         data._get(required_data,{gallery_categories:{name:search,page:1}}) 
    }

 },[data.updateTable,updateFilters])


  return (
     <DefaultAdminLayout refresh={true} addBtn={{label:'Adicionar',onClick:()=>{
           navigate('/admin/gallery-categories/create')
      }}}>
          <div class="pt-6 px-4">
            
            <div className={`mb-4 ${!data._loaded.includes('gallery-categories') ? 'hidden':''}`}>
                <TopTotals items={[{
                    name:'Categorias de galeria',
                    value:data._gallery_categories?.total
                }]}/>
            </div>

        <BaiscTable  addRes={()=>{
                     
              }}  loaded={data._loaded.includes('gallery_categories')} header={[
                        'ID',
                        'Nome (pt)',
                        'Nome (en)',
                        'Número de imagens',
                        'Criado em'
                      ]
              }

               body={(data._gallery_categories.data || []).map((i,_i)=>(

                         <BaiscTable.Tr>
                         <BaiscTable.Td onClick={()=>navigate('/admin/gallery-category/'+i.id)}>{i.id}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/gallery-category/'+i.id)} minWidth={250}>{data.text_l(i['name_pt'],100)}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/gallery-category/'+i.id)} minWidth={250}>{data.text_l(i['name_en'],100)}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/gallery-category/'+i.id)} minWidth={250}>{i.images.length}</BaiscTable.Td>
                         <BaiscTable.Td onClick={()=>navigate('/admin/gallery-category/'+i.id)}>{i.createdAt.split('T')[0]?.split('-')?.reverse()?.join('/') + " "+i.createdAt.split('T')[1].slice(0,5)}</BaiscTable.Td>
                        </BaiscTable.Tr>
                    ))}
          />
            <BasicPagination show={data._loaded.includes('gallery_categories')} from={'gallery_categories'} setCurrentPage={setCurrentPage} total={data._gallery_categories?.total}  current={data._gallery_categories?.page} last={data._gallery_categories?.pages}/>
          </div>
      </DefaultAdminLayout>
  )
}
