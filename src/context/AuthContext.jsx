import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

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
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken =
      localStorage.getItem('floresia-token') ||
      sessionStorage.getItem('floresia-token');

    if (!savedToken) {
      setIsLoading(false);
      return;
    }

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
  }, []);

  const login = async (email, password, rememberMe = true) => {
    try {
      const data = await authApi.login({ email, password });

      if (rememberMe) {
        localStorage.setItem('floresia-token', data.token);
        localStorage.setItem('floresia-remembered-email', email);
      } else {
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