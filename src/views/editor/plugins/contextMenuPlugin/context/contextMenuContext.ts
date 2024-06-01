import { useContext } from "react";
import { CONTEXT_MENU_MENU_THEME_DEFAULT, ContextMenuMenuTheme } from "../theme";
import { MenuContextData, MenuContext } from "@/components/menu/menuContext";

export interface ContextMenuContextData extends MenuContextData<ContextMenuMenuTheme> {
    mousePosition: { x: number; y: number; };
}
export const CONTEXT_MENU_CONTEX_DEFAULT: ContextMenuContextData = { theme: CONTEXT_MENU_MENU_THEME_DEFAULT, layout: 'to-the-side', mousePosition: { x: -1, y: -1 } };

export function useContextMenuContext() {     
    return useContext(MenuContext) as ContextMenuContextData;     
}

