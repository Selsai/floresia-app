// Rôle : État partagé de l’application.
// AuthContext : etat de connexion.
import { useState, useEffect } from 'react';
import { authApi } from '../../services/api';

import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [savedToken] = useState(() =>
    localStorage.getItem('floresia-token') || sessionStorage.getItem('floresia-token'));
  const [isLoading, setIsLoading] = useState(Boolean(savedToken));

  useEffect(() => {
    // Restaure la session enregistrée.
    if (!savedToken) return;

    authApi
      .me(savedToken)
      .then((profile) => {
        setUser(profile);
        setToken(savedToken);
      })
      .catch(() => {
        localStorage.removeItem('floresia-token');
        sessionStorage.removeItem('floresia-token');
      })
      .finally(() => setIsLoading(false));
  }, [savedToken]);

  const login = async (email, password, rememberMe = true) => {
    // Choisit un stockage durable ou temporaire.
    try {
      const data = await authApi.login({ email, password });

      if (rememberMe) {
        sessionStorage.removeItem('floresia-token');
        localStorage.setItem('floresia-token', data.token);
        localStorage.setItem('floresia-remembered-email', email);
      } else {
        localStorage.removeItem('floresia-token');
        sessionStorage.setItem('floresia-token', data.token);
        localStorage.removeItem('floresia-remembered-email');
      }

      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    // Connecte directement le nouveau compte.
    try {
      await authApi.register({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || undefined,
      });
      return await login(userData.email, userData.password, true);
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    // Efface toutes les traces de session.
    localStorage.removeItem('floresia-token');
    sessionStorage.removeItem('floresia-token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
  };

  const getRememberedEmail = () =>
    localStorage.getItem('floresia-remembered-email') || '';

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    getRememberedEmail,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
