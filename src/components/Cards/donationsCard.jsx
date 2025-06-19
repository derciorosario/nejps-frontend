import React from "react";
import { Download ,Clock,User} from "lucide-react";
import i18next, { t } from "i18next";
import { useData } from "../../contexts/DataContext";

import Emola from '../../assets/emola.png'
import Mkesh from '../../assets/mkesh.png'
import Mpesa from '../../assets/mpesa.png'
import CreditCard from '../../assets/card.png'
import Cash from '../../assets/cash.jpg'
import Bim from '../../assets/bim.png'



function donationSkeleton(){
   return (
    Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="bg-white rounded shadow-lg overflow-hidden flex flex-col animate-pulse">
        <div className="px-6 py-6 flex flex-col flex-1 w-full">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>

          {!showOne && <div className="h-5 bg-gray-300 rounded w-3/4 mt-4"></div>}

          <div className="flex justify-between mt-4">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          </div>

          <div className="flex justify-between mt-4">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    ))
   )
}

export default function DonationCards({oneComumn,showOne,donations=[],loading}) {

  const data=useData()

  return (
     <div className="flex">
     
       <div className={`grid grid-cols-1 ${donations.length == 1 && !oneComumn ? ' ': !oneComumn ? 'md:grid-cols-2':''} w-full  gap-6 ${showOne ? 'p-4':'p-6'} ${donations.length == 1 && !oneComumn ? 'max-w-[700px]':''}  mx-auto`}>
        
        {donations.map((donation, index) => (
          <div
            key={index}
            className="bg-white rounded shadow-lg  overflow-hidden flex flex-col"
          >
           <div className="px-6 py-6  flex flex-col flex-1 w-full">
           
          <div className="flex justify-between">
                <div className="flex items-baseline text-rose-600 font-bold text-lg">
                 <span>{donation.date.split('T')[0]?.split('-')?.reverse()?.join('/')}</span>
                 <span className="ml-2 text-black text-sm font-medium">{donation.year}</span>
                </div>
                {donation.time && <div className="flex items-center text-sm text-gray-600 mt-1">
                 <Clock className="w-4 h-4 mr-1" />
                   {donation.time?.slice(0,5)}
                </div>}
          </div>
            
          {!showOne && <h3 className="text-xl font-semibold mt-2 mb-1">{donation['title_'+i18next.language]}</h3>}
            
            <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600 mt-1">
                    <label className="font-bold mr-1">{t('common.amount')}:</label>
                    {data._cn(donation.amount)} MZN
                </div>
                <div className="text-gray-600 text-sm flex items-center">
                    <label className="font-bold mr-1">Via:</label><label className="flex items-center"> 
                    {
                      donation.payment_method === "cash" ? "Em numerário" :
                      donation.payment_method === "mpesa" ? "M-pesa" :
                      donation.payment_method === "emola" ? "E-mola" :
                      donation.payment_method === "mkesh" ? "M-Kesh" :
                      donation.payment_method === "creditcard" ? "Cartão bancário" :
                      donation.payment_method === "bci" ? "BCI" :
                      donation.payment_method === "fnb" ? "FNB" :
                      donation.payment_method === "standardbank" ? "Standard Bank" :
                      donation.payment_method === "bim" ? "Millennium BIM" :
                      donation.payment_method === "letshego" ? "Letshego" :
                      donation.payment_method === "socremo" ? "Socremo" :
                      donation.payment_method === "moza" ? "Moza Banco" :
                      donation.payment_method === "accessbank" ? "Access Bank" :
                      donation.payment_method === "ecobank" ? "Ecobank" :
                      "Desconhecido"
                    }
                    <img className="ml-1 rounded" width={25} src={donation.payment_method=="bim" ? Bim : donation.payment_method=="cash" ? Cash : donation.payment_method=="mpesa" ? Mpesa : donation.payment_method=="emola" ? Emola : donation.payment_method=="mkesh" ? Mkesh :  CreditCard}/></label>
                </div>

            </div>
            
            <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600 mt-5">
                   
                    {donation.donor && <User className="w-4 h-4 mr-1" />}
                    {!donation.donor && <User className="w-4 h-4 mr-1" />}
                    {t('common.by')}:
                   
                    <label className="ml-1">{donation?.donor ? donation?.donor?.name : t('common.anonymous')}</label>

                </div>
                {donation.proof && <div className="flex items-center text-sm text-gray-600 mt-1">
                        <div onClick={()=>{
                             window.open(`${data.APP_BASE_URL}/file/${donation.proof}`, '_blank')
                        }} className="bg-rose-100 text-rose-600 mt-4 cursor-pointer px-1 py-1 rounded items-center inline-flex">
                                <Download className="w-4 h-4 mr-1" /> <span className="max-md:hidden">{t('common.proof')}</span>
                        </div>
                </div>}
            </div>
            {/** <p className="text-gray-700 text-sm mt-4 flex-1">{donation['description_'+i18next.language]}</p>
           */}
          </div>
        </div>
      ))}
    </div>
     </div>
  );
}
