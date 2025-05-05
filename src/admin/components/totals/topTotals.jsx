import React from 'react'

export default function TopTotals({items=[]}) {
  return (
    <div class="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((i,_i)=>(
            <div class="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                    <span class="text-2xl sm:text-3xl leading-none font-bold text-gray-900">{i.value}</span>
                    <h3 class="text-base font-normal text-gray-500">{i.name}</h3>
                    </div>
                </div>
            </div>
        ))}
               
    </div>
  )
}
