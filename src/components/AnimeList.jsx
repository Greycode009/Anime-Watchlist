import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimeContext } from '../context/AnimeContext';
import { ThemeContext } from '../context/ThemeContext';
import AnimeCard from './AnimeCard';
import AnimeListRow from './AnimeListRow';

const AnimeList = () => {
  console.log('Rendering AnimeList component');
  const { animeList, refreshTrigger } = useContext(AnimeContext);
  const { theme } = useContext(ThemeContext);
  const [activeCategory, setActiveCategory] = useState('All');
  const [listKey, setListKey] = useState(Date.now());
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');

  const isDark = theme === 'dark';

  console.log('Current animeList:', animeList);
  
  // First filter by search term (if any)
  const searchFiltered = searchTerm 
    ? animeList.filter(anime => 
        anime.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (anime.status && anime.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (anime.tier && anime.tier.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : animeList;
  
  // Then filter by active category
  const filteredAnime = activeCategory === 'All' 
    ? searchFiltered 
    : searchFiltered.filter(anime => anime.status === activeCategory);

  // Sort anime list based on sortConfig
  const sortedAnime = [...filteredAnime].sort((a, b) => {
    if (!a[sortConfig.key] && !b[sortConfig.key]) return 0;
    if (!a[sortConfig.key]) return 1;
    if (!b[sortConfig.key]) return -1;
    
    // Handle string and number comparisons differently
    if (typeof a[sortConfig.key] === 'string') {
      return sortConfig.direction === 'ascending'
        ? a[sortConfig.key].localeCompare(b[sortConfig.key])
        : b[sortConfig.key].localeCompare(a[sortConfig.key]);
    } else {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    }
  });

  // Update key when anime list changes to force re-render
  useEffect(() => {
    console.log('AnimeList: Detected change in anime list or refresh trigger');
    setListKey(Date.now());
  }, [animeList, refreshTrigger]);

  // Handle sort request
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 260,
        damping: 20
      } 
    }
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setActiveCategory('All');
    setSortConfig({ key: 'title', direction: 'ascending' });
  };

  // Category buttons (filter by status)
  const categoryList = [
    { id: 'All', label: 'All Anime' },
    { id: 'Watchlist', label: 'Watchlist' },
    { id: 'Watched', label: 'Watched' },
    { id: 'Ongoing', label: 'Ongoing' },
    { id: 'Plan to Watch', label: 'Plan to Watch' }
  ];

  // Sorting options for dropdown
  const sortOptions = [
    { key: 'title', direction: 'ascending', label: 'Title (A-Z)' },
    { key: 'title', direction: 'descending', label: 'Title (Z-A)' },
    { key: 'rating', direction: 'descending', label: 'Rating (High-Low)' },
    { key: 'rating', direction: 'ascending', label: 'Rating (Low-High)' },
    { key: 'status', direction: 'ascending', label: 'Status (A-Z)' },
    { key: 'tier', direction: 'ascending', label: 'Tier (A-Z)' },
  ];

  return (
    <div className="pb-12 sm:pb-24">
      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 flex-wrap">
        {/* Categories */}
        <div className="flex overflow-x-auto pb-2 sm:pb-0 space-x-2 max-w-full">
          {categoryList.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === category.id 
                  ? 'bg-indigo-600 text-white' 
                  : isDark 
                    ? 'bg-dark-700 text-white hover:bg-dark-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Search and Views */}
        <div className="flex gap-2 flex-wrap items-center justify-between sm:justify-end w-full sm:w-auto">
          {/* Search Bar */}
          <div className={`${isDark ? 'bg-dark-800 border-dark-700' : 'bg-white border-gray-200'} border rounded-lg flex-1 sm:flex-none min-w-[200px] flex items-center px-3 py-2 shadow-sm`}>
            <svg className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search anime..."
              className={`ml-2 w-full outline-none text-sm ${isDark ? 'bg-dark-800 text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className={`ml-1 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>

          {/* View Switcher */}
          <div className="flex justify-center md:justify-start">
            <div className={`${isDark ? 'bg-dark-800 border-dark-700' : 'bg-white border-gray-200'} border rounded-lg shadow-sm flex`}>
              <button
                className={`px-3 py-2 rounded-l-lg flex items-center space-x-1 text-sm ${
                  viewMode === 'grid' 
                    ? 'bg-indigo-600 text-white' 
                    : isDark ? 'text-white hover:bg-dark-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setViewMode('grid')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                className={`px-3 py-2 rounded-r-lg flex items-center space-x-1 text-sm ${
                  viewMode === 'list' 
                    ? 'bg-indigo-600 text-white' 
                    : isDark ? 'text-white hover:bg-dark-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setViewMode('list')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Empty state message */}
      {sortedAnime.length === 0 ? (
        <motion.div 
          className={`flex flex-col items-center justify-center py-16 px-4 ${isDark ? 'bg-dark-800' : 'bg-white'} rounded-xl shadow-sm border ${isDark ? 'border-dark-700' : 'border-gray-200'} text-center`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-4"
          >
            <svg className={`w-20 h-20 ${isDark ? 'text-dark-500' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
            </svg>
          </motion.div>
          <motion.h3 
            className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {searchTerm ? "No matching anime found" : "Your anime list is empty"}
          </motion.h3>
          <motion.p 
            className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {searchTerm 
              ? "Try adjusting your search or filters to find what you're looking for."
              : "Add your first anime to start building your collection."}
          </motion.p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="anime-gradient-bg text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Clear Search
            </button>
          )}
          {activeCategory !== 'All' && (
            <button
              onClick={() => setActiveCategory('All')}
              className="anime-gradient-bg text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              View All Anime
            </button>
          )}
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key={`grid-${listKey}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              {sortedAnime.map(anime => (
                <motion.div 
                  key={`anime-grid-${anime.id}-${refreshTrigger}`}
                  variants={itemVariants}
                  className="flex w-full"
                >
                  <div className="w-full">
                    <AnimeCard key={`card-${anime.id}-${refreshTrigger}`} anime={anime} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={`list-${listKey}`}
              className={`${isDark ? 'bg-dark-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Mobile List Header - Only visible on mobile */}
              <div className={`md:hidden px-4 py-3 ${isDark ? 'bg-dark-700' : 'bg-gray-50'} border-b ${isDark ? 'border-dark-600' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>
                    {sortedAnime.length} {sortedAnime.length === 1 ? 'Anime' : 'Animes'}
                  </h3>
                  <div className={`flex items-center text-xs ${isDark ? 'text-dark-300' : 'text-gray-500'}`}>
                    <span>Sorted by: </span>
                    <select
                      value={`${sortConfig.key}-${sortConfig.direction}`}
                      onChange={(e) => {
                        const [key, direction] = e.target.value.split('-');
                        setSortConfig({ key, direction });
                      }}
                      className={`ml-1 py-0.5 pl-1 pr-6 text-xs border-0 ${isDark ? 'bg-transparent text-white' : 'bg-transparent'} focus:ring-0 focus:outline-none`}
                    >
                      <option value="title-ascending">Title (A-Z)</option>
                      <option value="title-descending">Title (Z-A)</option>
                      <option value="rating-descending">Rating (High-Low)</option>
                      <option value="status-ascending">Status</option>
                      <option value="tier-ascending">Tier</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Desktop Table Header - Hidden on mobile */}
              <div className={`hidden md:block ${isDark ? 'bg-dark-700' : 'bg-gray-50'} border-b ${isDark ? 'border-dark-600' : 'border-gray-200'}`}>
                <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-medium uppercase tracking-wider">
                  <div className={`col-span-1 flex items-center justify-center ${isDark ? 'text-dark-300' : 'text-gray-500'}`}>
                    <span>Image</span>
                  </div>
                  <div 
                    className={`col-span-3 flex items-center cursor-pointer ${isDark ? 'text-dark-300 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-700'}`}
                    onClick={() => requestSort('title')}
                  >
                    <span>Title</span>
                    {sortConfig.key === 'title' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                  <div 
                    className={`col-span-2 flex items-center cursor-pointer ${isDark ? 'text-dark-300 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-700'}`}
                    onClick={() => requestSort('status')}
                  >
                    <span>Status</span>
                    {sortConfig.key === 'status' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                  <div 
                    className={`col-span-2 flex items-center cursor-pointer ${isDark ? 'text-dark-300 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-700'}`}
                    onClick={() => requestSort('tier')}
                  >
                    <span>Tier</span>
                    {sortConfig.key === 'tier' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                  <div 
                    className={`col-span-2 flex items-center cursor-pointer ${isDark ? 'text-dark-300 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-700'}`}
                    onClick={() => requestSort('rating')}
                  >
                    <span>Rating</span>
                    {sortConfig.key === 'rating' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                  <div className={`col-span-2 flex items-center justify-end ${isDark ? 'text-dark-300' : 'text-gray-500'}`}>
                    <span>Actions</span>
                  </div>
                </div>
              </div>

              {/* List Items */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="divide-y divide-gray-200 dark:divide-dark-600"
              >
                {sortedAnime.map(anime => (
                  <motion.div 
                    key={`anime-list-${anime.id}-${refreshTrigger}`}
                    variants={itemVariants}
                  >
                    <AnimeListRow anime={anime} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default AnimeList; 