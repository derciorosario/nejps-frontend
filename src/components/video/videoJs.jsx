import React, { useRef, useState } from "react";
import DemoVideo from "../../assets/videos/full-demo-video.mp4";

const VideoPlayer = ({show,setShow}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };






  return (
    <div
    style={{ zIndex: 9999 }}
    className={`w-full h-[100vh] flex items-center justify-center fixed ${
      show ? "scale-1" : "scale-[0.8] opacity-0 pointer-events-none"
    } left-0 top-0 transition-all duration-100 bg-black bg-opacity-75`}
  >
    {/* Close Button */}
    <div
      onClick={() => {
        setShow(false);
        try{
          videoRef.current.pause();
        }catch(e){
          console.log(e)
        }
      }}
      className="bg-honolulu_blue-500 cursor-pointer hover:opacity-90 w-[40px] h-[40px] fixed right-3 top-3 z-30 rounded-full flex items-center justify-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#fff"
      >
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
      </svg>
    </div>
  
    {/* Centered Video */}
    <video
      ref={videoRef}
      controls
      preload="auto"
      className="max-w-full max-h-full w-auto h-auto object-contain"
    >
      <source src={DemoVideo} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
  
  );
};

export default VideoPlayer;
