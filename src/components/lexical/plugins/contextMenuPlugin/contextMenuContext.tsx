import { useContext } from "react";
import { MenuContext, MenuContextData } from "../../components/menu/menuContext";
import { ContextMenuTheme, CONTEXT_MENU_THEME_DEFAULT } from "./theme/contextMenuTheme";

export interface ContextMenuContextData extends MenuContextData {
    theme: ContextMenuTheme;
    mousePosition: { x: number; y: number; };
    closeMenu: () => void;
}
export const CONTEXT_MENU_CONTEX_DEFAULT = { theme: CONTEXT_MENU_THEME_DEFAULT, mousePosition: { x: -1, y: -1 }, closeMenu: () => { } } as ContextMenuContextData;

export function getContextMenuContext() { return useContext(MenuContext) as ContextMenuContextData }

