import i18next, { t } from 'i18next';
import DonationCards from '../Cards/donationsCard';
import { useData } from '../../contexts/DataContext';
import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DonationsDialog({setShow,show}) {

  const data=useData()
  const [selectedCampaign,setSelectedCampaign]=useState({})
  const [raised,setRaised]=useState(0)
  const [loading,setLoading]=useState(false)

  useEffect(()=>{
         setSelectedCampaign(show?.id ? show : {})
         setLoading(!show ? true : loading)

         if(show?.insert_amount_raised_manually){
             setRaised(parseFloat(show?.raised || 0))
         }else{
            setRaised((show?.donations || []).map(item => parseFloat(item.amount || 0)).reduce((acc, curr) => acc + curr, 0))
         }
  },[show])


  useEffect(()=>{

    if(!show?.id){
        return
    }

  
    (async()=>{
      try{

        let response=await data.makeRequest({method:'get',url:`api/campaign/`+show?.id,withToken:true,params:{h_n:"true"}, error: ``},0);
        setSelectedCampaign(response)
        setLoading(false)

      }catch(e){

        console.log({e})

        let msg="Acorreu um erro, tente novamente"

        setLoading(false)

        if(e.response){
          if(e.response.status==409){
            msg="Email já existe"
          } 
          if(e.response.status==404){
              msg="Item não encontrado"
          }
          if(e.response.status==500){
              msg="Erro, inesperado. Contacte seu administrador"
          }

        }else if(e.code=='ERR_NETWORK'){
              msg="Verfique sua internet e tente novamente"
        }

        toast.error(msg)
    }

  })()
 

},[show])


  

  return (
    <div>
          <div
            style={{zIndex:9999}}
            className={`fixed bg-[rgba(0,0,0,0.4)] transition-all ease-in ${!show ? 'translate-y-[100px] pointer-events-none opacity-0':''} top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[100vh] max-h-full overflow-y-auto overflow-x-hidden`}
          >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow-sm">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                 {t('common.donations-list')}
                </h3>
                <button
                  onClick={()=>setShow(false)}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              {/* Modal body */}
              <div className="p-3 md:p-5 space-y-4">
                 <div className={`px-5 ${loading ? 'hidden':''}`}>
                    <div className="mb-2">
                        <h3 className="text-xl font-semibold mt-2 mb-1">{selectedCampaign['title_'+i18next.language]}</h3>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                                    {!show?.insert_amount_raised_manually && <div className="flex items-center text-sm text-gray-600 mt-1">
                                        <label className="font-bold mr-2">{t('menu.donations')}:</label>
                                         {selectedCampaign.donations?.length || 0}
                                    </div>}
                    </div>

                    

                    

                    <div className="">
                            <p className="text-sm font-semibold text-rose-600">
                                {t('common.raised')}:  {data._cn(raised)}MZN
                            </p>
                            {selectedCampaign.goal!=0 && <div className="w-full h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
                                <div
                                className="h-full bg-rose-600 rounded-full"
                                style={{ width: `${(raised / (selectedCampaign.goal || null)) * 100}%` }}
                                ></div>
                            </div>}
                            {selectedCampaign.goal!=0 && <div className="flex justify-end text-sm font-medium text-gray-800 mt-1">
                                {t('common.goal')}  {data._cn(selectedCampaign.goal)}MZN
                            </div>}
                    </div>

                    {show?.insert_amount_raised_manually && <div className="flex items-center justify-center text-[14px] mb-1 mt-7">
                                  <label className="text-gray-400 mr-2">{t('common.some-donations')}</label>
                    </div>}
                   
                 </div>

                  {loading && <div className="w-full relative flex justify-center items-center h-[200px]">
                              <div className=" text-red-500 relative mr-3">
                                  <button><div className="animate-spin"><Loader/></div></button>
                              </div>
                              <div className="translate-y-[-4px]"><span className="text-red-600">{t('common.loading')}...</span></div>
                  </div>}

                 {!loading && <DonationCards donations={selectedCampaign.donations || []} showOne={true} oneComumn={true}/>}
              </div>

              {/* Modal footer */}
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
                <button
                  onClick={()=>setShow(false)}
                  type="button"
                  className="text-white bg-rose-600 hover:bg-rose-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded text-sm px-5 py-2.5 text-center"
                >
                  {t('common.close')}
                </button>
               
              </div>
            </div>
          </div>
        </div>
      
    </div>
  );
}
