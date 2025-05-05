import { t } from 'i18next'
import { Loader } from 'lucide-react'
import React from 'react'

export default function ItemsLoader() {
  return (
    <div className="w-full h-[100px] flex items-center justify-center">
            <div className={`shadow flex items-center px-2 py-1 rounded-full`}>
                <div className=" text-red-500 relative mr-3 flex items-center justify-center h-[35px]">
                    <button><div className="animate-spin"><Loader/></div></button>
                </div>
                <div><span className="text-red-600">{t('common.loading')}...</span></div>
            </div>
    </div>
  )
}
