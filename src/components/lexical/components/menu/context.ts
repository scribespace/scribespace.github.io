import { createContext, useContext } from "react";
import { MenuTheme } from "./theme";


export interface MenuContextData {
    theme?: MenuTheme;
    closeMenu?: () => void;
}

export const MenuContext = createContext({});
export function getMenuContext() { return useContext(MenuContext); }
