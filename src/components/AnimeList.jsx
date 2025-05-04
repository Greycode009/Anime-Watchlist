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

  return (
    <div className="mt-6">
      {/* Search and filter bar */}
      <div className={`mb-6 ${isDark ? 'bg-dark-800' : 'bg-white'} border ${isDark ? 'border-dark-700' : 'border-gray-200'} rounded-lg shadow-sm p-4`}>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search input */}
          <div className="w-full lg:w-1/3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className={`w-4 h-4 ${isDark ? 'text-dark-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${isDark ? 'bg-dark-700 border-dark-600 text-white placeholder-dark-400' : 'bg-gray-50 border-gray-300 text-gray-900'} border text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5`}
                placeholder="Search by title, status, tier..."
              />
            </div>
          </div>

          {/* Sort options dropdown */}
          <div className="w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <label className={`text-sm font-medium ${isDark ? 'text-dark-200' : 'text-gray-600'}`}>Sort by:</label>
              <select
                value={`${sortConfig.key}-${sortConfig.direction}`}
                onChange={(e) => {
                  const [key, direction] = e.target.value.split('-');
                  setSortConfig({ key, direction });
                }}
                className={`${isDark ? 'bg-dark-700 border-dark-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2.5`}
              >
                <option value="title-ascending">Title (A-Z)</option>
                <option value="title-descending">Title (Z-A)</option>
                <option value="rating-descending">Rating (High-Low)</option>
                <option value="rating-ascending">Rating (Low-High)</option>
                <option value="status-ascending">Status (A-Z)</option>
                <option value="tier-ascending">Tier (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Clear filters */}
          {(searchTerm || activeCategory !== 'All' || 
            sortConfig.key !== 'title' || sortConfig.direction !== 'ascending') && (
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Clear filters
            </button>
          )}
        </div>

        {/* Search results count */}
        {searchTerm && (
          <div className={`mt-3 text-sm ${isDark ? 'text-dark-300' : 'text-gray-600'}`}>
            Found {filteredAnime.length} {filteredAnime.length === 1 ? 'result' : 'results'} for "{searchTerm}"
          </div>
        )}
      </div>

      {/* Top control bar with category filters and view toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {/* Category filter buttons */}
        <div className="flex flex-wrap justify-center md:justify-start gap-2">
          {['All', 'Watchlist', 'Watched', 'Ongoing', 'Plan to Watch'].map(category => (
            <motion.button
              key={category}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium border-2 ${
                activeCategory === category
                  ? 'anime-gradient-bg text-white border-transparent'
                  : isDark 
                    ? 'bg-dark-800 text-white border-dark-700 hover:border-indigo-500' 
                    : 'bg-white text-gray-800 border-gray-200 hover:border-indigo-300'
              } transition-colors duration-200 shadow-sm`}
              onClick={() => setActiveCategory(category)}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* View mode toggle */}
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

      {/* Empty state message */}
      {filteredAnime.length === 0 ? (
        <motion.div
          className={`text-center p-6 sm:p-8 ${isDark ? 'bg-dark-800' : 'bg-white'} rounded-lg border-2 border-dashed ${isDark ? 'border-dark-700' : 'border-gray-300'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg
            className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className={`mt-3 text-base sm:text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} anime-title`}>No anime found</h3>
          <p className={`mt-2 text-sm sm:text-base ${isDark ? 'text-dark-300' : 'text-gray-500'}`}>
            {searchTerm 
              ? `No results matching "${searchTerm}"`
              : activeCategory === 'All'
                ? 'Start by adding some anime to your list'
                : `No anime in ${activeCategory} category`}
          </p>
          <motion.div 
            className="mt-5 flex flex-wrap justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
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
                  <div className={`col-span-2 flex items-center justify-center ${isDark ? 'text-dark-300' : 'text-gray-500'}`}>
                    <span>Actions</span>
                  </div>
                </div>
              </div>
              
              {/* Table body */}
              <div className={`divide-y ${isDark ? 'divide-dark-700' : 'divide-gray-200'}`}>
                {sortedAnime.map(anime => (
                  <AnimeListRow 
                    key={`anime-list-${anime.id}-${refreshTrigger}`} 
                    anime={anime} 
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default AnimeList; 