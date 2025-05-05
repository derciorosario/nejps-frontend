import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function YouTubeVideoPopUp({link,setLink}) {
  const navigate=useNavigate()
  const getYouTubeID = url => url.includes('youtu.be') ? new URL(url).pathname.slice(1) : new URL(url).searchParams.get('v');
  return (
    <div style={{zIndex:9999999999}} className={`fixed ${link ?'scale-1':'scale-[0.8] opacity-0 pointer-events-none'} bg-black left-0 top-0 transition-all duration-100 w-full h-[100vh]`}>
         <div onClick={()=>setLink(false)} className="bg-red-700 cursor-pointer hover:opacity-90 w-[40px] h-[40px] fixed right-3 top-3 z-30 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
         </div>
         <div className="w-full h-full">
                {link && <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${link ? getYouTubeID(link) : null}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>}
         </div>
    </div>
  )
}
export default YouTubeVideoPopUp