import React from "react";
import { MapPin } from "lucide-react";
import i18next, { t } from "i18next";
import { useData } from "../../contexts/DataContext";


const VolunteerCard = ({ volunteer }) => {

 const data=useData()
  
  return (
    <div className="rounded shadow-md overflow-hidden bg-white">
      <div className="relative">
      <img
        src={data.APP_BASE_URL+"/file/"+volunteer.logo_filename}
        className="w-full h-64 object-cover"
      />
      <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-40 px-2 py-1 rounded-md">
                  {t('common.volunteer-'+volunteer.status)}
            </div>
      </div>
      <div className="p-6 space-y-4">
        <h3 className="text-[18px] font-semibold">{volunteer.name}</h3>
        <div className="flex items-center text-sm text-gray-600 space-x-4">
          <div className="flex items-center space-x-1 flex-1">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span>{volunteer.address}</span>
          </div>
        </div>
        <p className="text-sm text-gray-700 leading-snug">
          {volunteer[`description_`+i18next.language]}
        </p>
      </div>
    </div>
  );
};

export default function VolunteerList({volunteers=[]}) {
  return (
     <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-[1300px] mx-auto">
            {volunteers.map((volunteer, index) => (
               <VolunteerCard key={index} index={index} volunteer={volunteer} />
            ))}
        </div>
     </div>
  );
}
