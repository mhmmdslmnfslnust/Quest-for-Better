import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('habitquest_token'));

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('habitquest_token');
      if (savedToken) {
        try {
          const response = await authAPI.verifyToken();
          // The response should already be the data due to our API interceptor fix
          if (response && response.user) {
            setUser(response.user);
            setToken(savedToken);
          } else {
            localStorage.removeItem('habitquest_token');
            setToken(null);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('habitquest_token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.login(email, password);
      
      // The response should already be the data due to our API interceptor fix
      if (response && response.user && response.token) {
        const { user: userData, token: userToken } = response;
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('habitquest_token', userToken);
        toast.success('Welcome back! 🎉');
        return { success: true };
      } else {
        toast.error('Login failed - Invalid response format');
        return { success: false, message: 'Invalid response format' };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      // The response should already be the data due to our API interceptor fix
      if (response && response.user && response.token) {
        const { user: newUser, token: userToken } = response;
        setUser(newUser);
        setToken(userToken);
        localStorage.setItem('habitquest_token', userToken);
        toast.success('Welcome to HabitQuest! 🚀');
        return { success: true };
      } else {
        toast.error('Registration failed - Invalid response format');
        return { success: false, message: 'Invalid response format' };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('habitquest_token');
    toast.success('Logged out successfully');
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    updateUser,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
