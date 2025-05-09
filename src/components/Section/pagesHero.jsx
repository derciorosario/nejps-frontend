import React from 'react'

export default function PagesHero({name,img}) {
  return (
    <div className="h-[300px] bg-gray-500 w-full mt-[50px] overflow-hidden relative flex items-center">
         <div style={{zIndex:1}} className="w-full h-[450px]  bg-[rgba(0,0,0,0.3)] absolute left-0 top-0"></div>
         <div className={`_hero-bg ${img} w-full h-[450px]  object-cover fixed left-0 top-[50px]`}>
         </div>
         <div style={{zIndex:2}} className="w-full h-full z-10 flex items-center px-10">
                <h2 className="text-white uppercase max-md:text-[24px] text-[30px] font-bold">{name}</h2>
         </div>
    </div>
  )
}
