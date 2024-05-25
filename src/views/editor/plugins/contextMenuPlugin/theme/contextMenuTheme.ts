import { EditorThemeClassName } from "lexical";
import { FaAngleRight } from "react-icons/fa";
import { MenuTheme } from "@editor/components/menu/theme";
import { Icon } from "@/components/icon";

export interface ContextMenuMenuTheme extends MenuTheme {
    editorContainer: EditorThemeClassName;
}

export interface ContextMenuTheme {
    menuTheme: ContextMenuMenuTheme;
}

export const CONTEXT_MENU_MENU_THEME_DEFAULT: ContextMenuMenuTheme = {
    editorContainer: 'context-menu-editor-container-default',

    float: 'context-menu-float',
    container: 'context-menu-container-default',
    item: 'context-menu-item-default',
    itemSelected: 'context-menu-item-selected-default',
    itemDisabled: 'context-menu-item-disabled-default',
    itemIcon: 'context-menu-item-icon-default',
    submenuIcon: 'context-menu-item-submenu-icon-default',

    itemIconSize: '',

    SubmenuIcon: Icon( FaAngleRight ),
};

export const CONTEXT_MENU_THEME_DEFAULT: ContextMenuTheme = {
    menuTheme: CONTEXT_MENU_MENU_THEME_DEFAULT,
};
