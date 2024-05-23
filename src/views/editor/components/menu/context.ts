import { createContext, useContext } from "react";
import { MenuTheme } from "./theme";


export interface MenuContextData< T extends MenuTheme = MenuTheme> {
    theme?: T;
    layout: 'to-the-side' | 'below';
    closeMenu: () => void;
}

export const MENU_CONTEXT_DATA_DEFAULT: MenuContextData = { layout: 'to-the-side', closeMenu:()=>{} };
export const MenuContext = createContext(MENU_CONTEXT_DATA_DEFAULT);
export function useMenuContext() { return useContext(MenuContext); }
