import React from 'react'
import { useData } from '../../../contexts/DataContext'
import { t } from 'i18next'

function BasicPagination({total,current,last,setCurrentPage,from,show,color,center,goTo}) {
  const data=useData()
  return (
    <nav aria-label="Page navigation example" className={`my-[30px] px-2 delay-100 ease-in transition ${!show ? 'opacity-0 pointer-events-none':''}`}>
      <div className={`flex ${center ? 'justify-center':''} w-full`}>
        <ul className={`inline-flex -space-x-px text-base h-10`}>
          
          <li onClick={()=>{
            if(goTo) goTo()
            setCurrentPage(current-1)
            data.handleLoaded('remove',from)
          }} className={`${current==1 ? 'opacity-40 pointer-events-none':''}`}>
            <a className={`flex cursor-pointer items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-[0.3rem] hover:bg-gray-100 hover:text-gray-700`}>{t('common.previous')}</a>
          </li>

          {Array.from({ length: last || 1 }, () => []).map((_,_i)=>(
              <li onClick={()=>{
                if(_i+1==current){
                  return
                }
                if(goTo) goTo()
                setCurrentPage(_i+1)
                data.handleLoaded('remove',from)
              }}>
                <a className={`flex cursor-pointer items-center justify-center px-4 h-10 leading-tight ${(current || 1)==_i+1 ? `${color ? 'text-rose-500':'text-blue-600'} border border-gray-300 ${color ? 'bg-rose-50 hover:bg-rose-100':'bg-blue-50 hover:bg-blue-100'} ${color ? 'hover:text-rose-500':'hover:text-blue-700'}`:'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'}`}>{_i+1}</a>
              </li>
          ))}
          

          <li className={`${current==last || total==0 ? 'opacity-40 pointer-events-none':''}`}>
            <a onClick={()=>{
               if(goTo) goTo()
              setCurrentPage(current+1)
              data.handleLoaded('remove',from)
            }} className="flex items-center cursor-pointer justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700">{t('common.next')}</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default BasicPagination