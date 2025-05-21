import { t } from 'i18next';
import { useData } from '../../contexts/DataContext';
import Emola from '../../assets/emola.png'
import Mkesh from '../../assets/mkesh.png'
import Mpesa from '../../assets/mpesa.png'
import CreditCard from '../../assets/card.png'
import Cash from '../../assets/cash.jpg'
import Bim from '../../assets/bim.png'

export default function HowToDonateDialog({setShow,show}) {
  const data=useData()
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
                 {t('common.how-to-contribute')}
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
              <div className="p-4 md:p-5">
                   <div className="pl-3 border-l-[4px] border-l-rose-600">
                      <h3 className="text-[18px] font-semibold">{t('common.donation-title')}</h3>
                      <p className="text-[14px] text-gray-600 mt-1">{t('common.donation-text')}</p>
                   </div>

                   <div className="flex flex-col gap-x-2 mb-10 mt-5">
                       {(data._payment_methods.data || []).map(i=>(
                          <a className="cursor-pointer py-2 flex items-center w-full border-b">
                            <img className="ml-1 rounded-[0.4rem] mr-2" width={40} src={i.type=="bim" ? Bim : i.type=="cash" ? Cash : i.type=="mpesa" ? Mpesa : i.type=="emola" ? Emola : i.type=="mkesh" ? Mkesh :  CreditCard}/>
                            <div className="flex flex-col ml-1">
                              <label className="leading-none">{
                                      i.type === "cash" ? "Em numerário" :
                                      i.type === "mpesa" ? "M-pesa" :
                                      i.type === "emola" ? "E-mola" :
                                      i.type === "mkesh" ? "M-Kesh" :
                                      i.type === "creditcard" ? "Cartão bancário" :
                                      i.type === "bci" ? "BCI" :
                                      i.type === "fnb" ? "FNB" :
                                      i.type === "standardbank" ? "Standard Bank" :
                                      i.type === "bim" ? "Millennium BIM" :
                                      i.type === "letshego" ? "Letshego" :
                                      i.type === "socremo" ? "Socremo" :
                                      i.type === "moza" ? "Moza Banco" :
                                      i.type === "accessbank" ? "Access Bank" :
                                      i.type === "ecobank" ? "Ecobank" :
                                      "Desconhecido"
                                    }
                                    </label>
                              <div className="flex flex-wrap max-lg:flex-col">
                              <span className="text-[13px] text-gray-600 cursor-pointer">{i.number}</span> 
                              {(i.nib && !(i.type=="mpesa" || i.type=="mkesh" || i.type=="emola" || i.type=="cash")) && <span className="text-[13px] text-gray-600 cursor-pointer"><label className="mx-2 max-lg:hidden">|</label>NIB:{i.nib}</span> }
                              </div>
                            </div>
                          </a>
                       ))}
                   </div>
                 
                   <div className="flex flex-wrap justify-around gap-x-2 px-2">
                       {data._settings?.whatsapp_contact && <a className="cursor-pointer py-2 flex items-center" onClick={()=>{
                           window.open('https://wa.me/258823751030','_blank')
                       }}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="fill-[#25D366]" width="46" height="25" viewBox="0 0 24 24" fill="#fff"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488L3 21.116l4.759-1.249a8.981 8.981 0 0 0 4.29 1.093h.004c4.947 0 8.975-4.027 8.977-8.977a8.926 8.926 0 0 0-2.627-6.35m-6.35 13.812h-.003a7.446 7.446 0 0 1-3.798-1.041l-.272-.162-2.824.741.753-2.753-.177-.282a7.448 7.448 0 0 1-1.141-3.971c.002-4.114 3.349-7.461 7.465-7.461a7.413 7.413 0 0 1 5.275 2.188 7.42 7.42 0 0 1 2.183 5.279c-.002 4.114-3.349 7.462-7.461 7.462m4.093-5.589c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112s-.58.729-.711.879-.262.168-.486.056-.947-.349-1.804-1.113c-.667-.595-1.117-1.329-1.248-1.554s-.014-.346.099-.458c.101-.1.224-.262.336-.393.112-.131.149-.224.224-.374s.038-.281-.019-.393c-.056-.113-.505-1.217-.692-1.666-.181-.435-.366-.377-.504-.383a9.65 9.65 0 0 0-.429-.008.826.826 0 0 0-.599.28c-.206.225-.785.767-.785 1.871s.804 2.171.916 2.321c.112.15 1.582 2.415 3.832 3.387.536.231.954.369 1.279.473.537.171 1.026.146 1.413.089.431-.064 1.327-.542 1.514-1.066.187-.524.187-.973.131-1.067-.056-.094-.207-.151-.43-.263"/></svg> 
                           <div className="flex flex-col ml-1">
                              <label className="leading-none relative -translate-x-2 cursor-pointer  break-all text-center">{data._settings?.whatsapp_contact}</label>
                              <span className="text-[13px] text-gray-600 cursor-pointer hidden">{t('common.talk-to-us')}</span>
                          </div>
                       </a>}
                       {data._settings?.contact && <a href="tel:258823751030" className=" py-2 cursor-pointer flex items-center">
                           <svg xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 -960 960 960" className="fill-rose-600"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z"/></svg>
                           <div className="flex flex-col ml-1">
                              <label className="leading-none cursor-pointer  break-all text-center">{data._settings?.contact}</label>
                              <span className="text-[13px] text-gray-600 cursor-pointer hidden">{t('common.call-us')}</span>
                          </div>
                       </a>}
                       {data._settings?.email && <a href="mailto:info@gmail.com" className=" py-2 cursor-pointer flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" height="25px" className="fill-rose-600" viewBox="0 -960 960 960"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>
                           <div className="flex flex-col ml-1">
                              <label className="leading-none cursor-pointer break-all text-center">{data._settings?.email}asdadasdasdasdasdasd</label>
                              <span className="text-[13px] text-gray-600 cursor-pointer hidden">{t('common.send-email')}</span>
                          </div>
                       </a>}
                   </div>
              </div>

              {/* Modal footer */}
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
                <button
                  onClick={()=>setShow(false)}
                  type="button"
                  className="text-white bg-rose-700 hover:bg-rose-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded text-sm px-5 py-2.5 text-center"
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
