// Rôle : État partagé de l’application.
// CartContext : etat du panier.
import { useState, useEffect, useCallback } from 'react';

import { CartContext } from './cart-context';

export const CartProvider = ({ children }) => {
  // Charger le panier depuis localStorage au démarrage
  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('floresia-cart') || '[]');
      return Array.isArray(saved) ? saved.filter(item =>
        item && (typeof item.id === 'string' || Number.isSafeInteger(item.id)) && Number.isFinite(item.price) &&
        item.price >= 0 && Number.isInteger(item.quantity) && item.quantity > 0
      ).map(item => ({ ...item, id: String(item.id) })) : [];
    } catch {
      return [];
    }
  });

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('floresia-cart', JSON.stringify(cart));
  }, [cart]);

  // Ajouter un produit au panier
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Si le produit existe déjà, augmenter la quantité
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Sinon, ajouter le nouveau produit
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  // Retirer un produit du panier
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Mettre à jour la quantité d'un produit
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Vider le panier
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Calculer le nombre total d'articles
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculer le prix total
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Vérifier si un produit est dans le panier
  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};