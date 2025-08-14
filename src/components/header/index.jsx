import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useData } from '../../contexts/DataContext'
import { useTranslation } from 'react-i18next';
import i18next from 'i18next'
import { Mail, Phone, MapPin, X } from "lucide-react";

function Header({}) {
     
  const { pathname } = useLocation();
  const data = useData();
  const [menu, setMenu] = useState([]);
  const navigate = useNavigate();
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'pt');
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLang(lng);
    localStorage.setItem('lang', lng);
  };

  useEffect(() => {
    setMenu([
      { name: t('menu.home'), path: '/', field: 'home' },
      { name: t('menu.about-us'), path: '/?about', field: 'about' },
      { name: t('menu.campaigns'), path: '/campaigns', field: 'campaigns' },
     // { name: t('menu.donations'), path: '/donations', field: 'donations' },
      { name: t('menu.daily-audios'), path: '/audios', field: 'campaigns' },
      { name: t('menu.homilies'), path: '/homilies', field: 'campaigns' },
      { name: t('menu.contact'), path: '/contact', field: 'contact' },
    ]);
  }, [i18next.language]);

  function goto() {
    if (window.location.href.includes('/?about')) {
      data._scrollToSection('about');
    } else if (window.location.href.includes('/?contact')) {
      data._scrollToSection('contact');
    } else if (pathname === "/" || window.location.href.includes('/?home')) {
      data._scrollToSection('home');
    }
  }

  useEffect(() => {
    goto();
  }, []);


  return (
    <>
      <div id="home">
        <header id="header" className="w-full ease-in z-50 relative">
          {/* Top Bar */}
          <div className="bg-black text-white text-sm py-2 px-4 flex justify-between items-center w-full max-md:hidden">
            <div className="flex items-center space-x-6">
              {data._settings?.address && <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{data._settings?.address}</span>
              </div>}
              {data._settings?.email && <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>{data._settings?.email}</span>
              </div>}
              {data._settings?.contact && <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>{data._settings?.contact}</span>
              </div>}
            </div>

            <select
              onChange={(e) => changeLanguage(e.target.value)}
              value={lang}
              className="mr-2 cursor-pointer border-0 outline-none text-black bg-white rounded-sm"
            >
              <option value={'pt'} disabled={lang === "pt"}>PT</option>
              <option value={'en'} disabled={lang === "en"}>EN</option>
            </select>
          </div>

          {/* Navbar */}
          <div className={`flex ${data.scrollY > 35 ? 'fixed top-0' : 'md:absolute md:top-[100%]'} max-md:fixed top-0 left-0 w-full items-center justify-between px-6 py-4 bg-white shadow`}>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => {
              navigate('/');
              goto();
            }}>
              <div className="text-rose-600 text-2xl font-bold">❤️</div>
              <div className="mr-2">
                <div className="text-lg font-bold">Amar é Servir</div>
                <div className="text-xs text-rose-600">{t('common.slogan')}</div>
              </div>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex space-x-6 font-medium">
              {menu.map((i, _i) => (
                <a
                  key={_i}
                  onClick={() => {
                    navigate(i.path);
                    goto();
                  }}
                  className="hover:text-rose-600 cursor-pointer"
                >
                  {i.name}
                </a>
              ))}
            </nav>

            <div className="flex md:hidden items-center gap-x-2">

            <select
              onChange={(e) => changeLanguage(e.target.value)}
              value={lang}
              className="mr-2 cursor-pointer border-0 outline-none text-black bg-white rounded-sm"
            >
              <option value={'pt'} disabled={lang === "pt"}>PT</option>
              <option value={'en'} disabled={lang === "en"}>EN</option>
            </select>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={28} /> : <span className="text-2xl">☰</span>}
              </button>
            </div>

            </div>

           
          </div>

          {/* Animated Mobile Menu */}
          <div
            className={`fixed top-[70px] md:hidden left-0 w-full bg-white shadow-md rounded-b-lg overflow-hidden
            transform transition-all duration-300 ease-in-out z-40
            ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5 pointer-events-none"}`}
          >
            <ul className="flex flex-col">
              {menu.map((i, _i) => (
                <li
                  key={_i}
                  onClick={() => {
                    navigate(i.path);
                    setIsMobileMenuOpen(false);
                    goto();
                  }}
                  className="px-6 py-4 text-lg font-semibold border-b border-gray-200 hover:bg-rose-100 cursor-pointer"
                >
                  {i.name}
                </li>
              ))}
            </ul>
          </div>
        </header>
      </div>
    </>
  )
}

export default Header;
