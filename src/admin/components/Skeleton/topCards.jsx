import React from 'react'

export default function TopCardSkeleton() {
  return (
    <div className="w-full flex items-center my-2 gap-x-1">
    {Array.from({ length: 3 }, () => []).map((_,_i)=>(
        <div class={`border rounded-md bg-white p-4 max-w-sm w-full ${_i==2 ? 'hide_in_max_md':''}`}>
            <div class="animate-pulse flex space-x-4">
            <div class="rounded-full bg-gray-300 h-10 w-10"></div>
            <div class="flex-1 space-y-6 py-1">
                <div class="h-2 bg-gray-300 rounded"></div>
                <div class="space-y-3">
                <div class="grid grid-cols-3 gap-4">
                    <div class="h-2 bg-gray-300 rounded col-span-2"></div>
                    <div class="h-2 bg-gray-300 rounded col-span-1"></div>
                </div>
                <div class="h-2 bg-gray-300 rounded"></div>
                </div>
            </div>
            </div>
      </div>
    ))}
</div>
  )
}
