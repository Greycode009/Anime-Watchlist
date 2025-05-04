import React, { useState, useContext, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AnimeContext } from '../context/AnimeContext';
import { ThemeContext } from '../context/ThemeContext';

const AnimeCard = ({ anime }) => {
  console.log('Rendering AnimeCard with anime:', anime);

  const { updateAnime, deleteAnime, forceRefresh } = useContext(AnimeContext);
  const { theme } = useContext(ThemeContext);
  const [rating, setRating] = useState(anime.rating || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [isTierEditing, setIsTierEditing] = useState(false);
  const [isImageEditing, setIsImageEditing] = useState(false);
  const [newStatus, setNewStatus] = useState(anime.status || 'Watchlist');
  const [newTitle, setNewTitle] = useState(anime.title || '');
  const [newTier, setNewTier] = useState(anime.tier || 'Unranked');
  const [newImageUrl, setNewImageUrl] = useState(anime.imageUrl || '');
  const [imageError, setImageError] = useState(false);

  const isDark = theme === 'dark';

  // Sync state with props when anime object changes
  useEffect(() => {
    console.log('AnimeCard effect: updating state from props', anime);
    setRating(anime.rating || 0);
    setNewStatus(anime.status || 'Watchlist');
    setNewTitle(anime.title || '');
    setNewTier(anime.tier || 'Unranked');
    setNewImageUrl(anime.imageUrl || '');
  }, [anime]);

  // Memoized update function to avoid repeated code
  const updateAnimeData = useCallback((data) => {
    if (!anime.id) {
      console.error('No anime ID available for update');
      return;
    }

    const stringId = String(anime.id);
    console.log(`Updating anime ID "${stringId}" with data:`, data);
    
    try {
      const result = updateAnime(stringId, data);
      console.log(`Update result:`, result);
      
      // Always force a refresh to ensure the UI updates
      setTimeout(() => {
        console.log('Forcing refresh after update');
        forceRefresh();
      }, 100);
    } catch (error) {
      console.error('Error updating anime:', error);
    }
  }, [anime.id, updateAnime, forceRefresh]);

  const handleRatingChange = (e) => {
    const newRating = parseInt(e.target.value, 10);
    console.log(`Setting rating to ${newRating}`);
    setRating(newRating);
    updateAnimeData({ rating: newRating });
  };

  const handleStatusChange = (e) => {
    console.log(`Setting new status: ${e.target.value}`);
    setNewStatus(e.target.value);
  };

  const handleTitleChange = (e) => {
    console.log(`Setting new title: ${e.target.value}`);
    setNewTitle(e.target.value);
  };

  const handleTierChange = (e) => {
    console.log(`Setting new tier: ${e.target.value}`);
    setNewTier(e.target.value);
  };

  const handleImageUrlChange = (e) => {
    console.log(`Setting new image URL: ${e.target.value}`);
    setNewImageUrl(e.target.value);
    setImageError(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local URL for the uploaded image
      const imageUrl = URL.createObjectURL(file);
      console.log(`Uploaded image and created URL: ${imageUrl}`);
      setNewImageUrl(imageUrl);
      setImageError(false);
    }
  };

  const saveStatusChange = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log(`Saving status change to "${newStatus}"`);
    updateAnimeData({ status: newStatus });
    setIsEditing(false);
  };

  const saveTitleChange = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (newTitle.trim()) {
      console.log(`Saving title change to "${newTitle}"`);
      updateAnimeData({ title: newTitle });
      setIsTitleEditing(false);
    }
  };

  const saveTierChange = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log(`Saving tier change to "${newTier}"`);
    updateAnimeData({ tier: newTier });
    setIsTierEditing(false);
  };

  const saveImageChange = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log(`Saving image URL change to "${newImageUrl}"`);
    updateAnimeData({ imageUrl: newImageUrl });
    setIsImageEditing(false);
  };

  const handleDelete = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Add confirmation before deletion
    if (window.confirm(`Are you sure you want to delete "${anime.title}"?`)) {
      const stringId = String(anime.id);
      console.log(`Deleting anime with ID ${stringId}`);
      try {
        deleteAnime(stringId);
      } catch (error) {
        console.error('Error deleting anime:', error);
        alert('Failed to delete anime. Please try again.');
      }
    }
  };

  // Define status colors for light mode
  const statusColors = {
    'Watchlist': 'bg-blue-100 text-blue-800 border-blue-300',
    'Watched': 'bg-green-100 text-green-800 border-green-300',
    'Ongoing': 'bg-purple-100 text-purple-800 border-purple-300',
    'Plan to Watch': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  // Define status colors for dark mode
  const darkStatusColors = {
    'Watchlist': 'bg-blue-900/30 text-blue-300 border-blue-800',
    'Watched': 'bg-green-900/30 text-green-300 border-green-800',
    'Ongoing': 'bg-purple-900/30 text-purple-300 border-purple-800',
    'Plan to Watch': 'bg-yellow-900/30 text-yellow-300 border-yellow-800',
  };

  // Define tier colors for light mode
  const tierColors = {
    'S': 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
    'A': 'bg-gradient-to-r from-orange-400 to-amber-500 text-white',
    'B': 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white',
    'C': 'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
    'D': 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white',
    'Unranked': 'bg-gray-200 text-gray-700',
  };

  // Define tier colors for dark mode - Improved for better contrast and visibility
  const darkTierColors = {
    'S': 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-sm shadow-red-900/40',
    'A': 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-sm shadow-orange-900/40',
    'B': 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm shadow-yellow-900/40',
    'C': 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm shadow-green-900/40',
    'D': 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm shadow-blue-900/40',
    'Unranked': 'bg-gray-700 text-gray-300 shadow-sm shadow-gray-900/40',
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

  // Direct update for star ratings
  const handleStarClick = (rating) => (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log(`Star clicked, setting rating to ${rating}`);
    setRating(rating);
    updateAnimeData({ rating });
  };

  // Star rating display
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <svg
          key={i}
          className={`h-3 w-3 sm:h-4 sm:w-4 ${i <= rating ? 'text-yellow-400' : isDark ? 'text-gray-600' : 'text-gray-300'}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          onClick={handleStarClick(i)}
          style={{ cursor: 'pointer', position: 'relative', zIndex: 20 }}
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      );
    }
    return stars;
  };

  // Updated with higher quality placeholder
  const defaultImageUrl = 'https://via.placeholder.com/600x800?text=No+Image';
  
  // Handle image loading state
  const [imageLoading, setImageLoading] = useState(true);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // Function to handle successful image load
  const handleImageLoad = (e) => {
    setImageLoading(false);
    setImageError(false);
    setImageDimensions({
      width: e.target.naturalWidth,
      height: e.target.naturalHeight
    });
  };

  // Function to handle image error
  const handleImageError = () => {
    console.error(`Image failed to load: ${anime.imageUrl}`);
    setImageLoading(false);
    setImageError(true);
  };

  // Reset loading and error state when image url changes
  useEffect(() => {
    if (anime.imageUrl) {
      setImageLoading(true);
      setImageError(false);
      
      // Preload image to check if it's valid
      const img = new Image();
      img.onload = () => {
        // Image loaded successfully
        setImageLoading(false);
        setImageError(false);
      };
      img.onerror = () => {
        // Image failed to load
        console.error(`Preload failed for image: ${anime.imageUrl}`);
        setImageLoading(false);
        setImageError(true);
      };
      img.src = anime.imageUrl;
    } else {
      // No image URL provided
      setImageLoading(false);
      setImageError(false);
    }
  }, [anime.imageUrl]);

  const handleEditButtonClick = (type) => (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log(`Setting ${type} editing to true`);
    switch (type) {
      case 'title':
        setIsTitleEditing(true);
        break;
      case 'tier':
        setIsTierEditing(true);
        break;
      case 'status':
        setIsEditing(true);
        break;
      case 'image':
        setIsImageEditing(true);
        break;
      default:
        break;
    }
  };

  const handleCancelButtonClick = (type) => (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log(`Canceling ${type} editing`);
    switch (type) {
      case 'title':
        setNewTitle(anime.title || '');
        setIsTitleEditing(false);
        break;
      case 'tier':
        setNewTier(anime.tier || 'Unranked');
        setIsTierEditing(false);
        break;
      case 'status':
        setNewStatus(anime.status || 'Watchlist');
        setIsEditing(false);
        break;
      case 'image':
        setNewImageUrl(anime.imageUrl || '');
        setIsImageEditing(false);
        break;
      default:
        break;
    }
  };

  const preventPropagation = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={`anime-card rounded-xl overflow-hidden ${isDark ? 'bg-dark-800 shadow-lg shadow-dark-900/30 hover:border-indigo-500' : 'bg-white shadow-md hover:border-indigo-300'} relative h-full`}>
      {/* Image section */}
      <div className="relative w-full h-48  sm:h-64 overflow-hidden">
        {/* Edit image button */}
        <button
          onClick={handleEditButtonClick('image')}
          className="absolute top-2 right-2 ml-2 bg-black/40 p-1 rounded-full hover:bg-black/60 z-20 transition-colors"
          style={{ pointerEvents: 'auto' }}
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="absolute top-2 left-2 bg-black/40 p-1 rounded-full hover:bg-red-600 z-20 transition-colors"
          style={{ pointerEvents: 'auto' }}
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3H4" />
          </svg>
        </button>

        {/* Status badge */}
        <div 
          className="absolute bottom-2 left-2 z-20" 
          onClick={preventPropagation}
          style={{ pointerEvents: 'auto' }}
        >
          {isEditing ? (
            <div className="bg-white dark:bg-dark-800 p-1 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700">
              <select 
                value={newStatus} 
                onChange={handleStatusChange}
                className={`pr-6 py-1 text-xs rounded ${isDark ? 'bg-dark-700 text-white border-dark-600' : 'border-gray-300'}`}
                style={{ minWidth: '90px' }}
              >
                <option value="Watchlist">Watchlist</option>
                <option value="Watched">Watched</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Plan to Watch">Plan to Watch</option>
              </select>
              <div className="flex mt-1 space-x-1">
                <button 
                  onClick={saveStatusChange}
                  className="flex-1 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Save
                </button>
                <button 
                  onClick={handleCancelButtonClick('status')}
                  className={`flex-1 py-1 text-xs rounded transition-colors ${isDark ? 'bg-dark-600 text-gray-300 hover:bg-dark-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button 
              className={`status-badge px-2 py-1 text-xs rounded-full border ${
                isDark ? darkStatusColors[anime.status || 'Watchlist'] : statusColors[anime.status || 'Watchlist']
              } hover:shadow-md transition-all`}
              onClick={handleEditButtonClick('status')}
            >
              {anime.status || 'Watchlist'}
            </button>
          )}
        </div>

        {/* Image */}
        {isImageEditing ? (
          <div className={`absolute inset-0 flex flex-col items-center justify-center ${isDark ? 'bg-dark-700' : 'bg-gray-100'} p-4 z-10`}>
            <input
              type="text"
              value={newImageUrl}
              onChange={handleImageUrlChange}
              placeholder="Enter image URL"
              className={`w-full px-2 py-1 text-xs ${isDark ? 'bg-dark-800 border-dark-600 text-white' : 'border-gray-300'} rounded mb-2`}
            />
            <div className="flex flex-col w-full">
              <label className={`block text-xs mb-1 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                Or upload:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-xs w-full"
              />
            </div>
            <div className="flex justify-between w-full mt-2">
              <button
                onClick={saveImageChange}
                className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancelButtonClick('image')}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${isDark ? 'bg-dark-600 text-gray-300 hover:bg-dark-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="relative w-full h-full overflow-hidden">
              {imageLoading && (
                <div className={`absolute inset-0 flex items-center justify-center ${isDark ? 'bg-dark-700' : 'bg-gray-200'}`}>
                  <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
              <img
                src={imageError ? defaultImageUrl : (anime.imageUrl || defaultImageUrl)}
                alt={anime.title || "Anime cover"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                style={{ 
                  imageRendering: 'high-quality',
                  transform: `scale(${imageLoading ? 0 : 1})`,
                  opacity: imageLoading ? 0 : 1,
                  transition: 'opacity 0.3s, transform 0.3s',
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%'
                }}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>
          </>
        )}
      </div>

      {/* Content section */}
      <div className={`p-3 sm:p-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
        {/* Title */}
        <div className="mb-2" onClick={preventPropagation}>
          {isTitleEditing ? (
            <div className="space-y-2 w-full">
              <input
                type="text"
                value={newTitle}
                onChange={handleTitleChange}
                className={`w-full px-2 py-1 text-sm ${isDark ? 'bg-dark-700 border-dark-600 text-white' : 'border-gray-300'} rounded`}
              />
              <div className="flex space-x-1">
                <button
                  onClick={saveTitleChange}
                  className="flex-1 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelButtonClick('title')}
                  className={`flex-1 py-1 text-xs rounded transition-colors ${isDark ? 'bg-dark-600 text-gray-300 hover:bg-dark-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <h3 
              className="font-bold text-sm sm:text-base line-clamp-2 hover:text-indigo-600 cursor-pointer"
              onClick={handleEditButtonClick('title')}
              style={{ pointerEvents: 'auto' }}
            >
              {anime.title || 'Untitled Anime'}
            </h3>
          )}
        </div>

        {/* Tier */}
        <div className="mb-2" onClick={preventPropagation}>
          {isTierEditing ? (
            <div className="space-y-2">
              <select
                value={newTier}
                onChange={handleTierChange}
                className={`w-full px-2 py-1 text-xs ${isDark ? 'bg-dark-700 border-dark-600 text-white' : 'border-gray-300'} rounded`}
              >
                <option value="S">S Tier</option>
                <option value="A">A Tier</option>
                <option value="B">B Tier</option>
                <option value="C">C Tier</option>
                <option value="D">D Tier</option>
                <option value="Unranked">Unranked</option>
              </select>
              <div className="flex space-x-1">
                <button
                  onClick={saveTierChange}
                  className="flex-1 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelButtonClick('tier')}
                  className={`flex-1 py-1 text-xs rounded transition-colors ${isDark ? 'bg-dark-600 text-gray-300 hover:bg-dark-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              className={`inline-flex items-center px-2 py-1 text-xs rounded-md 
                ${isDark ? darkTierColors[anime.tier || 'Unranked'] : tierColors[anime.tier || 'Unranked']} 
                hover:shadow-md transition-all`}
              onClick={handleEditButtonClick('tier')}
              style={{ pointerEvents: 'auto' }}
            >
              <span className="mr-1">{getTierEmoji(anime.tier || 'Unranked')}</span>
              {anime.tier || 'Unranked'} Tier
            </button>
          )}
        </div>

        {/* Rating */}
        <div className="flex flex-wrap items-center space-x-1" onClick={preventPropagation}>
          <div className="flex space-x-0.5" style={{ pointerEvents: 'auto' }}>
            {renderStars()}
          </div>
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{rating}/10</span>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard; 