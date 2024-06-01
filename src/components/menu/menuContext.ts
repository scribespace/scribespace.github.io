import { createContext, useContext } from "react";
import { MenuTheme } from "./theme";
import { MENU_THEME_DEFAULT } from "./theme/menuTheme";


export interface MenuContextData< T extends MenuTheme = MenuTheme> {
    theme: T;
    layout: 'to-the-side' | 'below';
}

export const MENU_CONTEXT_DATA_DEFAULT: MenuContextData = { theme: MENU_THEME_DEFAULT, layout: 'to-the-side' };
export const MenuContext = createContext(MENU_CONTEXT_DATA_DEFAULT);
export function useMenuContext() { return useContext(MenuContext); }
