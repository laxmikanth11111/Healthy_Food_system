import React, { createContext, useState, useEffect, useContext } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync favorites on authentication state change
  useEffect(() => {
    const fetchFavorites = async () => {
      if (isAuthenticated) {
        setLoading(true);
        try {
          const response = await userAPI.getFavorites();
          setFavorites(response.data);
        } catch (error) {
          console.error('Failed to load favorites:', error);
        } finally {
          setLoading(false);
        }
      } else {
        const localData = localStorage.getItem('favorites');
        setFavorites(localData ? JSON.parse(localData) : []);
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  const isFavorite = (foodId) => {
    return favorites.some((item) => item.id === foodId);
  };

  const toggleFavorite = async (food) => {
    const foodId = food.id;
    const isFav = isFavorite(foodId);

    if (isAuthenticated) {
      try {
        if (isFav) {
          await userAPI.removeFavorite(foodId);
          setFavorites((prev) => prev.filter((item) => item.id !== foodId));
        } else {
          await userAPI.addFavorite(foodId);
          setFavorites((prev) => [...prev, food]);
        }
      } catch (error) {
        console.error('Error toggling wishlist item:', error);
      }
    } else {
      // Guest local storage wishlist
      let updated;
      if (isFav) {
        updated = favorites.filter((item) => item.id !== foodId);
      } else {
        updated = [...favorites, food];
      }
      setFavorites(updated);
      localStorage.setItem('favorites', JSON.stringify(updated));
    }
  };

  return (
    <WishlistContext.Provider value={{ favorites, isFavorite, toggleFavorite, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
