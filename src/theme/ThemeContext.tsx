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
    // Load theme from Supabase on mount
    const loadInitialTheme = async () => {
      const savedThemeId = localStorage.getItem('activeThemeId');
      
      // Only load saved theme if user has explicitly set one
      // For brand new sessions, start with default theme
      if (savedThemeId && savedThemeId !== 'default') {
        try {
          const { getTheme } = await import('@/lib/themeStorage');
          const themeData = await getTheme(savedThemeId);
          if (themeData) {
            const mergedTheme = { ...defaultTheme, ...themeData.config };
            setThemeState(mergedTheme);
            applyThemeVariables(mergedTheme);
            return;
          }
        } catch (error) {
          console.error('Failed to load saved theme:', error);
          localStorage.removeItem('activeThemeId');
        }
      }
      
      // Apply default theme for new sessions or if saved theme fails
      setThemeState(defaultTheme);
      applyThemeVariables(defaultTheme);
    };

    loadInitialTheme();

    // Listen for theme updates
    const handleThemeUpdate = () => {
      // Theme is already updated via setTheme, just need to refresh any UI
    };

    window.addEventListener('theme:updated', handleThemeUpdate);
    return () => window.removeEventListener('theme:updated', handleThemeUpdate);
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