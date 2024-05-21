import { MenuTheme } from "../../../components/menu/theme/menuTheme";
import { EditorThemeClassName } from "lexical";
import { FaAngleRight } from "react-icons/fa";
import { TABLE_MENU_THEME_DEFAULT, TableMenuTheme } from "../../../components/table/themes/tableMenuTheme";


export interface ContextMenuTheme extends MenuTheme {
    contextMenuEditorContainer?: EditorThemeClassName;

    tableMenuTheme?: TableMenuTheme;
}

export const CONTEXT_MENU_THEME_DEFAULT: ContextMenuTheme = {
    menuFloat: 'context-menu-float',
    menuContainer: 'context-menu-container-default',
    menuItem: 'context-menu-item-default',
    menuItemIcon: 'context-menu-item-icon-default',
    menuItemSubmenuIcon: 'context-menu-item-submenu-icon-default',

    contextMenuEditorContainer: 'context-menu-editor-container-default',

    SubmenuIcon: FaAngleRight,

    tableMenuTheme: TABLE_MENU_THEME_DEFAULT
};
