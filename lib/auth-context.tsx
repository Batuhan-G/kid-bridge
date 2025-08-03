'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, User } from './api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with true - check auth on load
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const router = useRouter();

  const isAuthenticated = api.isAuthenticated() && user !== null;
  

  const checkAuth = async () => {
    try {
      if (!api.isAuthenticated()) {
        setUser(null);
        setHasCheckedAuth(true);
        setIsLoading(false);
        return;
      }

      const response = await api.getProfile();
      
      if (response.data) {
        setUser(response.data);
      } else {
        setUser(null);
        // If profile fetch failed, remove invalid token
        api.logout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      // If there's an error, remove potentially invalid token
      api.logout();
    } finally {
      setHasCheckedAuth(true);
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await api.login(email, password);
      
      if (response.data) {
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Giriş başarısız oldu' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Beklenmeyen bir hata oluştu' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await api.register(userData);
      
      if (response.data) {
        // After successful registration, automatically login
        const loginResponse = await api.login(userData.email, userData.password);
        if (loginResponse.data) {
          setUser(loginResponse.data.user);
          return { success: true };
        }
        return { success: false, error: 'Kayıt başarılı ancak giriş yapılamadı' };
      } else {
        return { success: false, error: response.error || 'Kayıt başarısız oldu' };
      }
    } catch (error) {
      return { success: false, error: 'Beklenmeyen bir hata oluştu' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setHasCheckedAuth(false); // Reset auth check flag
    router.push('/');
  };

  useEffect(() => {
    if (!hasCheckedAuth) {
      checkAuth();
    }
  }, [hasCheckedAuth]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}