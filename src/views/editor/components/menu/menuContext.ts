import { createContext, useContext } from "react";
import { MenuTheme } from "./theme";
import { MENU_THEME_EMPTY } from "./theme/menuTheme";


export interface MenuContextData< T extends MenuTheme = MenuTheme> {
    theme: T;
    layout: 'to-the-side' | 'below';
    closeMenu: () => void;
}

export const MENU_CONTEXT_DATA_DEFAULT: MenuContextData = { theme: MENU_THEME_EMPTY, layout: 'to-the-side', closeMenu:()=>{} };
export const MenuContext = createContext(MENU_CONTEXT_DATA_DEFAULT);
export function useMenuContext() { return useContext(MenuContext); }
