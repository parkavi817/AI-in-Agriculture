import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { user, updateUserSettings } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load preference from localStorage, user settings, or system
  useEffect(() => {
    if (user?.preferences?.theme) {
      setIsDarkMode(user.preferences.theme === 'dark');
    } else {
      const savedTheme = localStorage.getItem('krishi-theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setIsDarkMode(savedTheme === 'dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
      }
    }
  }, [user]); // Re-run when user object changes (e.g., after login/logout)

  // Apply theme to document root and persist preference
  useEffect(() => {
    const classList = document.documentElement.classList;
    if (isDarkMode) {
      classList.add('dark');
      classList.remove('light');
    } else {
      classList.remove('dark');
      classList.add('light');
    }
    // Always update localStorage for immediate effect and for unauthenticated users
    localStorage.setItem('krishi-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (user) {
      try {
        await updateUserSettings({ preferences: { theme: newMode ? 'dark' : 'light' } });
      } catch (error) {
        console.error('Failed to save theme preference to server:', error);
        // Optionally revert UI or show error to user
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
