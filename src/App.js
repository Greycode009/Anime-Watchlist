import React, { useState, useEffect, useContext, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AnimeProvider, AnimeContext } from './context/AnimeContext';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import Navbar from './components/Navbar';
import AnimeForm from './components/AnimeForm';
import AnimeList from './components/AnimeList';
import RankingPage from './components/RankingPage';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Wrapper component to access context
const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('collection');
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [showAddForm, setShowAddForm] = useState(false);
  const { animeList } = useContext(AnimeContext);
  const { theme } = useContext(ThemeContext);
  const formRef = useRef(null);
  
  // Force refresh when animeList changes
  useEffect(() => {
    setRefreshKey(Date.now());
  }, [animeList.length]);
  
  const handleForceRefresh = () => {
    setRefreshKey(Date.now());
  };

  const handleShowAddForm = () => {
    setCurrentPage('collection');
    setShowAddForm(true);
    
    // Scroll to the form after a short delay to ensure it's visible
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
        formRef.current.focus();
      }
    }, 100);
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Navbar onAddAnimeClick={handleShowAddForm} />
      <main className="container mx-auto px-4 py-6 sm:py-8 flex-grow mt-16 sm:mt-20">
        <h2 className={`text-2xl font-bold mb-6 anime-title anime-gradient-text pt-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Your Anime Collection
        </h2>
        
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />

        <AnimatePresence mode="wait">
          {currentPage === 'collection' ? (
            <motion.div
              key={`collection-${refreshKey}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div ref={formRef} tabIndex={-1}>
                <AnimeForm 
                  onAnimeAdded={handleForceRefresh} 
                  expanded={showAddForm} 
                  onExpandedChange={setShowAddForm}
                />
              </div>
              <AnimeList key={`list-${refreshKey}`} />
            </motion.div>
          ) : (
            <motion.div
              key={`ranking-${refreshKey}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <RankingPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AnimeProvider>
        <AppContent />
      </AnimeProvider>
    </ThemeProvider>
  );
}

export default App;
