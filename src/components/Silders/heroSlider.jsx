// src/FullPageSlider.jsx
import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useData } from '../../contexts/DataContext';
import Img1 from '../../assets/img/banner/1.jpg'
import Img2 from '../../assets/img/banner/2.jpg'
import Img3 from '../../assets/img/banner/3.jpg'
import Img4 from '../../assets/img/banner/4.jpg'



const FullPageSlider = ({activeSlide,setActiveSlide}) => {
  const data=useData()
  const settings = {
    dots: false,
    infinite: true,
    speed: 400,
    fade:true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
    arrows: false,
    cssEase: 'linear',
    beforeChange: (current, next) => setActiveSlide(next),
  };

  let images=[
     Img1,
     Img2,
     Img3,
     Img4
  ]
  return (
    <Slider {...settings}>
      {images.map((i,_i)=>(
        <div  className="h-[120vh] max-md:h-[70vh] home-slider">
            <div  className={`w-full h-full  transition-all duration-[30s] overflow-hidden`}>
                <img
                    src={i}
                    className={`w-full h-full object-cover ${activeSlide==_i ? 'scale-150':''}  transition-all duration-[30s]`}
                />
            </div>
          <div className={`w-full h-full  transition-all duration-[30s]`}></div>
        </div>
      ))}
    </Slider>
  );
};

export default FullPageSlider;
