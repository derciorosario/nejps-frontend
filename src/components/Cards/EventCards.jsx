import React, { useState } from "react";
import { MapPin, Clock } from "lucide-react";
import i18next, { t } from "i18next";

import { useData } from "../../contexts/DataContext";

export default function EventCards({events=[]}) {
  const [openItems,setOpenItems]=useState([])
  const data=useData()

  return (
     <div className="flex">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-[1300px] mx-auto">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-white rounded shadow-lg overflow-hidden flex flex-col"
          >
          <img src={data.APP_BASE_URL+"/file/"+event.image_filename} alt={event['title_'+i18next.language]} className="w-full h-64 object-cover" />
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-baseline text-rose-600 font-bold text-lg">
              <span>{event.date.split('T')[0]?.split('-')?.reverse()?.join('/')}</span>
              <span className="ml-2 text-black text-sm font-medium">{event.year}</span>
            </div>
            <h3 className="text-xl font-semibold mt-2 mb-1">{event['title_'+i18next.language]}</h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {event.location}
            </div>
            {event.start_time && <div className="flex items-center text-sm text-gray-600 mt-1">
              <Clock className="w-4 h-4 mr-1" />
              {event.start_time?.slice(0,5)} {event.end_time ? ` - ${event.end_time?.slice(0,5)}`:''}
            </div>}
            <p className="text-gray-700 text-sm mt-4 flex-1">{data.text_l(event['description_'+i18next.language], openItems.includes(event.id) ? 1000000 : 200)}</p>
             {event['description_'+i18next.language]?.length >= 200 &&  <button onClick={()=>{
                if(openItems.includes(event.id)){
                  setOpenItems(openItems.filter(f=>f!=event.id))
                }else{
                  setOpenItems([...openItems,event.id])
                }
            }} className="mt-6 bg-rose-600 flex items-center text-white px-4 py-2 rounded hover:bg-rose-700 text-sm font-semibold self-start">
                  {!openItems.includes(event.id) && t('common.see-more')}
                  {openItems.includes(event.id) && t('common.see-less')}
                  <span className="ml-2"><svg className={`${openItems.includes(event.id) ? 'rotate-180':''}`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="m480-340 180-180-57-56-123 123-123-123-57 56 180 180Zm0 260q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></span>
            </button>}
          </div>
        </div>
      ))}
    </div>
     </div>
  );
}
