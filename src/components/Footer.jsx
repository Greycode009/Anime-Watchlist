import React from 'react';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Footer = () => {
  // Get theme from context
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  
  // Animation for the sparkle effect
  const starVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  // Social media links configuration
  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/your_anime_list',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'X',
      url: 'https://x.com/dipeshmalla29',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      url: 'https://github.com/Greycode009',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      ),
    },
    // You can add more social platforms here
  ];

  return (
    <motion.footer 
      className={`${isDark ? 'bg-dark-900' : 'anime-pattern-bg'} ${isDark ? 'text-gray-300' : 'text-white'} py-4 mt-8 relative overflow-hidden`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Decorative anime-style elements */}
      <motion.div 
        className="absolute bottom-2 right-8 text-yellow-300 text-lg"
        variants={starVariants}
        animate="animate"
      >
        ✦
      </motion.div>
      <motion.div 
        className="absolute top-3 left-12 text-pink-300 text-sm"
        variants={starVariants}
        animate="animate"
        transition={{ delay: 0.5 }}
      >
        ✦
      </motion.div>
      <motion.div 
        className="absolute bottom-6 left-1/4 text-purple-300 text-xs"
        variants={starVariants}
        animate="animate"
        transition={{ delay: 1 }}
      >
        ✦
      </motion.div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <motion.h3 
              className="anime-title text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 text-lg"
              whileHover={{ scale: 1.05 }}
            >
              Anime Watchlist
            </motion.h3>
            <p className={`text-xs ${isDark ? 'text-indigo-300' : 'text-pink-200'} mt-1`}>Track your favorite anime series</p>
          </div>
          
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <motion.a 
                key={index}
                href={social.url}
                target="_blank" 
                rel="noopener noreferrer"
                className={`${isDark ? 'text-indigo-300 hover:text-indigo-100' : 'text-pink-200 hover:text-white'} transition-colors duration-200`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                title={social.name}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>
        
        <hr className={`my-4 border-t ${isDark ? 'border-dark-700' : 'border-indigo-400 border-opacity-20'}`} />
        
        {/* Legal and copyright section */}
        <div className={`flex flex-col md:flex-row justify-between items-center text-xs ${isDark ? 'text-gray-400' : 'text-pink-200'}`}>
          <p>© 2025 Anime Watchlist. All rights reserved.</p>
          <div className="mt-2 md:mt-0 flex space-x-4">
            <motion.a 
              href={process.env.PUBLIC_URL + '/docs/privacy-policy.html'} 
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center ${isDark ? 'hover:text-indigo-300' : 'hover:text-white'} transition-colors duration-200`}
              whileHover={{ x: 2 }}
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Privacy Policy
            </motion.a>
            <motion.a 
              href={process.env.PUBLIC_URL + '/docs/terms-of-service.html'} 
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center ${isDark ? 'hover:text-indigo-300' : 'hover:text-white'} transition-colors duration-200`}
              whileHover={{ x: 2 }}
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Terms of Service
            </motion.a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer; 