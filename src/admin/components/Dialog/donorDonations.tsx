import React from 'react'
import DonationCards from '../../../components/Cards/donationsCard'

export default function DonorDonations({show,setShow}) {
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
                   Lista de doações
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
                <div className="mb-2 px-5">
                      <h3 className="text-xl font-semibold mt-2 mb-1">{show?.name}</h3>
                </div>
                 <DonationCards donations={show.donations || []} showOne={true} oneComumn={true}/>
              </div>

              {/* Modal footer */}
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
                <button
                  onClick={()=>setShow(false)}
                  type="button"
                  className="text-white bg-rose-600 hover:bg-rose-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded text-sm px-5 py-2.5 text-center"
                >
                  Fechar
                </button>
               
              </div>
            </div>
          </div>
        </div>
      
    </div>
  )
}
