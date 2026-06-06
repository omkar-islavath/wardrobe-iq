import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // Register user
  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: err.response?.data?.error || 'Registration failed. Try again.',
      };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: err.response?.data?.error || 'Invalid credentials',
      };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Update style profile directly
  const updateStyleProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.data.success) {
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to update style profile',
      };
    }
  };

  // Upload and analyze selfie to update style profile
  const analyzeUserSelfie = async (formData) => {
    try {
      const res = await api.post('/selfie/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data.success) {
        // Refresh profile data by updating state
        setUser(prevUser => ({
          ...prevUser,
          styleProfile: res.data.styleProfile,
          profilePhoto: res.data.profilePhoto || prevUser.profilePhoto
        }));
        return { success: true, styleProfile: res.data.styleProfile };
      }
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: err.response?.data?.error || 'Selfie analysis failed',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        updateStyleProfile,
        analyzeUserSelfie,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
