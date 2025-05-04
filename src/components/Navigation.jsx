import React from 'react';
import { motion } from 'framer-motion';

const Navigation = ({ currentPage, setCurrentPage }) => {
  const pages = [
    { id: 'collection', name: 'Collection' },
    { id: 'ranking', name: 'Tier Ranking' }
  ];
  
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex space-x-2 border-b border-gray-200">
        {pages.map((page) => (
          <motion.button
            key={page.id}
            className={`py-2 px-4 text-sm sm:text-base relative ${
              currentPage === page.id
                ? 'text-indigo-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setCurrentPage(page.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-page-id={page.id}
          >
            {page.name}
            {currentPage === page.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
                layoutId="navigation-underline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Navigation; 