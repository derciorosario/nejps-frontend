import React from "react";
import Slider from "react-slick";
import {
  Facebook,
  Twitter,
  Dribbble,
  Instagram,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const profiles = [
  {
    name: "Dunald Minia",
    role: "The Organizer",
    dob: "12 Jan, 1995",
    location: "California, USA",
    description:
      "Contented attending smallness it oh ye unwilling. Turned favour man two but lovers. Suffer should if waited common person little oh. Improved civility graceful sex few smallest screened settling. Likely active her warmly has",
    image: "/organizer.jpg",
  },
  {
    name: "Dunald Minia",
    role: "The Organizer",
    dob: "12 Jan, 1995",
    location: "California, USA",
    description:
      "Contented attending smallness it oh ye unwilling. Turned favour man two but lovers. Suffer should if waited common person little oh. Improved civility graceful sex few smallest screened settling. Likely active her warmly has",
    image: "/organizer.jpg",
  }
 
];

export default function CharityLandingPage() {
  const settings = {
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    swipe: true,
    nextArrow: (
      <div className="absolute bg-red-400 -right-2 top-1/2 transform -translate-y-1/2 z-10">
       <ChevronRight className="text-rose-400" />
      </div>
    ),
    prevArrow: (
      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 z-10">
         <ChevronLeft className="text-rose-400" />
      </div>
    ),
  };

  return (
    <div className="font-sans bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto relative px-5">
        <Slider {...settings}>
          {profiles.map((profile, index) => (
            <div
            key={index}
            className="w-full"
         >
            <div  className="min-w-full grid grid-cols-1 md:grid-cols-2 bg-white shadow rounded-lg overflow-hidden"
         >

            <div className="w-[50%]">
               <img
              src={profile.image}
              alt="Organizer"
              className="w-full h-full object-cover"
            />
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
              <p className="text-rose-600 font-semibold uppercase text-sm mb-4">{profile.role}</p>
              <div className="mb-2">
                <span className="font-semibold">Date of birth:</span>
                <span className="float-right">{profile.dob}</span>
              </div>
              <div className="mb-4">
                <span className="font-semibold">Location:</span>
                <span className="float-right">{profile.location}</span>
              </div>
              <p className="text-gray-700 mb-6">{profile.description}</p>
              <div className="flex space-x-4">
                <a href="#" className="bg-rose-500 text-white p-3 rounded-full hover:bg-rose-600">
                  <Facebook size={16} />
                </a>
                <a href="#" className="bg-rose-500 text-white p-3 rounded-full hover:bg-rose-600">
                  <Twitter size={16} />
                </a>
                <a href="#" className="bg-rose-500 text-white p-3 rounded-full hover:bg-rose-600">
                  <Dribbble size={16} />
                </a>
                <a href="#" className="bg-rose-500 text-white p-3 rounded-full hover:bg-rose-600">
                  <Instagram size={16} />
                </a>
              </div>
            </div>

            </div>
         
          </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
