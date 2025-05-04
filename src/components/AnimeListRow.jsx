import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimeContext } from '../context/AnimeContext';
import { ThemeContext } from '../context/ThemeContext';

const AnimeListRow = ({ anime }) => {
  const { updateAnime, deleteAnime } = useContext(AnimeContext);
  const { theme } = useContext(ThemeContext);
  const [isEditing, setIsEditing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [editData, setEditData] = useState({
    title: anime.title || '',
    status: anime.status || 'Watchlist',
    tier: anime.tier || 'Unranked',
    rating: anime.rating || 0
  });

  const isDark = theme === 'dark';

  // Status colors for badges (light mode)
  const statusColors = {
    'Watchlist': 'bg-blue-100 text-blue-800 border-blue-300',
    'Watched': 'bg-green-100 text-green-800 border-green-300',
    'Ongoing': 'bg-purple-100 text-purple-800 border-purple-300',
    'Plan to Watch': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  // Status colors for badges (dark mode)
  const darkStatusColors = {
    'Watchlist': 'bg-blue-900/30 text-blue-300 border-blue-800',
    'Watched': 'bg-green-900/30 text-green-300 border-green-800',
    'Ongoing': 'bg-purple-900/30 text-purple-300 border-purple-800',
    'Plan to Watch': 'bg-yellow-900/30 text-yellow-300 border-yellow-800',
  };

  // Tier colors for badges
  const tierColors = {
    'S': 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
    'A': 'bg-gradient-to-r from-orange-400 to-amber-500 text-white',
    'B': 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white',
    'C': 'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
    'D': 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white',
    'Unranked': 'bg-gray-200 text-gray-700',
  };

  // Dark tier colors for badges
  const darkTierColors = {
    'S': 'bg-gradient-to-r from-red-600 to-pink-600 text-white',
    'A': 'bg-gradient-to-r from-orange-500 to-amber-600 text-white',
    'B': 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
    'C': 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
    'D': 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
    'Unranked': 'bg-gray-700 text-gray-300',
  };

  // Render stars for rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating / 2);
    const halfStar = rating % 2 !== 0;
    
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i}
            className={`h-4 w-4 ${i < fullStars ? 'text-yellow-400' : isDark ? 'text-gray-600' : 'text-gray-300'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className={`ml-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{rating}/10</span>
      </div>
    );
  };

  // Get emoji for tier
  const getTierEmoji = (tier) => {
    switch (tier) {
      case 'S': return '🏆';
      case 'A': return '⭐';
      case 'B': return '👍';
      case 'C': return '😐';
      case 'D': return '👎';
      default: return '❓';
    }
  };

  // Default image if none provided
  const defaultImageUrl = 'https://via.placeholder.com/600x800?text=No+Image';
  
  // State for image loading
  const [imageLoading, setImageLoading] = useState(true);

  // Handle image loading
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  // Handle image error
  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Reset loading state when image url changes and preload image
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
        console.error(`Preload failed for image in list view: ${anime.imageUrl}`);
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

  // Handle change for editing inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: name === 'rating' ? Number(value) : value
    });
  };

  // Save changes
  const handleSave = () => {
    updateAnime(anime.id, editData);
    setIsEditing(false);
  };

  // Handle cancel editing
  const handleCancel = () => {
    setEditData({
      title: anime.title || '',
      status: anime.status || 'Watchlist',
      tier: anime.tier || 'Unranked',
      rating: anime.rating || 0
    });
    setIsEditing(false);
  };

  // Handle delete
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${anime.title}"?`)) {
      deleteAnime(anime.id);
    }
  };

  return (
    <div className={`${isEditing ? 'py-4 px-3' : 'py-3 px-4'} ${isDark ? 'hover:bg-dark-700' : 'hover:bg-gray-50'} transition-colors duration-150`}>
      {/* Desktop View (md and above) */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-2 items-center">
        {isEditing ? (
          // Editing mode - Desktop
          <>
            {/* Image cell */}
            <div className="col-span-1 flex items-center justify-center">
              <div className="relative h-12 w-12 rounded-full overflow-hidden">
                {imageLoading && (
                  <div className={`absolute inset-0 flex items-center justify-center ${isDark ? 'bg-dark-700' : 'bg-gray-200'} rounded-full`}>
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={imageError ? defaultImageUrl : (anime.imageUrl || defaultImageUrl)}
                  alt={anime.title || "Anime image"}
                  className="h-full w-full rounded-full object-cover"
                  style={{ 
                    imageRendering: 'high-quality',
                    opacity: imageLoading ? 0 : 1,
                    transition: 'opacity 0.3s'
                  }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>
            </div>
            
            {/* Title cell */}
            <div className="col-span-3 flex items-center">
              <input
                type="text"
                name="title"
                value={editData.title}
                onChange={handleChange}
                className={`w-full px-2 py-1 border ${isDark ? 'bg-dark-700 border-dark-600 text-white' : 'border-gray-300'} rounded text-sm`}
              />
            </div>
            
            {/* Status cell */}
            <div className="col-span-2 flex items-center">
              <select
                name="status"
                value={editData.status}
                onChange={handleChange}
                className={`w-full px-2 py-1 border ${isDark ? 'bg-dark-700 border-dark-600 text-white' : 'border-gray-300'} rounded text-sm`}
              >
                <option value="Watchlist">Watchlist</option>
                <option value="Watched">Watched</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Plan to Watch">Plan to Watch</option>
              </select>
            </div>
            
            {/* Tier cell */}
            <div className="col-span-2 flex items-center">
              <select
                name="tier"
                value={editData.tier}
                onChange={handleChange}
                className={`w-full px-2 py-1 border ${isDark ? 'bg-dark-700 border-dark-600 text-white' : 'border-gray-300'} rounded text-sm`}
              >
                <option value="S">S Tier</option>
                <option value="A">A Tier</option>
                <option value="B">B Tier</option>
                <option value="C">C Tier</option>
                <option value="D">D Tier</option>
                <option value="Unranked">Unranked</option>
              </select>
            </div>
            
            {/* Rating cell */}
            <div className="col-span-2 flex items-center">
              <input
                type="number"
                name="rating"
                min="0"
                max="10"
                step="1"
                value={editData.rating}
                onChange={handleChange}
                className={`w-20 px-2 py-1 border ${isDark ? 'bg-dark-700 border-dark-600 text-white' : 'border-gray-300'} rounded text-sm`}
              />
              <span className={`ml-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>/10</span>
            </div>
            
            {/* Actions cell */}
            <div className="col-span-2 flex items-center justify-end space-x-2">
              <button
                onClick={handleSave}
                className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className={`px-3 py-1.5 text-xs font-medium ${isDark ? 'bg-dark-600 text-gray-300 hover:bg-dark-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} rounded`}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          // View mode - Desktop
          <>
            {/* Image cell */}
            <div className="col-span-1 flex items-center justify-center">
              <div className="relative h-12 w-12 rounded-full overflow-hidden border border-gray-200">
                {imageLoading && (
                  <div className={`absolute inset-0 flex items-center justify-center ${isDark ? 'bg-dark-700' : 'bg-gray-200'} rounded-full`}>
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={imageError ? defaultImageUrl : (anime.imageUrl || defaultImageUrl)}
                  alt={anime.title || "Anime image"}
                  className="h-full w-full rounded-full object-cover"
                  style={{ 
                    imageRendering: 'high-quality',
                    opacity: imageLoading ? 0 : 1,
                    transition: 'opacity 0.3s'
                  }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>
            </div>
            
            {/* Title cell */}
            <div className="col-span-3 flex items-center">
              <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
                {anime.title}
              </h3>
            </div>
            
            {/* Status cell */}
            <div className="col-span-2 flex items-center">
              <span className={`px-2 py-1 text-xs rounded-full ${isDark ? darkStatusColors[anime.status || 'Watchlist'] : statusColors[anime.status || 'Watchlist']}`}>
                {anime.status || 'Watchlist'}
              </span>
            </div>
            
            {/* Tier cell */}
            <div className="col-span-2 flex items-center">
              <span className={`px-2 py-1 text-xs rounded-full ${isDark ? darkTierColors[anime.tier || 'Unranked'] : tierColors[anime.tier || 'Unranked']}`}>
                {getTierEmoji(anime.tier || 'Unranked')} {anime.tier || 'Unranked'}
              </span>
            </div>
            
            {/* Rating cell */}
            <div className="col-span-2 flex items-center">
              {renderStars(anime.rating || 0)}
            </div>
            
            {/* Actions cell */}
            <div className="col-span-2 flex items-center justify-end space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className={`p-1 text-indigo-600 hover:text-indigo-800 ${isDark ? 'text-indigo-400 hover:text-indigo-300' : ''}`}
                title="Edit"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className={`p-1 text-red-600 hover:text-red-800 ${isDark ? 'text-red-400 hover:text-red-300' : ''}`}
                title="Delete"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile View (sm and below) */}
      <div className="md:hidden">
        {isEditing ? (
          // Editing mode - Mobile
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              {/* Image and title */}
              <div className="flex-shrink-0 relative h-14 w-14 rounded-full overflow-hidden">
                {imageLoading && (
                  <div className={`absolute inset-0 flex items-center justify-center ${isDark ? 'bg-dark-700' : 'bg-gray-200'} rounded-full`}>
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={imageError ? defaultImageUrl : (anime.imageUrl || defaultImageUrl)}
                  alt={anime.title || "Anime image"}
                  className="h-full w-full rounded-full object-cover"
                  style={{ 
                    imageRendering: 'high-quality',
                    opacity: imageLoading ? 0 : 1,
                    transition: 'opacity 0.3s'
                  }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  name="title"
                  value={editData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${isDark ? 'bg-dark-700 border-dark-600 text-white' : 'border-gray-300'} rounded text-sm`}
                  placeholder="Anime Title"
                />
              </div>
            </div>
            
            {/* Status and Tier */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`block mb-1 text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Status
                </label>
                <select
                  name="status"
                  value={editData.status}
                  onChange={handleChange}
                  className={`w-full px-2 py-1.5 border ${isDark ? 'bg-dark-700 border-dark-600 text-white' : 'border-gray-300'} rounded text-sm`}
                >
                  <option value="Watchlist">Watchlist</option>
                  <option value="Watched">Watched</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Plan to Watch">Plan to Watch</option>
                </select>
              </div>
              <div>
                <label className={`block mb-1 text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Tier
                </label>
                <select
                  name="tier"
                  value={editData.tier}
                  onChange={handleChange}
                  className={`w-full px-2 py-1.5 border ${isDark ? 'bg-dark-700 border-dark-600 text-white' : 'border-gray-300'} rounded text-sm`}
                >
                  <option value="S">S Tier</option>
                  <option value="A">A Tier</option>
                  <option value="B">B Tier</option>
                  <option value="C">C Tier</option>
                  <option value="D">D Tier</option>
                  <option value="Unranked">Unranked</option>
                </select>
              </div>
            </div>
            
            {/* Rating */}
            <div>
              <label className={`block mb-1 text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Rating
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  name="rating"
                  min="0"
                  max="10"
                  step="1"
                  value={editData.rating}
                  onChange={handleChange}
                  className="flex-1 h-2 appearance-none bg-gray-300 rounded-full"
                />
                <span className={`ml-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{editData.rating}/10</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className={`px-4 py-2 text-sm font-medium ${isDark ? 'bg-dark-600 text-gray-300 hover:bg-dark-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} rounded`}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          // View mode - Mobile
          <div className="flex items-start">
            {/* Image */}
            <div className="flex-shrink-0 relative h-14 w-14 rounded-full overflow-hidden">
              {imageLoading && (
                <div className={`absolute inset-0 flex items-center justify-center ${isDark ? 'bg-dark-700' : 'bg-gray-200'} rounded-full`}>
                  <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={imageError ? defaultImageUrl : (anime.imageUrl || defaultImageUrl)}
                alt={anime.title || "Anime image"}
                className="h-full w-full rounded-full object-cover"
                style={{ 
                  imageRendering: 'high-quality',
                  opacity: imageLoading ? 0 : 1,
                  transition: 'opacity 0.3s'
                }}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
              />
            </div>
            
            {/* Content */}
            <div className="flex-1">
              {/* Title */}
              <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                {anime.title}
              </h3>
              
              {/* Tags row */}
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                <span className={`px-2 py-0.5 text-xs rounded-full ${isDark ? darkStatusColors[anime.status || 'Watchlist'] : statusColors[anime.status || 'Watchlist']}`}>
                  {anime.status || 'Watchlist'}
                </span>
                <span className={`px-2 py-0.5 text-xs rounded-md ${isDark ? darkTierColors[anime.tier || 'Unranked'] : tierColors[anime.tier || 'Unranked']}`}>
                  <span className="mr-1">{getTierEmoji(anime.tier || 'Unranked')}</span>
                  {anime.tier || 'Unranked'}
                </span>
              </div>
              
              {/* Rating */}
              <div className="mb-1">
                {renderStars(anime.rating || 0)}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex-shrink-0 ml-2 flex flex-col space-y-1">
              <button
                onClick={() => setIsEditing(true)}
                className={`p-1 ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className={`p-1 ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeListRow; 