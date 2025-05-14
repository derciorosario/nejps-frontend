import React, { useEffect, useState } from 'react'
import DefaultAdminLayout from '../../layout/DefaultAdminLayout'
import TopTotals from '../../components/totals/topTotals'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { useData } from '../../../contexts/DataContext'
import i18next from 'i18next'
import DashboardSkeleton from '../../components/Skeleton/dashboad'

export default function Dashboard() {

      const data=useData()
      const navigate=useNavigate()
      const {user}=useAuth()
      const {pathname}=useLocation()
      const [currentPage,setCurrentPage]=useState(1)
      const [updateFilters,setUpdateFilters]=useState(null)
      const [search,setSearch]=useState('')
      const [loading,setLoading]=useState(false)
    
      let required_data=['dashboard']
      
      useEffect(()=>{ 
        if(!user || updateFilters || data.updateTable) return
        data.handleLoaded('remove',required_data)
        data._get(required_data,{dashboad:{name:search}}) 
      },[user,pathname,search,currentPage])
    
    
    
      useEffect(()=>{
        
        if(data.updateTable || updateFilters){
             data.setUpdateTable(null)
             setUpdateFilters(null)
             data.handleLoaded('remove',required_data)
             setCurrentPage(1)
             setLoading(false)
             data._get(required_data,{dashboad:{name:search}}) 
        }
    
     },[data.updateTable,updateFilters])


  return (
      <DefaultAdminLayout refresh={true}>
          <div class="pt-6 px-4">
             {!data._loaded.includes('dashboard') && <DashboardSkeleton/>}
             <div className={`${!data._loaded.includes('dashboard') ? 'hidden':''}`}>
                <TopTotals items={[
                    {
                        name:'Campanhas',
                        value:data._dashboard?.stats?.campaigns || 0
                    },
                    {
                     name:'Doadores',
                     value:data._dashboard?.stats?.donors || 0
                    },
                    {
                     name:'Voluntários',
                     value:data._dashboard?.stats?.volunteers || 0
                    },
                    {
                        name:'Doações',
                        value:data._dashboard?.stats?.donations || 0
                    },
                    {
                        name:'Eventos',
                        value:data._dashboard?.stats?.events || 0
                    },
                    {
                        name:'Total arrecadado',
                        value:data._cn(data._dashboard?.stats?.totalRaised || 0)
                    },
                ]}/>
             </div>

             

             <div class={`grid grid-cols-1 2xl:grid-cols-2 xl:gap-4 my-4 ${!data._loaded.includes('dashboard') ? 'hidden':''}`}>
             <div class="bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full">
                   <div class="flex items-center justify-between mb-4">
                      <h3 class="text-xl font-bold leading-none text-gray-900">Campanhas com mais arrecadações</h3>
                      {/**<a href="#" class="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg inline-flex items-center p-2">
                      View all
                      </a> */}
                   </div>

                   {(data._dashboard.topCampaigns || []).length==0 && <p className="text-gray-400">Sem resultado campanhas</p>}
                   <div class={`flow-root`}>
                      <ul role="list" class="divide-y divide-gray-200">
                         {(data._dashboard.topCampaigns || []).map((i,_i)=>(
                             <li class="py-3 sm:py-4">
                             <div class="flex items-center space-x-4">
                               
                                <div class="flex-1 min-w-0">
                                   <p class="text-sm font-medium text-gray-900 truncate">
                                      {i.campaign.title_pt}
                                   </p>
                                   <p class="text-sm text-gray-500 truncate">
                                      
                                   </p>
                                </div>
                                <div class="inline-flex items-center text-base font-semibold text-gray-900">
                                   {data._cn(i.totalRaised)}
                                </div>
                             </div>
                          </li>
                         ))}
                       
                      </ul>
                   </div>
                </div>
                <div class="bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full">
                   <div class="flex items-center justify-between mb-4">
                      <h3 class="text-xl font-bold leading-none text-gray-900">Últimas doações</h3>
                      {/**<a href="#" class="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg inline-flex items-center p-2">
                      View all
                      </a> */}
                   </div>
                   {(data._dashboard.recentDonations || []).length==0 && <p className="text-gray-400">Nenhuma doação</p>}
                   <div class={`flow-root`}>
                      <ul role="list" class="divide-y divide-gray-200">
                         {(data._dashboard.recentDonations || []).map((i,_i)=>(
                             <li class="py-3 sm:py-4">
                             <div class="flex items-center space-x-4">
                               
                                <div class="flex-1 min-w-0">
                                   <p class="text-sm font-medium text-gray-900 truncate">
                                      {i.donor.name || 'Anonimato'}
                                   </p>
                                   <p class="text-sm text-gray-500 truncate">
                                      {i.campaign['title_pt']}
                                   </p>
                                </div>
                                <div class="inline-flex items-center text-base font-semibold text-gray-900">
                                   {data._cn(i.amount)}
                                </div>
                             </div>
                          </li>
                         ))}
                       
                      </ul>
                   </div>
                </div>
                
             </div>
          </div>
      </DefaultAdminLayout>
  )
}
