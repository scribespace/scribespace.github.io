import { useContext } from "react";
import { ContextMenuTheme, CONTEXT_MENU_THEME_DEFAULT } from "./theme";
import { MenuContext, MenuContextData } from "../../components/menu/context";

export interface ContextMenuContextData extends MenuContextData {
    theme: ContextMenuTheme;
    mousePosition: { x: number; y: number; };
    closeMenu: () => void;
}
export const CONTEXT_MENU_CONTEX_DEFAULT = { theme: CONTEXT_MENU_THEME_DEFAULT, mousePosition: { x: -1, y: -1 }, closeMenu: () => { } } as ContextMenuContextData;

export function useContextMenuContext() { return useContext(MenuContext) as ContextMenuContextData }

