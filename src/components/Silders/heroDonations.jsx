import React from "react";
import Slider from "react-slick";
import {
  ChevronLeft,
  MapPin,
  ChevronRight,
  Calendar,
  Play,
  ArrowRight
} from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import i18next, { t } from "i18next";
import { useData } from "../../contexts/DataContext";
import { useNavigate } from "react-router-dom";

export default function HeroDonations({YouTubeVideoLink,setYouTubeVideoLink,showDonationDialog,setShowDonationDialog,showHowToDonateDialog, setShowHowToDonateDialog}) {
  
  const data=useData()
  const hasMultiple = (data._home_campaigns.data || []).length > 1;
  const navigate=useNavigate()
  

  const settings = {
    infinite: hasMultiple,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    swipe: true,
    nextArrow: (
      <div className={`absolute bg-red-400 -right-2 top-1/2 transform -translate-y-1/2 z-10 max-md:hidden`}>
       <span className={` ${!hasMultiple ? '_hidden':''}`}><ChevronRight className="text-rose-400"/></span>
      </div>
    ),
    prevArrow: (
      <div className={`absolute -left-2 top-1/2 transform -translate-y-1/2 z-10 max-md:hidden`}>
        <span className={` ${!hasMultiple ? '_hidden':''}`}><ChevronLeft className="text-rose-400" /></span> 
      </div>
    ),
  };

  
  return (
    <div className="font-sans py-10">
      <div className="max-w-6xl mx-auto relative md:px-5  overflow-hidden">
        <Slider {...settings}>
          {((data._home_campaigns.data || []).filter((_,_i)=>_i <= 2)).map((profile, index) => {
              let raised=profile.donations.map(item => parseFloat(item.amount || 0)).reduce((acc, curr) => acc + curr, 0)
              if(profile.insert_amount_raised_manually){
                 raised=parseFloat(profile.raised || 0)
              }
              return (
                (
                  <div
                    key={index}
                    className="w-full"
                  >

                  <div  className="min-w-full grid grid-cols-1 md:grid-cols-2 bg-white shadow overflow-hidden">
      
                  <div className="relative md:min-h-[350px] bg-gray-300">
                  <img
                    src={data.APP_BASE_URL+"/file/"+profile.image_filename}
                    alt=""
                    className={`w-full cursor-pointer ${!profile.youtube_link ? 'hover:scale-105':''} h-full max-md:h-auto object-cover ${!profile.image_filename ? 'opacity-0':''}`}
                  />

                   <div onClick={()=>{
                       if(!profile.youtube_link){
                          data.setSelectedCampaign(profile);
                          navigate('/campaign/' + profile.id);

                       }
                   }} className="absolute w-full inset-0 flex items-center justify-center">
                          {profile.youtube_link && <div  onClick={()=>setYouTubeVideoLink(profile.youtube_link)} className="bg-rose-600 cursor-pointer w-16 h-16 rounded-full flex items-center justify-center text-white">
                            <Play size={28} />
                          </div>}
                   </div>
                   <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-40 px-2 py-1 rounded">
                                      {t('common.campaign-'+profile.status)}
                   </div>
                  </div>
                  <div className="p-8">
                        <p className="text-rose-600 font-semibold uppercase text-sm mb-1">
                           {t('common.recent-campaigns')}
                        </p>
                        <h2 className="text-2xl font-bold text-gray-80-2">
                          {profile[`title_`+i18next.language]}
                        </h2>
                        <div className="text-sm flex flex-col text-gray-600 mb-2">
                          <div className="flex justify-between border-b py-2">
                              <span>{t('common.date')}</span>
                              <span className="flex items-center gap-1">
                               <Calendar size={16}/>
                               {profile.date.split('T')[0]?.split('-')?.reverse()?.join('/')}
                             { /*{profile.daysLeft < 0  ? -(profile.daysLeft) : profile.daysLeft} {profile.daysLeft == 0 ? "Hoje" : profile.daysLeft <= 1 ? `${i18next.language=="pt" ? 'Dias':'Days'}`: `${i18next.language=="pt" ? 'Dias atrás':'Days ago'}`}*/}
                              </span>
                          </div>
                          <div className="flex justify-between py-2">
                              <span>{t('common.location-target')}</span>
                              <span className="flex items-center gap-1">
                                 <MapPin size={16} /> {profile.location}
                              </span>
                          </div>
                        </div>

                        {profile[`goal_`+i18next.language] && <p className="text-gray-700 mb-2"><span className="font-medium text-[15px] text-gray-800 mr-2">{t('common.aim')}:</span>{profile[`goal_`+i18next.language]}</p>}
                         <button
                                  onClick={() => {
                                    data.setSelectedCampaign(profile);
                                    navigate('/campaign/' + profile.id);
                                  }}
                                  className="text-rose-600 flex items-center mb-4 underline hover:text-rose-700 text-sm font-medium"
                                >
                                  {t("common.read-more")} <ChevronRight size={17}/>
                                </button>
                                
                        {/**<p className="text-gray-700 mb-4 text-justify">{profile[`description_`+i18next.language]}</p> */}
                        <div className={`flex justify-between text-sm mb-1 ${profile.goal==0 ? 'mb-4':''}`}>
                          <span className="text-rose-600 font-semibold">
                            {t('common.raised')} {data._cn(raised)}MZN
                          </span>
                          {profile.goal!=0 && <span className="font-bold text-gray-800">
                            {t('common.goal')} {data._cn(profile.goal)}MZN
                          </span>}
                          
                        </div>
                        {profile.goal!=0 && <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                          <div
                            className="h-full bg-rose-500"
                            style={{ width: `${(raised / (profile.goal || null)) * 100}%` }}
                          ></div>
                        </div>}
                        <div className="flex items-center gap-x-2">
                            <button onClick={()=>{
                              setShowHowToDonateDialog(true)
                          }} className="bg-rose-600 text-white px-6 py-3 rounded shadow hover:bg-rose-700">
                              {t('common.donate')}
                          </button>
                         {(profile.donations.length!=0) && <button onClick={()=>{
                             setShowDonationDialog(profile)                                 
                          }} className="text-rose-600 border border-rose-600 hover:bg-rose-700 hover:text-white bg-white text-sm rounded px-4 py-3">
                            {t('common.see-donations')}
                          </button>}
                              
                        </div>  
                                {profile.report_link && <div onClick={()=>{
                                  window.open(`${data.APP_BASE_URL}/file/${profile.report_link}`, '_blank')
                                }} className="bg-rose-100 text-rose-600 mt-4 cursor-pointer px-1 py-1 rounded items-center inline-flex">
                                                        <svg className="fill-rose-600 mr-2" height="18px" width="18px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                                                          viewBox="0 0 370.32 370.32" xml:space="preserve">
                                                        <g>
                                                        <path  d="M148.879,85.993H95.135c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15h53.744
                                                          c8.284,0,15-6.716,15-15C163.879,92.709,157.163,85.993,148.879,85.993z"/>
                                                        <path  d="M148.879,148.327H95.135c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15h53.744
                                                          c8.284,0,15-6.716,15-15C163.879,155.043,157.163,148.327,148.879,148.327z"/>
                                                        <path  d="M211.944,253.354v14.608h7.717c9.359,0,9.359-5.599,9.359-7.439c0-1.775,0-7.17-9.359-7.17H211.944z
                                                          "/>
                                                        <path  d="M325.879,225.752h-24.41V73.703c0-3.934-1.56-7.705-4.344-10.484l-58.876-58.88
                                                          C235.465,1.561,231.699,0,227.765,0H50.58C34.527,0,21.469,13.059,21.469,29.112v312.095c0,16.054,13.059,29.113,29.111,29.113
                                                          h221.777c16.052,0,29.111-13.06,29.111-29.113v-30.048h24.41c12.687,0,22.973-10.285,22.973-22.973v-39.462
                                                          C348.852,236.038,338.566,225.752,325.879,225.752z M269.855,337.906H53.082V32.414H207.17V75.99
                                                          c0,10.555,8.554,19.107,19.105,19.107h43.58v130.655h-74.178c-12.688,0-22.973,10.286-22.973,22.973v39.462
                                                          c0,12.688,10.285,22.973,22.973,22.973h74.178V337.906z M238.51,260.523c0,10.441-7.224,16.928-18.85,16.928h-7.717v8.977
                                                          c0,2.316-1.877,4.197-4.195,4.197h-1.097c-2.319,0-4.197-1.881-4.197-4.197v-38.366c0-2.316,1.878-4.197,4.197-4.197h13.009
                                                          C231.287,243.864,238.51,250.246,238.51,260.523z M262.305,290.625H247.21c-2.319,0-4.197-1.881-4.197-4.197v-38.366
                                                          c0-2.316,1.877-4.197,4.197-4.197h15.095c13.148,0,23.845,10.5,23.845,23.409C286.15,280.15,275.454,290.625,262.305,290.625z
                                                          M322.455,249.156c0,2.32-1.878,4.197-4.197,4.197h-17.045v10.053h14.521c2.317,0,4.197,1.875,4.197,4.195v1.099
                                                          c0,2.316-1.88,4.197-4.197,4.197h-14.521v13.53c0,2.316-1.877,4.197-4.196,4.197h-1.096c-2.32,0-4.197-1.881-4.197-4.197v-38.366
                                                          c0-2.316,1.877-4.197,4.197-4.197h22.337c2.319,0,4.197,1.881,4.197,4.197V249.156z"/>
                                                        <path  d="M262.305,253.354h-9.803v27.782h9.803c7.915,0,14.355-6.222,14.355-13.862
                                                          C276.661,259.598,270.221,253.354,262.305,253.354z"/>
                                                      </g>
                                                      </svg>
                                                       <span>{t('common.download-campaign-report')}</span>
                                </div>}                              
                      </div>
      
                  </div>
               
                </div>
                )
              )
          })}
        </Slider>
      </div>
    </div>
  );
}
