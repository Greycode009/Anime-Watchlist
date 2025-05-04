import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AnimeContext = createContext();

export const AnimeProvider = ({ children }) => {
  const [animeList, setAnimeList] = useState(() => {
    try {
      const savedList = localStorage.getItem('animeList');
      // Ensure all anime items have string IDs for consistency
      if (savedList) {
        const parsedList = JSON.parse(savedList);
        return parsedList.map(anime => ({
          ...anime,
          id: anime.id ? String(anime.id) : String(Date.now())
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      return [];
    }
  });

  // Force refresh
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const forceRefresh = useCallback(() => {
    console.log('Force refresh triggered');
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Save to localStorage whenever animeList changes
  useEffect(() => {
    try {
      localStorage.setItem('animeList', JSON.stringify(animeList));
      console.log('Saved anime list to localStorage:', animeList);
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [animeList]);

  const addAnime = useCallback((anime) => {
    try {
      const newAnime = { 
        ...anime, 
        id: String(Date.now()), // Ensure ID is a string for consistency
        createdAt: new Date().toISOString() 
      };
      console.log('Adding anime:', newAnime);
      
      setAnimeList(prevList => {
        const newList = [...prevList, newAnime];
        return newList;
      });
      
      // Force a refresh to ensure UI updates
      setTimeout(() => forceRefresh(), 100);
      return newAnime;
    } catch (error) {
      console.error('Error adding anime:', error);
      return null;
    }
  }, [forceRefresh]);

  const updateAnime = useCallback((id, updatedData) => {
    if (!id) {
      console.error('No ID provided for update');
      return false;
    }

    const stringId = String(id);
    console.log(`Updating anime with ID "${stringId}"`, updatedData);
    
    let wasUpdated = false;
    
    setAnimeList(prevList => {
      // Log IDs for comparison and debugging
      console.log('All anime IDs:', prevList.map(a => String(a.id)));
      console.log('Looking for ID:', stringId);
      
      const updatedList = prevList.map(anime => {
        const animeId = String(anime.id);
        
        if (animeId === stringId) {
          console.log('Found matching anime to update:', anime);
          wasUpdated = true;
          
          // Create the updated anime object
          const updatedAnime = {
            ...anime,
            ...updatedData
          };
          
          console.log('Updated anime object:', updatedAnime);
          return updatedAnime;
        }
        
        return anime;
      });
      
      if (!wasUpdated) {
        console.warn(`Anime with ID ${stringId} not found for update`);
        return prevList; // Return original list if no update was made
      }
      
      console.log('Update successful, returning updated list');
      return updatedList;
    });
    
    // Force a refresh to ensure UI updates regardless of wasUpdated
    setTimeout(() => {
      console.log('Forcing refresh after update attempt');
      forceRefresh();
    }, 100);
    
    return true;
  }, [forceRefresh]);

  const deleteAnime = useCallback((id) => {
    if (!id) {
      console.error('No ID provided for deletion');
      return false;
    }
    
    const stringId = String(id);
    console.log(`Deleting anime with ID "${stringId}"`);
    
    let wasDeleted = false;
    
    setAnimeList(prevList => {
      // Log IDs for comparison
      console.log('All anime IDs before deletion:', prevList.map(a => String(a.id)));
      console.log('Looking for ID to delete:', stringId);
      
      const initialLength = prevList.length;
      const filteredList = prevList.filter(anime => {
        const keepItem = String(anime.id) !== stringId;
        if (!keepItem) {
          console.log('Found item to delete:', anime);
          wasDeleted = true;
        }
        return keepItem;
      });
      
      if (filteredList.length < initialLength) {
        console.log('Delete successful');
        return filteredList;
      } else {
        console.warn(`Anime with ID ${stringId} not found for deletion`);
        return prevList;
      }
    });
    
    // Force a refresh to ensure UI updates
    setTimeout(() => {
      console.log('Forcing refresh after delete attempt');
      forceRefresh();
    }, 100);
    
    return true;
  }, [forceRefresh]);

  return (
    <AnimeContext.Provider 
      value={{ 
        animeList, 
        addAnime, 
        updateAnime, 
        deleteAnime,
        refreshTrigger,
        forceRefresh
      }}
    >
      {children}
    </AnimeContext.Provider>
  );
}; 