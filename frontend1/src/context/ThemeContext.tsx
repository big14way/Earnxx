import React, { createContext, useContext, ReactNode } from 'react';
import { useDarkMode, DarkModeHook } from '../hooks/useDarkMode';

interface ThemeContextType extends DarkModeHook {}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const darkModeHook = useDarkMode();
  
  return (
    <ThemeContext.Provider value={darkModeHook}>
      {children}
    </ThemeContext.Provider>
  );
};