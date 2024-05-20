import { MenuContextData, MenuTheme } from "../../components/menu/menu";
import { EditorThemeClassName } from "lexical";
import { FaAngleRight } from "react-icons/fa";
import { TABLE_MENU_THEME_DEFAULT, TableMenuTheme } from "../../components/table/tableMenuTheme";

export interface ContextMenuTheme extends MenuTheme {
    contextMenuEditorContainer?: EditorThemeClassName;

    tableMenuTheme?: TableMenuTheme;
}

export const CONTEXT_MENU_DEFAULT_THEME: ContextMenuTheme = {
    menuFloat: 'context-menu-float',
    menuContainer: 'context-menu-container-default',
    menuItem: 'context-menu-item-default',
    menuItemIcon: 'context-menu-item-icon-default',
    menuItemSubmenuIcon: 'context-menu-item-submenu-icon-default',
    
    contextMenuEditorContainer: 'context-menu-editor-container-default',
    
    SubmenuIcon: FaAngleRight,

    tableMenuTheme: TABLE_MENU_THEME_DEFAULT
};

export interface ContextMenuContextData extends MenuContextData {
    theme: ContextMenuTheme;
    mousePosition: { x: number; y: number; };
    closeMenu: () => void;
}
export const CONTEXT_MENU_CONTEX_DEFAULT = { theme: CONTEXT_MENU_DEFAULT_THEME, mousePosition: { x: -1, y: -1 }, closeMenu: () => { } } as ContextMenuContextData;
