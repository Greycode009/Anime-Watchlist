import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimeContext } from '../context/AnimeContext';
import { ThemeContext } from '../context/ThemeContext';

const AnimeForm = ({ onAnimeAdded, expanded, onExpandedChange }) => {
  const { addAnime } = useContext(AnimeContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  
  const [formData, setFormData] = useState({
    title: '',
    status: 'Watchlist',
    rating: 0,
    tier: 'Unranked',
    imageUrl: ''
  });
  const [isOpen, setIsOpen] = useState(expanded || false);
  const [imageSource, setImageSource] = useState('url'); // 'url' or 'upload'
  const [previewImage, setPreviewImage] = useState(null);
  const [isSearchingImage, setIsSearchingImage] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Sync isOpen with expanded prop
  useEffect(() => {
    if (expanded !== undefined) {
      setIsOpen(expanded);
    }
  }, [expanded]);

  // Sync internal state with parent component
  useEffect(() => {
    if (onExpandedChange && isOpen !== expanded) {
      onExpandedChange(isOpen);
    }
  }, [isOpen, expanded, onExpandedChange]);

  // Auto search for images when title changes
  useEffect(() => {
    // Clear any previous errors
    setSearchError(null);
    
    // If title is empty, do nothing
    if (!formData.title.trim()) return;
    
    // Debounce the search to avoid making too many requests
    const debounceTimer = setTimeout(() => {
      if (formData.title.trim().length > 2) {
        searchAnimeImage(formData.title);
      }
    }, 800);
    
    return () => clearTimeout(debounceTimer);
  }, [formData.title]);

  const searchAnimeImage = async (title) => {
    if (!title) return;
    
    setIsSearchingImage(true);
    setSearchError(null);
    
    try {
      // Use Jikan API to search for anime
      const searchUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      if (data.data && data.data.length > 0 && data.data[0].images) {
        // Always prioritize the highest quality image available
        const images = data.data[0].images;
        let imageUrl = null;
        
        // First try to get the largest image available
        if (images.jpg && images.jpg.large_image_url) {
          imageUrl = images.jpg.large_image_url;
        } 
        // Then try webp format which is usually high quality
        else if (images.webp && images.webp.large_image_url) {
          imageUrl = images.webp.large_image_url;
        }
        // Fall back to medium image
        else if (images.jpg && images.jpg.image_url) {
          imageUrl = images.jpg.image_url;
        }
        // Last resort - small image
        else if (images.jpg && images.jpg.small_image_url) {
          imageUrl = images.jpg.small_image_url;
        }
        
        if (imageUrl) {
          // Preload the image to verify it loads correctly
          const img = new Image();
          img.onload = () => {
            // Image loaded successfully
            setFormData(prev => ({
              ...prev,
              imageUrl: imageUrl
            }));
            setPreviewImage(imageUrl);
            setIsSearchingImage(false);
          };
          img.onerror = () => {
            // Image failed to load, use fallback
            console.error(`Image failed to load: ${imageUrl}`);
            setFallbackImage(title);
          };
          img.src = imageUrl;
        } else {
          // If no suitable image found, use fallback
          setFallbackImage(title);
        }
      } else {
        // If no image found, use fallback
        setFallbackImage(title);
      }
    } catch (error) {
      console.error("Error fetching anime image:", error);
      setSearchError("Failed to fetch image. Please try again or enter URL manually.");
      setIsSearchingImage(false);
    }
  };

  // Helper function for fallback image with better quality
  const setFallbackImage = (title) => {
    // Use a high-quality placeholder as fallback
    const fallbackUrl = `https://via.placeholder.com/600x800/6366f1/ffffff?text=${encodeURIComponent(title)}`;
    setFormData(prev => ({
      ...prev,
      imageUrl: fallbackUrl
    }));
    setPreviewImage(fallbackUrl);
    setIsSearchingImage(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating' ? parseFloat(value) : value
    });

    // Preview image when URL is entered
    if (name === 'imageUrl' && value.trim() !== '') {
      setPreviewImage(value);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local URL for the uploaded image
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormData({
        ...formData,
        imageUrl: imageUrl,
        imageFile: file // Store the file object for potential future use
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      const newAnime = addAnime({
        ...formData,
        // Ensure these fields are set even if somehow missing
        rating: formData.rating || 0,
        tier: formData.tier || 'Unranked',
        status: formData.status || 'Watchlist',
        imageUrl: formData.imageUrl || ''
      });
      
      // Reset form after submission
      setFormData({
        title: '',
        status: 'Watchlist',
        rating: 0,
        tier: 'Unranked',
        imageUrl: ''
      });
      setPreviewImage(null);
      setImageSource('url');
      setSearchError(null);
      
      // Close the form
      setIsOpen(false);
      
      // Call the callback function if it exists
      if (onAnimeAdded && typeof onAnimeAdded === 'function') {
        onAnimeAdded(newAnime);
      }
    }
  };

  // Function to manually trigger image search
  const handleManualImageSearch = () => {
    searchAnimeImage(formData.title);
  };

  // Tier colors for buttons
  const tierColors = {
    'S': 'bg-gradient-to-r from-red-500 to-pink-500',
    'A': 'bg-gradient-to-r from-orange-400 to-amber-500',
    'B': 'bg-gradient-to-r from-yellow-400 to-yellow-500',
    'C': 'bg-gradient-to-r from-green-400 to-emerald-500',
    'D': 'bg-gradient-to-r from-blue-400 to-indigo-500',
    'Unranked': 'bg-gray-300'
  };

  // Dark mode tier colors
  const darkTierColors = {
    'S': 'bg-gradient-to-r from-red-600 to-pink-600',
    'A': 'bg-gradient-to-r from-orange-500 to-amber-600',
    'B': 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    'C': 'bg-gradient-to-r from-green-500 to-emerald-600',
    'D': 'bg-gradient-to-r from-blue-500 to-indigo-600',
    'Unranked': 'bg-gray-700'
  };

  // Get emoji for tier
  const getTierEmoji = (tier) => {
    switch(tier) {
      case 'S': return '🏆';
      case 'A': return '⭐';
      case 'B': return '👍';
      case 'C': return '😊';
      case 'D': return '👌';
      default: return '📋';
    }
  };

  // Toggle form visibility
  const toggleForm = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    // Notify parent component of state change
    if (onExpandedChange) {
      onExpandedChange(newIsOpen);
    }
  };

  return (
    <div className="mb-6 sm:mb-8">
      <motion.button
        className={`w-full md:w-auto text-white font-semibold text-sm sm:text-base py-2.5 px-4 sm:px-5 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center relative overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-900/20' 
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg'
        }`}
        onClick={toggleForm}
        whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)" }}
        whileTap={{ scale: 0.97 }}
      >
        {isOpen ? (
          <>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Cancel
          </>
        ) : (
          <>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add New Anime
          </>
        )}
      </motion.button>

      {isOpen && (
        <motion.div
          className={`mt-4 sm:mt-5 ${
            isDark 
              ? 'bg-dark-800 border-dark-700 shadow-xl shadow-black/20' 
              : 'bg-white border-gray-100 shadow-lg'
          } rounded-lg overflow-hidden border`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 sm:p-5">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                  Anime Title
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter anime title"
                    className={`w-full px-3 py-2 border ${isDark ? 'bg-dark-700 border-dark-600 text-white focus:ring-indigo-400 focus:border-indigo-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm`}
                    required
                  />
                </div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                  Images will be automatically searched as you type
                </p>
              </div>

              {/* Image Upload Section */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                  Anime Image
                </label>
                
                {/* Toggle buttons for image source */}
                <div className="flex space-x-4 mb-2">
                  <button
                    type="button"
                    className={`text-xs px-3 py-1.5 rounded-md flex items-center shadow-sm ${
                      imageSource === 'url' 
                        ? `${isDark ? 'bg-indigo-600 ring-1 ring-indigo-400' : 'bg-indigo-600'} text-white shadow-md` 
                        : isDark 
                          ? 'bg-dark-600 text-gray-200 border border-dark-500 hover:bg-dark-500 hover:border-indigo-500 hover:text-white transition-all duration-200' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition-all duration-150`}
                    onClick={() => setImageSource('url')}
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Enter URL
                  </button>
                  <button
                    type="button"
                    className={`text-xs px-3 py-1.5 rounded-md flex items-center shadow-sm ${
                      imageSource === 'upload' 
                        ? `${isDark ? 'bg-indigo-600 ring-1 ring-indigo-400' : 'bg-indigo-600'} text-white shadow-md` 
                        : isDark 
                          ? 'bg-dark-600 text-gray-200 border border-dark-500 hover:bg-dark-500 hover:border-indigo-500 hover:text-white transition-all duration-200' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition-all duration-150`}
                    onClick={() => setImageSource('upload')}
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload Image
                  </button>
                  
                  {/* Search button - only show when title is entered */}
                  {formData.title.trim().length > 0 && (
                    <button
                      type="button"
                      className={`text-xs px-3 py-1.5 rounded-md ${
                        isDark ? 'bg-green-700 hover:bg-green-600 text-white shadow-sm' : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                      } flex items-center transition-colors`}
                      onClick={handleManualImageSearch}
                      disabled={isSearchingImage}
                    >
                      {isSearchingImage ? (
                        <svg className="animate-spin h-3 w-3 mr-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <>
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                          </svg>
                          Search
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Image preview section */}
                {previewImage && (
                  <div className={`mb-3 p-2 ${isDark ? 'bg-dark-700' : 'bg-gray-100'} rounded-md`}>
                    <div className="relative rounded-md overflow-hidden" style={{ height: '120px' }}>
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        style={{ 
                          imageRendering: 'high-quality'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* URL input */}
                {imageSource === 'url' ? (
                  <div className="relative">
                    <input
                      type="text"
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="Enter image URL"
                      className={`w-full px-3 py-2 border ${
                        isDark ? 'bg-dark-700 border-dark-600 text-white focus:ring-indigo-400 focus:border-indigo-500 placeholder-gray-500' : 
                        'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                      } rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm`}
                    />
                    {isSearchingImage && (
                      <div className="absolute right-3 top-2">
                        <svg className={`animate-spin h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`relative ${isDark ? 'bg-dark-700 rounded-md' : ''}`}>
                    <label 
                      htmlFor="imageFile" 
                      className={`flex flex-col items-center px-4 py-3 ${
                        isDark ? 'bg-dark-700 border-dark-600 text-gray-300 hover:bg-dark-600' : 
                        'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      } border-2 border-dashed rounded-md cursor-pointer transition-colors`}
                    >
                      <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="mt-2 text-sm font-medium">
                        Upload a file
                      </span>
                      <span className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        PNG, JPG, GIF up to 5MB
                      </span>
                    </label>
                    <input
                      type="file"
                      id="imageFile"
                      name="imageFile"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
                
                {/* Error message */}
                {searchError && (
                  <p className="mt-1 text-xs text-red-500">
                    {searchError}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <label htmlFor="status" className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    isDark ? 'bg-dark-700 border-dark-600 text-white focus:ring-indigo-400 focus:border-indigo-500' : 
                    'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm`}
                >
                  <option value="Watchlist">Watchlist</option>
                  <option value="Watched">Watched</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Plan to Watch">Plan to Watch</option>
                </select>
              </div>

              <div className="mt-4">
                <label htmlFor="rating" className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                  Rating
                </label>
                <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-md">
                  <div 
                    className="absolute top-0 left-0 h-full rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600" 
                    style={{ width: `${(formData.rating / 10) * 100}%` }}
                  ></div>
                  <div className="absolute top-0 left-0 w-full flex justify-between px-[1px] pointer-events-none">
                    {[...Array(11)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-2 w-[2px] ${i <= formData.rating*2 ? 'bg-white/30' : 'bg-gray-400/20'}`}
                      ></div>
                    ))}
                  </div>
                  <input
                    type="range"
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    min="0"
                    max="10"
                    step="0.5"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>0</span>
                  <span className={`text-xs font-semibold ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>{formData.rating.toFixed(1)}</span>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>10</span>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="tier" className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                  Tier Ranking
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {['S', 'A', 'B', 'C', 'D', 'Unranked'].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setFormData({...formData, tier})}
                      className={`py-2 px-1 rounded-md text-sm font-medium text-center transition-all duration-200 ${
                        formData.tier === tier 
                          ? 'ring-2 ring-offset-2 ' + (isDark ? 'ring-indigo-400 ring-offset-dark-800' : 'ring-indigo-500 ring-offset-white')
                          : ''
                      } ${
                        isDark 
                          ? darkTierColors[tier] + ' text-white shadow-sm'
                          : tierColors[tier] + (tier === 'Unranked' ? ' text-gray-700' : ' text-white')
                      }`}
                    >
                      <span className="flex flex-col items-center">
                        <span>{getTierEmoji(tier)}</span>
                        <span>{tier}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className={`w-full ${
                    isDark 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-900/20' 
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md'
                  } text-white font-semibold text-sm sm:text-base py-2.5 px-3 sm:px-4 rounded-md transition-all duration-300 flex justify-center items-center`}
                  disabled={isSearchingImage}
                >
                  {isSearchingImage ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Add Anime
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AnimeForm;