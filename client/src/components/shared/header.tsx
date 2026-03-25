import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GetMazzaLogo from "../../assets/images/GetMazza logo2.png"
import { GoArrowUpRight, GoArrowRight } from "react-icons/go";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setActiveSubDropdown(null);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  const toggleDropdown = (dropdown: string) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
      setActiveSubDropdown(null);
    } else {
      setActiveDropdown(dropdown);
      setActiveSubDropdown(null);
    }
  };

  const toggleSubDropdown = (subDropdown: string) => {
    if (activeSubDropdown === subDropdown) {
      setActiveSubDropdown(null);
    } else {
      setActiveSubDropdown(subDropdown);
    }
  };

  const handleLinkClick = () => {
    setActiveDropdown(null);
    setActiveSubDropdown(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-black/90'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-20 py-4">
        <div className="flex items-center justify-between relative">
          {/* Left Side - Navigation Links (Desktop only) */}
          <div className="hidden lg:flex items-center gap-8">
            <Link 
              to="/our-story" 
              className="font-sans text-white hover:text-bronze transition-colors"
              onClick={() => {
                setActiveDropdown(null);
                setActiveSubDropdown(null);
              }}
            >
              Our Story
            </Link>
            
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => {
                if (!activeSubDropdown) {
                  setActiveDropdown(null);
                }
              }}
            >
              <button 
                className="font-sans text-white hover:text-bronze transition-colors flex items-center"
                onClick={() => toggleDropdown('services')}
                aria-expanded={activeDropdown === 'services'}
              >
                Services
                <svg 
                  className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === 'services' ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'services' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-64 bg-ash rounded-lg shadow-xl z-50 py-2"
                    onMouseLeave={() => {
                      setActiveDropdown(null);
                      setActiveSubDropdown(null);
                    }}
                  >
                    <Link 
                      to="/coming-soon" 
                      className="block px-4 py-2 text-white hover:text-bronze hover:bg-black/20"
                      onClick={() => {
                        setActiveDropdown(null);
                        setActiveSubDropdown(null);
                      }}
                    >
                      Bespoke Event Curation
                    </Link>
                    <div className="relative">
                      <button
                        className="w-full text-left px-4 py-2 text-white/70 hover:text-bronze hover:bg-black/20 flex justify-between items-center"
                        onClick={() => toggleSubDropdown('travel')}
                      >
                        Travel
                        <svg 
                          className={`ml-1 h-4 w-4 transition-transform ${activeSubDropdown === 'travel' ? 'rotate-90' : ''}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      {activeSubDropdown === 'travel' && (
                        <Link to="/coming-soon" onClick={handleLinkClick} className="pl-4 text-sm text-white/70">
                          Coming soon
                        </Link>
                      )}
                    </div>
                    {/* Repeat similar structure for other services */}
                    <div className="relative">
                      <button
                        className="w-full text-left px-4 py-2 text-white/70 hover:text-bronze hover:bg-black/20 flex justify-between items-center"
                        onClick={() => toggleSubDropdown('dining')}
                      >
                        Fine Dining & Nightlife
                        <svg 
                          className={`ml-1 h-4 w-4 transition-transform ${activeSubDropdown === 'dining' ? 'rotate-90' : ''}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      {activeSubDropdown === 'dining' && (
                        <Link to="/coming-soon" onClick={handleLinkClick} className="pl-4 text-sm text-white/70">
                          Coming soon
                        </Link>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        className="w-full text-left px-4 py-2 text-white/70 hover:text-bronze hover:bg-black/20 flex justify-between items-center"
                        onClick={() => toggleSubDropdown('transportation')}
                      >
                        Luxury Transportation
                        <svg 
                          className={`ml-1 h-4 w-4 transition-transform ${activeSubDropdown === 'transportation' ? 'rotate-90' : ''}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      {activeSubDropdown === 'transportation' && (
                        <Link to="/coming-soon" onClick={handleLinkClick} className="pl-4 text-sm text-white/70">
                          Coming soon
                        </Link>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        className="w-full text-left px-4 py-2 text-white/70 hover:text-bronze hover:bg-black/20 flex justify-between items-center"
                        onClick={() => toggleSubDropdown('lifestyle')}
                      >
                        Lifestyle & Wardrobe
                        <svg 
                          className={`ml-1 h-4 w-4 transition-transform ${activeSubDropdown === 'lifestyle' ? 'rotate-90' : ''}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      {activeSubDropdown === 'lifestyle' && (
                        <Link to="/coming-soon" onClick={handleLinkClick} className="pl-4 text-sm text-white/70">
                          Coming soon
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Social Club Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('socialClub')}
              onMouseLeave={() => {
                if (!activeSubDropdown) {
                  setActiveDropdown(null);
                }
              }}
            >
              <button 
                className="font-sans text-white hover:text-bronze transition-colors flex items-center"
                onClick={() => toggleDropdown('socialClub')}
                aria-expanded={activeDropdown === 'socialClub'}
              >
                Social Club
                <svg 
                  className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === 'socialClub' ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'socialClub' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-64 bg-ash rounded-lg shadow-xl z-50 py-2"
                    onMouseLeave={() => {
                      setActiveDropdown(null);
                      setActiveSubDropdown(null);
                    }}
                  >
                    <div className="relative">
                      <button
                        className="w-full text-left px-4 py-2 text-white hover:text-bronze hover:bg-black/20 flex justify-between items-center"
                        onClick={() => toggleSubDropdown('gallery')}
                      >
                        Gallery
                        <svg 
                          className={`ml-1 h-4 w-4 transition-transform ${activeSubDropdown === 'gallery' ? 'rotate-90' : ''}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      {activeSubDropdown === 'gallery' && (
                        <div className="pl-4 text-sm">
                          <Link 
                            to="/coming-soon" 
                            className="block px-4 py-2 text-white hover:text-bronze hover:bg-black/20"
                            onClick={() => {
                              setActiveDropdown(null);
                              setActiveSubDropdown(null);
                            }}
                          >
                            Episode 1: Brunch & Connect
                          </Link>
                          <Link 
                            to="/coming-soon" 
                            className="block px-4 py-2 text-white hover:text-bronze hover:bg-black/20"
                            onClick={() => {
                              setActiveDropdown(null);
                              setActiveSubDropdown(null);
                            }}
                          >
                            Episode 2: The Mazza Ball
                          </Link>
                          <Link 
                            to="/coming-soon" 
                            className="block px-4 py-2 text-white hover:text-bronze hover:bg-black/20"
                            onClick={() => {
                              setActiveDropdown(null);
                              setActiveSubDropdown(null);
                            }}
                          >
                            Episode 3: Coming soon
                          </Link>
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        className="w-full text-left px-4 py-2 text-white hover:text-bronze hover:bg-black/20 flex justify-between items-center"
                        onClick={() => toggleSubDropdown('tickets')}
                      >
                        Get Tickets
                        <svg 
                          className={`ml-1 h-4 w-4 transition-transform ${activeSubDropdown === 'tickets' ? 'rotate-90' : ''}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      {activeSubDropdown === 'tickets' && (
                        <Link to="/coming-soon" className="pl-4 text-sm text-white/70">
                          Coming soon
                        </Link>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        className="w-full text-left px-4 py-2 text-white hover:text-bronze hover:bg-black/20 flex justify-between items-center"
                        onClick={() => toggleSubDropdown('merch')}
                      >
                        Buy Merch
                        <svg 
                          className={`ml-1 h-4 w-4 transition-transform ${activeSubDropdown === 'merch' ? 'rotate-90' : ''}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      {activeSubDropdown === 'merch' && (
                        <Link to="/coming-soon" className="pl-4 text-sm text-white/70">
                          Coming soon
                        </Link>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        className="w-full text-left px-4 py-2 text-white hover:text-bronze hover:bg-black/20 flex justify-between items-center"
                        onClick={() => toggleSubDropdown('podcast')}
                      >
                        Podcast
                        <svg 
                          className={`ml-1 h-4 w-4 transition-transform ${activeSubDropdown === 'podcast' ? 'rotate-90' : ''}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      {activeSubDropdown === 'podcast' && (
                        <Link to="/coming-soon" className="pl-4 text-sm text-white/70">
                          Coming soon
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Logo - Centered on Desktop, Left on Mobile */}
          <Link 
            to="/" 
            className="text-2xl font-display text-bronze lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setActiveDropdown(null);
              setActiveSubDropdown(null);
            }}
          >
           <img src={GetMazzaLogo} className='w-32 md:w-48 mx-auto'/>
          </Link>

          {/* Right Side - Desktop Button / Mobile Menu Button */}
          <div onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} className="flex items-center gap-4 lg:ml-auto">
            <div className="hidden lg:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 font-sans flex items-center justify-between text-white rounded-full transition-all"
                onClick={() => {
                  setActiveDropdown(null);
                  setActiveSubDropdown(null);
                }}
                style={{
                  background: 'linear-gradient(232deg,rgba(184, 115, 51, 1) 17%, rgba(165, 42, 42, 1) 71%)'
                }}
              >
                Become a Member
                {isHover ? <GoArrowRight className="ml-2 text-white" /> : <GoArrowUpRight className="ml-2 text-white" />}
              </motion.button>
            </div>

            {/* Mobile Menu Button - right side */}
            <button
              className="lg:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed left-0 right-0 top-20 bg-black/95 backdrop-blur-md z-50 overflow-hidden"
            >
              <div className="flex flex-col space-y-4 p-6 max-w-[90rem] mx-auto">
                <Link 
                  to="/our-story" 
                  className="font-sans text-white hover:text-bronze"
                  onClick={handleMobileLinkClick}
                >
                  Our Story
                </Link>
                
                {/* Mobile Services Dropdown */}
                <div className="space-y-2">
                  <button 
                    className="font-sans text-white hover:text-bronze flex items-center justify-between w-full"
                    onClick={() => toggleDropdown('mobileServices')}
                  >
                    Services
                    <svg 
                      className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === 'mobileServices' ? 'rotate-180' : ''}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {activeDropdown === 'mobileServices' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pl-4 space-y-2"
                    >
                      <Link 
                        to="/bespoke-events" 
                        className="block font-sans text-white hover:text-bronze"
                        onClick={handleMobileLinkClick}
                      >
                        Bespoke Event Curation
                      </Link>
                      <button 
                        className="w-full text-left font-sans text-white/70 hover:text-bronze flex justify-between items-center"
                        onClick={() => toggleSubDropdown('mobileTravel')}
                      >
                        Travel
                        <svg 
                          className={`ml-1 h-4 w-4 transition-transform ${activeSubDropdown === 'mobileTravel' ? 'rotate-90' : ''}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      {activeSubDropdown === 'mobileTravel' && (
                        <Link to='/coming-soon' className="pl-4 text-sm text-white/70">
                          Coming soon
                        </Link>
                      )}
                      {/* Repeat for other services */}
                    </motion.div>
                  )}
                </div>
                
                {/* Mobile Social Club Dropdown */}
                <div className="space-y-2">
                  <button 
                    className="font-sans text-white hover:text-bronze flex items-center justify-between w-full"
                    onClick={() => toggleDropdown('mobileSocialClub')}
                  >
                    Social Club
                    <svg 
                      className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === 'mobileSocialClub' ? 'rotate-180' : ''}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {activeDropdown === 'mobileSocialClub' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pl-4 space-y-2"
                    >
                      <button 
                        className="w-full text-left font-sans text-white hover:text-bronze flex justify-between items-center"
                        onClick={() => toggleSubDropdown('mobileGallery')}
                      >
                        Gallery
                        <svg 
                          className={`ml-1 h-4 w-4 transition-transform ${activeSubDropdown === 'mobileGallery' ? 'rotate-90' : ''}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      {activeSubDropdown === 'mobileGallery' && (
                        <div className="pl-4 space-y-2">
                          <Link 
                            to="/coming-soon" 
                            className="block text-sm text-white hover:text-bronze"
                            onClick={handleMobileLinkClick}
                          >
                            Episode 1: Brunch & Connect
                          </Link>
                          <Link 
                            to="/coming-soon" 
                            className="block text-sm text-white hover:text-bronze"
                            onClick={handleMobileLinkClick}
                          >
                            Episode 2: The Mazza Ball
                          </Link>
                          <Link 
                            to="/coming-soon" 
                            className="block text-sm text-white hover:text-bronze"
                            onClick={handleMobileLinkClick}
                          >
                            Episode 3: Coming soon
                          </Link>
                        </div>
                      )}
                      {/* Repeat for other social club items */}
                    </motion.div>
                  )}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="font-sans flex items-center justify-between text-white rounded-full py-2 px-4 transition-all"
                  onClick={handleMobileLinkClick}
                  onMouseEnter={() => setIsHover(true)}
                  onMouseLeave={() => setIsHover(false)}
                  style={{
                    background: 'linear-gradient(232deg,rgba(184, 115, 51, 1) 17%, rgba(165, 42, 42, 1) 71%)'
                  }}
                >
                  Become a Member
                  {isHover ? <GoArrowRight className="ml-2 text-white" /> : <GoArrowUpRight className="ml-2 text-white" />}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Header;