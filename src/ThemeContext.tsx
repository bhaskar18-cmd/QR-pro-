import React, { createContext, useContext, useState, useEffect } from 'react';

export type UiTheme = 'clean-pro' | 'studio-dark';

export interface ThemeContextType {
  uiTheme: UiTheme;
  setUiTheme: (theme: UiTheme) => void;
  toggleUiTheme: () => void;
  isClean: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  uiTheme: 'clean-pro',
  setUiTheme: () => {},
  toggleUiTheme: () => {},
  isClean: true,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uiTheme, setUiThemeState] = useState<UiTheme>(() => {
    try {
      const saved = localStorage.getItem('qrcraft_ui_theme');
      if (saved === 'clean-pro' || saved === 'studio-dark') {
        return saved as UiTheme;
      }
    } catch {
      // ignore
    }
    // Default to the requested normal professional clean theme!
    return 'clean-pro';
  });

  const setUiTheme = (theme: UiTheme) => {
    setUiThemeState(theme);
    try {
      localStorage.setItem('qrcraft_ui_theme', theme);
    } catch {
      // ignore
    }
  };

  const toggleUiTheme = () => {
    setUiTheme(uiTheme === 'clean-pro' ? 'studio-dark' : 'clean-pro');
  };

  useEffect(() => {
    if (uiTheme === 'clean-pro') {
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    } else {
      document.body.style.backgroundColor = '#07070a';
      document.body.style.color = '#f8fafc';
    }
  }, [uiTheme]);

  const isClean = uiTheme === 'clean-pro';

  return (
    <ThemeContext.Provider value={{ uiTheme, setUiTheme, toggleUiTheme, isClean }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
