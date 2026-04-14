import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('floresia-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Sauvegarder l'utilisateur dans localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('floresia-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('floresia-user');
    }
  }, [user]);

  const login = (email, password) => {
    // Simulation de connexion (dans un vrai projet, appel API)
    const mockUser = {
      id: 1,
      firstName: 'Sophie',
      lastName: 'Martin',
      email: email,
      phone: '06 12 34 56 78',
      memberSince: '2024',
      points: 350,
      addresses: [
        {
          id: 1,
          type: 'Domicile',
          name: 'Sophie Martin',
          street: '15 rue de la Paix',
          city: 'Paris',
          postalCode: '75002',
          phone: '06 12 34 56 78',
          isDefault: true
        }
      ],
      orders: [
        {
          id: '#FL-2026-001',
          date: '5 mars 2026',
          status: 'Livré',
          total: 45.00,
          items: [
            { name: 'Bouquet Rosa Éternelle', quantity: 1, price: 32.00 }
          ]
        },
        {
          id: '#FL-2026-002',
          date: '28 février 2026',
          status: 'En cours',
          total: 52.00,
          items: [
            { name: 'Jardin de Pivoines', quantity: 1, price: 52.00 }
          ]
        }
      ],
      wishlist: []
    };

    setUser(mockUser);
    return { success: true, user: mockUser };
  };

  const register = (userData) => {
    // Simulation d'inscription (dans un vrai projet, appel API)
    const newUser = {
      id: Date.now(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone || '',
      memberSince: new Date().getFullYear().toString(),
      points: 0,
      addresses: [],
      orders: [],
      wishlist: []
    };

    setUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const addToWishlist = (productId) => {
    setUser(prev => ({
      ...prev,
      wishlist: [...prev.wishlist, productId]
    }));
  };

  const removeFromWishlist = (productId) => {
    setUser(prev => ({
      ...prev,
      wishlist: prev.wishlist.filter(id => id !== productId)
    }));
  };

  const isInWishlist = (productId) => {
    return user?.wishlist?.includes(productId) || false;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};