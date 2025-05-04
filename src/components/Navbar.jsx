import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = ({ onAddAnimeClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Collection', href: '#collection', pageId: 'collection' },
    { name: 'Tier Ranking', href: '#ranking', pageId: 'ranking' }
  ];

  // Animation for the logo
  const logoVariants = {
    hover: {
      textShadow: "0px 0px 8px rgb(236, 72, 153)",
      transition: {
        duration: 0.3
      }
    }
  };

  const handleAddAnimeClick = (e) => {
    e.preventDefault();
    if (onAddAnimeClick) {
      onAddAnimeClick();
    }
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const handleNavLinkClick = (e, pageId) => {
    e.preventDefault();
    
    // Find the Navigation component and trigger page change
    const navButtons = document.querySelectorAll('[data-page-id]');
    
    navButtons.forEach(button => {
      if (button.dataset.pageId === pageId) {
        button.click();
      }
    });
    
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? theme === 'dark' 
              ? 'bg-gray-900/90 backdrop-blur-sm py-2 shadow-lg shadow-black/10' 
              : 'bg-white/90 backdrop-blur-sm py-2 shadow-lg shadow-gray-200/50' 
          : theme === 'dark'
              ? 'bg-gradient-to-r from-indigo-950/90 to-purple-950/90 backdrop-blur-sm py-4'
              : 'bg-gradient-to-r from-indigo-50/90 to-purple-50/90 backdrop-blur-sm py-4 shadow-md'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo Section */}
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          variants={logoVariants}
          whileHover="hover"
        >
          <span className="text-3xl japanese-text bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text">
            アニメ
          </span>
          <h1 className="text-xl md:text-2xl font-bold anime-title bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 text-transparent bg-clip-text tracking-wide">
            Anime Watchlist
          </h1>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.href}
              className={`nav-link ${theme === 'dark' ? 'text-white/90 hover:text-pink-300' : 'text-indigo-900 hover:text-pink-600'} transition-colors duration-300 text-sm font-medium`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={(e) => handleNavLinkClick(e, link.pageId)}
            >
              {link.name}
            </motion.a>
          ))}
          
          {/* Theme Toggle Button */}
          <motion.button
            onClick={toggleTheme}
            className={`${theme === 'dark' ? 'text-white/90 hover:text-pink-300' : 'text-indigo-900 hover:text-pink-600'} transition-colors duration-300`}
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </motion.button>
          
          <motion.button
            onClick={handleAddAnimeClick}
            className="ml-4 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-glow animated-bg-button flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Anime
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-3">
          {/* Theme Toggle Button (Mobile) */}
          <motion.button
            onClick={toggleTheme}
            className={`${theme === 'dark' ? 'text-white/90 hover:text-pink-300' : 'text-indigo-900 hover:text-pink-600'} transition-colors duration-300`}
            whileTap={{ scale: 0.9 }}
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </motion.button>
          
          <motion.button
            className={`${theme === 'dark' ? 'text-white' : 'text-indigo-900'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className={`md:hidden ${theme === 'dark' ? 'bg-gray-900/90 backdrop-blur-sm' : 'glass-effect'}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  className="nav-link text-white/90 hover:text-pink-300 transition-colors duration-300 text-lg font-medium block py-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={(e) => handleNavLinkClick(e, link.pageId)}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.button
                onClick={handleAddAnimeClick}
                className="bg-gradient-to-r from-pink-500 to-violet-600 text-white py-3 rounded-lg text-sm font-medium shadow-glow animated-bg-button flex items-center justify-center mt-4"
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Anime
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className={`absolute top-2 right-[20%] text-lg opacity-30 ${theme === 'dark' ? 'text-pink-500' : 'text-pink-400'}`}
          animate={{ 
            y: [0, 10, 0],
            rotate: [0, 5, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        >
          ✦
        </motion.div>
        <motion.div 
          className={`absolute top-[70%] left-[30%] text-lg opacity-30 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-300'}`}
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, -5, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1 
          }}
        >
          ✦
        </motion.div>
        <motion.div 
          className={`absolute top-[40%] right-[40%] text-sm opacity-20 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-300'}`}
          animate={{ 
            y: [0, 8, 0],
            rotate: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2 
          }}
        >
          ✦
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 