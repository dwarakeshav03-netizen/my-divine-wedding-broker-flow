
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeId, THEMES } from '../utils/themeDefinitions';
import { GlobalStyleInjector } from '../components/ui/GlobalStyleInjector';
import useLocalStorage from '../hooks/useLocalStorage';

interface ThemeContextType {
  currentTheme: ThemeId;
  setTheme: (id: ThemeId) => void;
  resetTheme: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentThemeState] = useState<ThemeId>('default');
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('mdm_darkMode', false);

  useEffect(() => {
    // Load active theme
    const saved = localStorage.getItem('mdm_global_theme');
    if (saved && THEMES.some(t => t.id === saved)) {
      setCurrentThemeState(saved as ThemeId);
    }
  }, []);

  // Sync Dark Mode class to HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const setTheme = (id: ThemeId) => {
    setCurrentThemeState(id);
    localStorage.setItem('mdm_global_theme', id);
  };

  const resetTheme = () => {
    setCurrentThemeState('default');
    localStorage.removeItem('mdm_global_theme');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, resetTheme, isDarkMode, toggleDarkMode }}>
      <GlobalStyleInjector />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
