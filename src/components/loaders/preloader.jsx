import React from 'react'

import { useData } from '../../contexts/DataContext'


function Preloader({showAnyway}) {
  const data=useData()
  return (
    <div style={{zIndex:99}} className={`flex items-center bg-white ${(data.isLoading || showAnyway) ? '' : 'opacity-0 pointer-events-none'} delay-100 ease-in transition-all flex-col justify-center fixed w-full h-[100vh]`}>
           <div className="text-[30px]">
            ❤️
           </div>
           <div class="loading-dots absolute bottom-[100px]">
              <div style={{display:'none'}} class="loading-dots-dot"></div>
              <div class="loading-dots-dot"></div>
              <div style={{display:'none'}} class="loading-dots-dot"></div>
           </div>
    </div>
  )
}

export default Preloader