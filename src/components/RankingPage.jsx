import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimeContext } from '../context/AnimeContext';
import { ThemeContext } from '../context/ThemeContext';

const RankingPage = () => {
  const { animeList, updateAnime } = useContext(AnimeContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [rankings, setRankings] = useState({
    S: [],
    A: [],
    B: [],
    C: [],
    D: []
  });
  const [unrankedAnime, setUnrankedAnime] = useState([]);
  const [draggingAnime, setDraggingAnime] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(null);
  const [touchSelectedAnime, setTouchSelectedAnime] = useState(null);
  const [showMobileTierSelection, setShowMobileTierSelection] = useState(false);

  // Setup initial rankings based on tier property in anime list
  useEffect(() => {
    const newRankings = {
      S: [],
      A: [],
      B: [],
      C: [],
      D: []
    };
    
    const newUnranked = [];
    
    animeList.forEach(anime => {
      if (anime.tier && anime.tier !== 'Unranked' && newRankings[anime.tier]) {
        newRankings[anime.tier].push(anime);
      } else {
        newUnranked.push(anime);
      }
    });
    
    setRankings(newRankings);
    setUnrankedAnime(newUnranked);
  }, [animeList]);

  // Handle drag start
  const handleDragStart = (e, anime) => {
    setDraggingAnime(anime);
    // Set ghost drag image for better UX
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', anime.id); // Required for Firefox
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  // Handle drag over tier
  const handleDragOver = (e, tier) => {
    e.preventDefault();
    setIsDraggingOver(tier);
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  // Handle drop in tier
  const handleDrop = (e, targetTier) => {
    e.preventDefault();
    if (!draggingAnime) return;

    moveAnimeToTier(draggingAnime, targetTier);
    setDraggingAnime(null);
    setIsDraggingOver(null);
  };

  // Handle drag end (cleanup)
  const handleDragEnd = () => {
    setDraggingAnime(null);
    setIsDraggingOver(null);
  };

  // Touch handlers for mobile
  const handleTouchStart = (anime) => {
    setTouchSelectedAnime(anime);
    setShowMobileTierSelection(true);
  };

  // Move anime to the specified tier and update state
  const moveAnimeToTier = (anime, targetTier) => {
    // Check if anime is already in a tier
    let sourceList = 'unranked';
    let animeToMove = { ...anime };

    // Check all tiers to find and remove the anime
    Object.keys(rankings).forEach(tier => {
      const index = rankings[tier].findIndex(a => a.id === anime.id);
      if (index !== -1) {
        sourceList = tier;
        animeToMove = rankings[tier][index];
      }
    });

    // Handle case when target is 'Unranked'
    if (targetTier === 'Unranked') {
      // If anime is already in a tier, remove it
      if (sourceList !== 'unranked') {
        setRankings({
          ...rankings,
          [sourceList]: rankings[sourceList].filter(a => a.id !== anime.id)
        });
      }
      
      // Update the anime's tier property persistently
      updateAnime(anime.id, { tier: 'Unranked' });
      
      // Add to unranked list if not already there
      if (!unrankedAnime.some(a => a.id === anime.id)) {
        setUnrankedAnime([...unrankedAnime, { ...animeToMove, tier: 'Unranked' }]);
      }
      
      return;
    }

    // Update source lists
    if (sourceList === 'unranked') {
      setUnrankedAnime(unrankedAnime.filter(a => a.id !== anime.id));
    } else if (sourceList !== targetTier) {
      setRankings({
        ...rankings,
        [sourceList]: rankings[sourceList].filter(a => a.id !== anime.id)
      });
    }

    // Add to target tier if not already there and target is not 'Unranked'
    if (sourceList !== targetTier) {
      // Update the anime's tier property persistently
      updateAnime(anime.id, { tier: targetTier });
      
      // Only update rankings object for valid tiers (S, A, B, C, D)
      if (rankings[targetTier] !== undefined) {
        setRankings({
          ...rankings,
          [targetTier]: [...rankings[targetTier], { ...animeToMove, tier: targetTier }]
        });
      }
    }
  };

  // Handle mobile tier selection
  const handleMobileTierSelect = (tier) => {
    if (touchSelectedAnime) {
      try {
        moveAnimeToTier(touchSelectedAnime, tier);
      } catch (error) {
        console.error("Error selecting tier:", error);
        // Provide user feedback
        alert(`Could not move "${touchSelectedAnime.title}" to ${tier} tier. Please try again.`);
      } finally {
        setTouchSelectedAnime(null);
        setShowMobileTierSelection(false);
      }
    }
  };

  // Handle returning anime to unranked
  const handleReturnToUnranked = (anime, tier) => {
    setRankings({
      ...rankings,
      [tier]: rankings[tier].filter(a => a.id !== anime.id)
    });
    
    // Update the anime's tier property persistently
    updateAnime(anime.id, { tier: 'Unranked' });
    
    setUnrankedAnime([...unrankedAnime, { ...anime, tier: 'Unranked' }]);
  };

  // Tier colors for light mode
  const tierColors = {
    S: 'from-red-500 to-pink-500',
    A: 'from-orange-400 to-amber-500',
    B: 'from-yellow-400 to-yellow-500',
    C: 'from-green-400 to-emerald-500',
    D: 'from-blue-400 to-indigo-500'
  };

  // Tier colors for dark mode
  const darkTierColors = {
    S: 'from-red-600 to-pink-600',
    A: 'from-orange-500 to-amber-600',
    B: 'from-yellow-500 to-yellow-600',
    C: 'from-green-500 to-emerald-600',
    D: 'from-blue-500 to-indigo-600'
  };

  // Mobile tier selection colors for light mode
  const mobileTierButtonColors = {
    S: 'bg-gradient-to-r from-red-500 to-pink-500',
    A: 'bg-gradient-to-r from-orange-400 to-amber-500',
    B: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
    C: 'bg-gradient-to-r from-green-400 to-emerald-500',
    D: 'bg-gradient-to-r from-blue-400 to-indigo-500',
    'Unranked': 'bg-gray-300'
  };

  // Mobile tier selection colors for dark mode
  const darkMobileTierButtonColors = {
    S: 'bg-gradient-to-r from-red-600 to-pink-600',
    A: 'bg-gradient-to-r from-orange-500 to-amber-600',
    B: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    C: 'bg-gradient-to-r from-green-500 to-emerald-600',
    D: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    'Unranked': 'bg-gray-700'
  };

  // Get emoji for tier
  const getTierEmoji = (tier) => {
    switch(tier) {
      case 'S': return '🏆';
      case 'A': return '⭐';
      case 'B': return '👍';
      case 'C': return '😑';
      case 'D': return '👎';
      default: return '📋';
    }
  };

  // Check if there are any anime to rank
  const hasAnimeToRank = animeList.length > 0;

  return (
    <div className="mt-6 mb-10">
      <motion.h2 
        className="text-xl sm:text-2xl font-bold anime-title anime-gradient-text mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Anime Tier Rankings
      </motion.h2>
      
      <div className="mb-6">
        <motion.p 
          className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="hidden sm:inline">Drag and drop</span>
          <span className="inline sm:hidden">Tap</span> anime titles to organize them into tiers.
        </motion.p>
      </div>

      {/* Mobile tier selection modal */}
      {showMobileTierSelection && touchSelectedAnime && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${isDark ? 'bg-dark-800 text-white' : 'bg-white'} rounded-lg p-4 w-full max-w-sm`}>
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg">Select Tier for</h3>
              <p className={`${isDark ? 'text-indigo-400' : 'text-indigo-600'} font-medium`}>{touchSelectedAnime.title}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.keys(rankings).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  className={`${isDark ? darkMobileTierButtonColors[tier] : mobileTierButtonColors[tier]} text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-150`}
                  onClick={() => handleMobileTierSelect(tier)}
                >
                  <span className="mr-2 text-lg">{getTierEmoji(tier)}</span>
                  {tier} Tier
                </button>
              ))}
              <button
                type="button"
                className={`${isDark ? darkMobileTierButtonColors['Unranked'] : mobileTierButtonColors['Unranked']} ${isDark ? 'text-gray-300' : 'text-gray-700'} py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-150`}
                onClick={() => handleMobileTierSelect('Unranked')}
              >
                <span className="mr-2 text-lg">{getTierEmoji('Unranked')}</span>
                Unranked
              </button>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                className={`${isDark ? 'bg-dark-600 hover:bg-dark-500' : 'bg-gray-200 hover:bg-gray-300'} px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150`}
                onClick={() => {
                  setTouchSelectedAnime(null);
                  setShowMobileTierSelection(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {!hasAnimeToRank ? (
        <motion.div 
          className={`text-center py-16 px-4 rounded-lg ${
            isDark ? 'bg-dark-800 text-gray-300' : 'bg-white text-gray-600'
          } shadow-md`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium">No anime to rank</h3>
          <p className="mt-1 text-sm">Add some anime to your collection first.</p>
        </motion.div>
      ) : (
        <>
          {/* TierMaker style layout */}
          <div className={`space-y-1 ${isDark ? 'bg-dark-800' : 'bg-white'} p-2 rounded-lg shadow-md`}>
            {/* Header row with tier labels */}
            <div className="grid grid-cols-12 gap-1 mb-2">
              <div className={`col-span-2 ${isDark ? 'bg-dark-700' : 'bg-gray-100'} p-2 flex items-center justify-center rounded`}>
                <span className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-700'}`}>Tier</span>
              </div>
              <div className={`col-span-10 ${isDark ? 'bg-dark-700' : 'bg-gray-100'} p-2 flex items-center justify-center rounded`}>
                <span className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-700'}`}>Anime</span>
              </div>
            </div>
            
            {/* Tier rows */}
            {Object.keys(rankings).map((tier) => (
              <div 
                key={tier} 
                className="grid grid-cols-12 gap-1"
              >
                {/* Tier label */}
                <div className={`col-span-2 bg-gradient-to-r ${isDark ? darkTierColors[tier] : tierColors[tier]} p-2 flex flex-col items-center justify-center rounded shadow-sm ${isDark ? 'shadow-black/20' : ''}`}>
                  <span className="font-bold text-lg sm:text-2xl text-white">{tier}</span>
                  <span className="text-lg sm:text-xl text-white">{getTierEmoji(tier)}</span>
                </div>
                
                {/* Tier content */}
                <div 
                  className={`col-span-10 min-h-[80px] p-2 rounded flex flex-wrap gap-1 ${
                    isDraggingOver === tier 
                      ? (isDark ? 'bg-indigo-900/30 border-2 border-indigo-700' : 'bg-indigo-50 border-2 border-indigo-200') 
                      : (isDark ? 'bg-dark-700 border border-dark-600' : 'bg-gray-50 border border-gray-200')
                  }`}
                  onDragOver={(e) => handleDragOver(e, tier)}
                  onDragLeave={() => setIsDraggingOver(null)}
                  onDrop={(e) => handleDrop(e, tier)}
                >
                  {rankings[tier].length === 0 ? (
                    <div className={`w-full h-full flex items-center justify-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      <p className="text-sm">Drop anime here</p>
                    </div>
                  ) : (
                    <>
                      {rankings[tier].map((anime) => (
                        <div 
                          key={anime.id}
                          draggable
                          className={`anime-item px-2 py-1 rounded ${
                            isDark 
                              ? 'bg-dark-600 hover:bg-dark-500 text-white border border-dark-500' 
                              : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200'
                          } cursor-grab shadow-sm hover:shadow-md transition-all flex items-center group`}
                          onDragStart={(e) => handleDragStart(e, anime)}
                          onDragEnd={handleDragEnd}
                          onClick={() => handleTouchStart(anime)}
                        >
                          <div className="flex-shrink-0 mr-2 w-5 h-5 overflow-hidden rounded">
                            {anime.imageUrl ? (
                              <img 
                                src={anime.imageUrl} 
                                alt={anime.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/50?text=?';
                                }}
                              />
                            ) : (
                              <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-dark-500' : 'bg-gray-200'}`}>
                                <span className="text-xs">?</span>
                              </div>
                            )}
                          </div>
                          <span className="truncate max-w-[120px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-none">
                            {anime.title}
                          </span>
                          <button
                            className={`ml-1 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReturnToUnranked(anime, tier);
                            }}
                            title="Remove from tier"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            ))}
            
            {/* Unranked section */}
            <div className="mt-4">
              <div className={`p-2 ${isDark ? 'bg-dark-700' : 'bg-gray-100'} rounded-t flex items-center`}>
                <span className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-700'}`}>Unranked Anime</span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">{unrankedAnime.length}</span>
              </div>
              <div 
                className={`p-2 min-h-[100px] rounded-b flex flex-wrap gap-1 ${isDark ? 'bg-dark-700 border border-dark-600' : 'bg-gray-50 border border-gray-200'}`}
              >
                {unrankedAnime.length === 0 ? (
                  <div className={`w-full h-full flex items-center justify-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    <p className="text-sm">No unranked anime</p>
                  </div>
                ) : (
                  <>
                    {unrankedAnime.map((anime) => (
                      <div 
                        key={anime.id}
                        draggable
                        className={`anime-item px-2 py-1 rounded ${
                          isDark 
                            ? 'bg-dark-600 hover:bg-dark-500 text-white border border-dark-500' 
                            : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200'
                        } cursor-grab shadow-sm hover:shadow-md transition-all flex items-center`}
                        onDragStart={(e) => handleDragStart(e, anime)}
                        onDragEnd={handleDragEnd}
                        onClick={() => handleTouchStart(anime)}
                      >
                        <div className="flex-shrink-0 mr-2 w-5 h-5 overflow-hidden rounded">
                          {anime.imageUrl ? (
                            <img 
                              src={anime.imageUrl} 
                              alt={anime.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/50?text=?';
                              }}
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-dark-500' : 'bg-gray-200'}`}>
                              <span className="text-xs">?</span>
                            </div>
                          )}
                        </div>
                        <span className="truncate max-w-[120px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-none">
                          {anime.title}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
            
            {/* Ranking explanation */}
            <motion.div 
              className={`mt-6 p-3 rounded ${isDark ? 'bg-dark-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h4 className="font-bold mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Tier Ranking Guide:
              </h4>
              <ul className={`ml-5 list-disc space-y-1 ${isDark ? 'text-gray-400' : ''}`}>
                <li><span className="font-semibold">S Tier</span> - Masterpieces, absolute favorites</li>
                <li><span className="font-semibold">A Tier</span> - Excellent anime, highly recommended</li>
                <li><span className="font-semibold">B Tier</span> - Good anime, worth watching</li>
                <li><span className="font-semibold">C Tier</span> - Average, has some redeeming qualities</li>
                <li><span className="font-semibold">D Tier</span> - Below average, not recommended</li>
              </ul>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default RankingPage; 