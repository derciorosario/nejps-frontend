import React from "react";
import Slider from "react-slick";
import {
  ChevronLeft,
  MapPin,
  ChevronRight,
  Calendar
} from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import i18next, { t } from "i18next";
import { useData } from "../../contexts/DataContext";


export default function VolunteersSlider({}) {
    const data=useData()
  
    const hasMultiple = (data._home_volunteers.data || []).length > 1;
    
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

  function calculateAge(birthDate) {
    if(!birthDate){
      return
    }
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }
    return age;
  }
  

  return (
    <div className="font-sans py-10 px-5">
      <div className="max-w-6xl mx-auto relative md:px-5  overflow-hidden">
        <Slider {...settings}>
          {(data._home_volunteers.data  || []).map((profile, index) => {
              return (
                (
                  <div
                  key={index}
                  className="w-full"
               >
                  <div  className="min-w-full border grid grid-cols-1 md:grid-cols-2 bg-white shadow overflow-hidden">
      
                  <div className="relative bg-gray-300 bg-opacity-45">

                    <img src={data.APP_BASE_URL+"/file/"+profile.logo_filename}
                    alt=""
                   className="w-full h-full object-cover"/>
                    
                  </div>
                  <div className="p-8">
                        <p className="text-rose-600 font-semibold uppercase text-sm mb-1">
                           {profile.name}
                        </p>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                          {profile[`role_`+i18next.language]}
                        </h2>
                        <div className="text-sm flex flex-col text-gray-600 mb-2">
                          <div className="flex justify-between border-b py-2 hidden">
                              <span>{t('common.date-of-birth')}</span>
                              <span className="flex items-center gap-1">
                               <Calendar size={16}/>
                               {calculateAge(profile.date_of_birth)}
                           </span>
                          </div>

                          <div className="flex justify-between py-2">
                              <span>{t('common._location')}</span>
                              <span className="flex items-center gap-1">
                                 <MapPin size={16}/> {profile.address}
                              </span>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4">{profile[`description_`+i18next.language]}</p>
                        <div className="flex items-center gap-x-2"></div>  
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
