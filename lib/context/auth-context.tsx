/**
 * Authentication Context Provider
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, apiClient } from '@/lib/api';
import type { User, LoginRequest, RegisterRequest } from '@/lib/api/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const token = apiClient.getToken();
      if (!token) {
        setUser(null);
        return;
      }

      const userData = await authAPI.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
      apiClient.setToken(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = async (credentials: LoginRequest) => {
    const response = await authAPI.login(credentials);
    apiClient.setToken(response.access_token);
    
    // Store refresh token
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', response.refresh_token);
    }
    
    setUser(response.user);
  };

  const register = async (data: RegisterRequest) => {
    const response = await authAPI.register(data);
    apiClient.setToken(response.access_token);
    
    // Store refresh token
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', response.refresh_token);
    }
    
    setUser(response.user);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      apiClient.setToken(null);
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('refresh_token');
      }
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    setUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
