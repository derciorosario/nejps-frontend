import React from 'react'

export default function SectionTopContent({title,paragraph}) {
  return (
    <div className="w-full flex justify-center flex-col items-center px-5 py-14">
           <h2 className="text-[29px] max-md:text-[20px] font-bold text-[#232323] uppercase">{title}</h2>
           <div className="w-[50px] h-[2px] bg-rose-600 mx-auto my-5"></div>
           <p className="max-w-[700px] text-center mx-auto text-[#232323] text-[14px]">{paragraph}</p>
    </div>
  )
}
