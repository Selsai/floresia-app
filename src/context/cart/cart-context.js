// cart-context : gestion du panier.
import { createContext, useContext } from 'react';
export const CartContext = createContext();
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart doit être utilisé dans CartProvider.');
  return context;
};
