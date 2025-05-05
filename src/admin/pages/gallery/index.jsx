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
      <DefaultAdminLayout addBtn={{label:'Actualizar Galleria',onClick:()=>{
           navigate('/admin/gallery/update')
      }}}>
          <div class="pt-6 px-4"> </div>
      </DefaultAdminLayout>
  )
}
