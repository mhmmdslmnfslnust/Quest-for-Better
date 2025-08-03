import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const themes = {
  default: {
    name: 'Default',
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardBg: 'rgba(255, 255, 255, 0.1)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.8)',
    accent: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
  },
  dark: {
    name: 'Dark',
    primary: '#3730a3',
    secondary: '#6366f1',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    cardBg: 'rgba(255, 255, 255, 0.05)',
    textPrimary: '#f8fafc',
    textSecondary: 'rgba(248, 250, 252, 0.7)',
    accent: '#06d6a0',
    danger: '#dc2626',
    warning: '#d97706',
  },
  forest: {
    name: 'Forest',
    primary: '#059669',
    secondary: '#10b981',
    background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
    cardBg: 'rgba(255, 255, 255, 0.1)',
    textPrimary: '#ecfdf5',
    textSecondary: 'rgba(236, 253, 245, 0.8)',
    accent: '#34d399',
    danger: '#ef4444',
    warning: '#f59e0b',
  },
  ocean: {
    name: 'Ocean',
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)',
    cardBg: 'rgba(255, 255, 255, 0.1)',
    textPrimary: '#f0f9ff',
    textSecondary: 'rgba(240, 249, 255, 0.8)',
    accent: '#22d3ee',
    danger: '#ef4444',
    warning: '#f59e0b',
  },
  sunset: {
    name: 'Sunset',
    primary: '#ea580c',
    secondary: '#f97316',
    background: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)',
    cardBg: 'rgba(255, 255, 255, 0.1)',
    textPrimary: '#fff7ed',
    textSecondary: 'rgba(255, 247, 237, 0.8)',
    accent: '#fb923c',
    danger: '#dc2626',
    warning: '#d97706',
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('habitquest_theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Apply theme to document root
  useEffect(() => {
    const theme = themes[currentTheme];
    const root = document.documentElement;
    
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-danger', theme.danger);
    root.style.setProperty('--color-warning', theme.warning);
    root.style.setProperty('--color-text-primary', theme.textPrimary);
    root.style.setProperty('--color-text-secondary', theme.textSecondary);
    root.style.setProperty('--color-card-bg', theme.cardBg);
    root.style.setProperty('--background-gradient', theme.background);
    
    // Update body background
    document.body.style.background = theme.background;
  }, [currentTheme]);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('habitquest_theme', themeName);
    }
  };

  const value = {
    currentTheme,
    theme: themes[currentTheme],
    themes: Object.keys(themes),
    changeTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
