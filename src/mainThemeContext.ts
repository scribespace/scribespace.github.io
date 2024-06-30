import { createContext, useContext } from "react";
import { MAIN_THEME_DEFAULT, MainTheme } from "./theme";

export const MainThemeContext = createContext<MainTheme>(MAIN_THEME_DEFAULT);
export function useMainThemeContext() {
  return useContext(MainThemeContext);
}
