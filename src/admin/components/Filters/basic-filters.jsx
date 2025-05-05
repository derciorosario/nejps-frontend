import i18next, { t } from 'i18next'
import React, { useEffect } from 'react'
import { useData } from '../../../contexts/DataContext'
import { Loader } from 'lucide-react'

export default function BasicFilter({searchPlaceHolder,search,setSearch,makeFiltersVisible,dateFilters,setDateFilter,filterOptions,setFilterOptions,setUpdateFilters,end,start,setEnd,setStart}) {

  const data=useData()
  
  useEffect(()=>{

     (async()=>{
        let required_data = filterOptions.filter(i => i.fetchable).map(i => i.field);

        let params={}
        filterOptions.filter(i => i.fetchable).forEach(i=>{
           if(i.params){
             params[i.field]=i.params
           }
        })
        const d = await data._get(required_data,params);
        Object.keys(d).forEach(k => {
        const optionsIndex = filterOptions.findIndex(i => i.field === k);
        setFilterOptions(prev => {
            const newOptions = [...prev];
            if (optionsIndex !== -1) {
            newOptions[optionsIndex] = { ...newOptions[optionsIndex], items: d[k].data ? d[k].data : d[k], loaded: true };
            }
            return newOptions;
        });
        });
    })()
  },[])


  return (
    <>
    <div className={`${!data.showFilters && !makeFiltersVisible ? 'hidden':''}`}>
    <div>
         
         <div className="flex items-center gap-x-2 mb-3">
            

           {(filterOptions.some(i=>i.selected_ids.length) || end || start) && <button onClick={()=>{
                setFilterOptions(prev=>prev.map(i=>({...i,selected_ids:[]})))
                setUpdateFilters(Math.random())
                setStart('')
                setEnd('')
           }} type="button" class="text-white bg-honolulu_blue-500 font-medium rounded-full text-sm px-2 py-1 flex items-center  focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/></svg>
                <span class="ml-1 max-md:hidden">{"Limpar filtros"}</span>
          </button>}


          {search!=undefined && <div class="max-w-sm min-w-[100px] bg-white">
            <div class="relative">
              <input
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                class="w-[200px] bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-14 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder={searchPlaceHolder || 'Pesquise'} 
              />
              <button
                class="absolute top-1.5 right-1 flex items-center rounded bg-honolulu_blue-500 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none hover:bg-honolulu_blue-500 active:shadow-none"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                  <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
                </svg>
              </button> 
            </div>
          </div>}


       
         {dateFilters?.map((i,_i)=>(
             <div id="dropdown" className="z-10  p-3 bg-white rounded-lg shadow  w-full mb-2">
             <h6 className="mb-2 text-sm font-medium text-gray-900">
                 {i.start_name}
             </h6>

             <input onChange={(e)=>{
                 setDateFilter([...dateFilters.filter(f=>f.field!=i.field),{
                   ...i,start:e.target.value
                 }])
                 setUpdateFilters(Math.random())
             }} value={i.start} type="date" className="block w-full mb-2 py-1 text-sm text-gray-900 border border-gray-300 rounded-[0.3rem] bg-gray-50"/>
           
             <h6 className="mb-2 text-sm font-medium text-gray-900">
                  {i.end_name}
             </h6>

             <input onChange={(e)=>{
                setDateFilter([...dateFilters.filter(f=>f.field!=i.field),{
                 ...i,end:e.target.value
               }])
               setUpdateFilters(Math.random())
             }} value={i.end} type="date" className="block w-full py-1 text-sm text-gray-900 border border-gray-300 rounded-[0.3rem] bg-gray-50"/>
           
           </div>
           
         ))}
         

           {(end!=undefined && start!=undefined) && <div id="dropdown" className="px-2 py-1 bg-white rounded-[0.3rem] shadow  flex items-center">
               <h6 className="text-sm font-medium text-gray-900 mr-1">
                    {'Inicio'}
               </h6>

               <input onChange={(e)=>{
                setStart(e.target.value)
                setUpdateFilters(Math.random())
               }} value={start} type="date" className="block mr-2 w-full  py-1 text-sm text-gray-900 border border-gray-300 rounded-[0.3rem] bg-gray-50"/>
              
               <h6 className="text-sm mr-1 font-medium text-gray-900">
                    {"Fim"}
               </h6>
               <input onChange={(e)=>{
                  setEnd(e.target.value)
                  setUpdateFilters(Math.random())
               }} value={end} type="date" className="block w-full py-1 text-sm text-gray-900 border border-gray-300 rounded-[0.3rem] bg-gray-50"/>
              
           </div>}


           {filterOptions.map((f,_f)=>(

             
              <div className="relative _filter min-w-[170px]">

                 <div onClick={()=>{
                      if(data._openPopUps.filter==f.field){
                        data._closeAllPopUps()
                      }else{ 
                        data._showPopUp('filter',f.field)
                      }
                 }} className="flex cursor-pointer border px-2 py-2 rounded-[0.3rem] bg-white  justify-between">
                    <h6 className=" text-sm font-medium text-gray-900 bg-white">
                      {f.name}
                    </h6>

                    <div className="flex items-center">
                        {f.selected_ids.length != 0 && <span className="bg-honolulu_blue-400  text-white -top-1 -right-1 w-[20px] h-[20px] rounded-full flex items-center justify-center">
                         {f.selected_ids.length}
                        </span>}
                        <svg className={`${data._openPopUps.filter==f.field ? 'rotate-180':''}`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>
                    </div>

                   </div>

                     
                 <div className={`z-10 ${data._openPopUps.filter==f.field ? '':'opacity-0 pointer-events-none translate-y-[10px]'} transition-all ease-in delay-75  p-3 bg-white rounded-lg shadow  w-full mb-2 absolute top-[100%]`}>
               {f.selected_ids.length!=0 && <span className="underline text-honolulu_blue-400 text-[13px] cursor-pointer flex justify-end"  onClick={() => {
                       const optionsIndex = filterOptions.findIndex(i => i.field === f.field);
                       setFilterOptions(prev => {
                         const newOptions = [...prev];
                         if (optionsIndex !== -1) {
                           newOptions[optionsIndex] = {
                             ...newOptions[optionsIndex],
                             selected_ids: []
                           };
                         }
                         return newOptions;
                       });
                       setUpdateFilters(Math.random())
                       
                      }}>{'Limpar'}</span>}

              

               {!f.loaded && <div className="flex items-center">
                    <Loader h={20} w={20}/>
                    <span className="ml-1 text-[14px]">{"A carregar"}...</span>
               </div>}


               {f.loaded && <div className="relative mb-2">
                   <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                       <svg className="text-gray-500 dark:text-gray-400" height={16} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                           <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                       </svg>
                   </div>
                   <input onChange={(e) => {
                       const optionsIndex = filterOptions.findIndex(i => i.field === f.field);
                       setFilterOptions(prev => {
                       const newOptions = [...prev];
                       if (optionsIndex !== -1) {
                           newOptions[optionsIndex] = { ...newOptions[optionsIndex], search: e.target.value };
                       } 
                       return newOptions;
                       });
                       setUpdateFilters(Math.random())
                   }}   id="default-search" className="block w-full px-2 py-1 ps-10 text-sm text-gray-900 border border-gray-300 rounded-[0.3rem] bg-gray-50" placeholder={'Pesquise'}/>
               
               </div>}



               <ul className={`space-y-2 overflow-y-auto max-h-[140px] text-sm ${!f.loaded ? 'hidden':''}`} aria-labelledby="dropdownDefault">
               
               {f.items.filter(i=>(i?.name || (i?.pt_name || i?.en_name) || i)?.toLowerCase()?.includes(f.search.toLowerCase())).map((i,_i)=>(
                   <li className="flex items-center px-[1px] cursor-pointer" onClick={() => {
                       const optionsIndex = filterOptions.findIndex(i => i.field === f.field);
                       setFilterOptions(prev => {
                         const newOptions = [...prev];
                         if (optionsIndex !== -1) {
                           newOptions[optionsIndex] = {
                             ...newOptions[optionsIndex],
                             selected_ids: newOptions[optionsIndex].selected_ids.includes(i.id || i)
                               ? newOptions[optionsIndex].selected_ids.filter(j => j !== (i.id || i))
                               : [...newOptions[optionsIndex].selected_ids, (i.id || i)]
                           };
                         }
                         return newOptions;
                       });
                       setUpdateFilters(Math.random())

                      }}>

                       <input  checked={f.selected_ids.includes(i.id || i)} type="checkbox" value="" className="w-4 h-4 flex-shrink-0 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 focus:ring-2" />

                       <span  className="ml-2 flex-1 flex  text-sm font-medium text-gray-900 cursor-pointer">
                         {i.name || (i?.pt_name || i?.en_name) || i} 
                       </span>
                  </li>
               ))}
               
               </ul>
              </div>
            </div>

           ))}

         </div>
   </div>
    </div>
    
    </>
  )
}
