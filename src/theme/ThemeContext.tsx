import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeConfig } from './types';
import { defaultTheme } from './defaultTheme';

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
  resetTheme: () => void;
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

const applyThemeVariables = (theme: ThemeConfig) => {
  const root = document.documentElement;
  
  if (theme.colors) {
    const colors = theme.colors;
    if (colors.background) root.style.setProperty('--theme-bg', colors.background);
    if (colors.surface) root.style.setProperty('--theme-surface', colors.surface);
    if (colors.primary) root.style.setProperty('--theme-primary', colors.primary);
    if (colors.secondary) root.style.setProperty('--theme-secondary', colors.secondary);
    if (colors.accent) root.style.setProperty('--theme-accent', colors.accent);
    if (colors.textPrimary) root.style.setProperty('--theme-text', colors.textPrimary);
    if (colors.textSecondary) root.style.setProperty('--theme-text-2', colors.textSecondary);
    if (colors.gradientFrom && colors.gradientTo) {
      root.style.setProperty('--theme-gradient', `linear-gradient(135deg, ${colors.gradientFrom}, ${colors.gradientTo})`);
    }
  }
  
  if (theme.borderRadius) {
    root.style.setProperty('--theme-radius', `${theme.borderRadius}px`);
  }
  
  if (theme.fontFamily) {
    document.body.style.fontFamily = `${theme.fontFamily}, sans-serif`;
  }
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeConfig>(defaultTheme);

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedThemeId = localStorage.getItem('activeThemeId');
    if (savedThemeId) {
      // TODO: Load from Supabase when integrated
      console.log('TODO: Load theme from Supabase:', savedThemeId);
    }
    
    // Apply initial theme
    applyThemeVariables(theme);
  }, []);

  const setTheme = (newTheme: ThemeConfig) => {
    const mergedTheme = { ...defaultTheme, ...newTheme };
    setThemeState(mergedTheme);
    applyThemeVariables(mergedTheme);
    
    // Emit custom event for theme updates
    window.dispatchEvent(new CustomEvent('theme:updated', { detail: mergedTheme }));
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
    localStorage.removeItem('activeThemeId');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};