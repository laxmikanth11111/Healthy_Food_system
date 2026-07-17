import React, { createContext, useState, useEffect, useContext } from 'react';
import { couponAPI } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('cart');
    return localData ? JSON.parse(localData) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (food, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.food.id === food.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.food.id === food.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { food, quantity }];
    });
  };

  const removeFromCart = (foodId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.food.id !== foodId));
  };

  const updateQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.food.id === foodId ? { ...item, quantity } : item
      )
    );
  };

  const applyCoupon = async (code) => {
    if (!code || code.trim() === '') {
      setCouponError('Please enter a coupon code.');
      return false;
    }
    setCouponLoading(true);
    setCouponError('');
    try {
      const response = await couponAPI.validateCoupon(code);
      setAppliedCoupon(response.data);
      return true;
    } catch (error) {
      console.error('Coupon validation failed:', error);
      setAppliedCoupon(null);
      setCouponError(error.response?.data?.message || 'Invalid coupon code');
      return false;
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setCouponError('');
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.food.price * item.quantity, 0);
  };

  const getDiscount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = getSubtotal();
    let discount = subtotal * (appliedCoupon.discountPercentage / 100);
    if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
      discount = appliedCoupon.maxDiscount;
    }
    return Math.round(discount * 100) / 100;
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const discount = getDiscount();
    return Math.round((subtotal - discount) * 100) / 100;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal: getSubtotal(),
        discount: getDiscount(),
        total: getTotal(),
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        couponError,
        couponLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
