import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'weather_favorites';
const RECENT_KEY = 'weather_recent';
const MAX_RECENT = 5;

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(STORAGE_KEY);
      const storedRecent = localStorage.getItem(RECENT_KEY);
      
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
      if (storedRecent) {
        setRecentSearches(JSON.parse(storedRecent));
      }
    } catch (e) {
      console.warn('Failed to load from localStorage');
    }
  }, []);

  const addToRecent = useCallback((city: string) => {
    setRecentSearches(prev => {
      const normalized = city.trim();
      const filtered = prev.filter(c => c.toLowerCase() !== normalized.toLowerCase());
      const updated = [normalized, ...filtered].slice(0, MAX_RECENT);
      
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save to localStorage');
      }
      
      return updated;
    });
  }, []);

  const toggleFavorite = useCallback((city: string) => {
    setFavorites(prev => {
      const normalized = city.trim();
      const isFavorite = prev.some(c => c.toLowerCase() === normalized.toLowerCase());
      
      const updated = isFavorite
        ? prev.filter(c => c.toLowerCase() !== normalized.toLowerCase())
        : [...prev, normalized];
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save to localStorage');
      }
      
      return updated;
    });
  }, []);

  const isFavorite = useCallback((city: string) => {
    return favorites.some(c => c.toLowerCase() === city.toLowerCase());
  }, [favorites]);

  const removeFromRecent = useCallback((city: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(c => c.toLowerCase() !== city.toLowerCase());
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save to localStorage');
      }
      return updated;
    });
  }, []);

  return {
    favorites,
    recentSearches,
    addToRecent,
    toggleFavorite,
    isFavorite,
    removeFromRecent,
  };
}
