import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { PaletteMode } from "@mui/material";

interface ThemeContexteType {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContexteType | undefined>(undefined);

const THEME_KEY = "roulette_theme_preference";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    return (savedTheme as PaletteMode) || "light";
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
