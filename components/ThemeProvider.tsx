"use client";

import { createContext, useContext } from "react";

type Theme = "light" | "dark" | "system";

const ThemeContext = createContext<Theme>("system");

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: Theme;
  children: React.ReactNode;
}) {
  return (
    <ThemeContext.Provider value={initialTheme}>
      {children}
    </ThemeContext.Provider>
  );
}
