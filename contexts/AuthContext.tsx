import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { updateUserSettings as updateSettingsOnServer, changePassword as changePasswordOnServer } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  farmLocation?: string;
  farmSize?: number;
  cropTypes?: string[];
  soilType?: string;
  preferences?: {
    theme?: string;
    language?: string;
    notifications?: {
      weather?: boolean;
      schemes?: boolean;
      pestAlerts?: boolean;
      priceUpdates?: boolean;
      email?: boolean;
      sms?: boolean;
    };
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  isLoading: boolean;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  updateUserSettings: (settingsData: Partial<User>) => Promise<void>;
  changePassword: (current: string, newPass: string) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('krishi-user');
    const storedToken = localStorage.getItem('krishi-token');
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem('krishi-user');
        localStorage.removeItem('krishi-token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('krishi-user', JSON.stringify(data.user));
      localStorage.setItem('krishi-token', data.token);
    } catch (error: any) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('krishi-user', JSON.stringify(data.user));
      localStorage.setItem('krishi-token', data.token);
    } catch (error: any) {
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setUser(null);
      localStorage.removeItem('krishi-user');
      localStorage.removeItem('krishi-token');
    } catch (error: any) {
      setError(error.message || 'Logout failed');
      throw error;
    }
  };

  const updateUserSettings = async (settingsData: Partial<User>) => {
    try {
      setError(null);
      const updatedUser = await updateSettingsOnServer(settingsData);
      console.log('🔁 Server returned after settings update:', updatedUser);

      if (!user) {
        setUser(updatedUser);
        localStorage.setItem('krishi-user', JSON.stringify(updatedUser));
        return;
      }

      const mergedUser: User = {
        ...user,
        ...updatedUser,
        preferences: {
          ...user.preferences,
          ...updatedUser.preferences,
          notifications: {
            ...user.preferences?.notifications,
            ...(updatedUser.preferences?.notifications || {})
          }
        }
      };

      setUser(mergedUser);
      localStorage.setItem('krishi-user', JSON.stringify(mergedUser));
    } catch (error: any) {
      setError(error.message || 'Settings update failed');
      throw error;
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    try {
      setError(null);
      const token = localStorage.getItem('krishi-token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Profile update failed');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      localStorage.setItem('krishi-user', JSON.stringify(updatedUser));
    } catch (error: any) {
      setError(error.message || 'Profile update failed');
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await changePasswordOnServer(currentPassword, newPassword);
      // Password changed successfully, no need to update user state here as it doesn't change user data
    } catch (error: any) {
      setError(error.message || 'Failed to change password');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isLoading,
    updateUserProfile,
    updateUserSettings,
    changePassword, // Add the new function to the context value
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};