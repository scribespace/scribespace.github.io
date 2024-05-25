import { EditorThemeClassName } from "lexical";
import { FaAngleDown } from "react-icons/fa";
import { MenuTheme } from "@editor/components/menu/theme";
import { Icon } from "@/components/icon";

export interface ToolbarMenuTheme extends MenuTheme {
    fontFamily: EditorThemeClassName;
    horizontalContainer: EditorThemeClassName;
}

export interface ToolbarTheme {
    container: EditorThemeClassName;
    menuTheme: ToolbarMenuTheme;
}

export const TOOLBAR_MENU_THEME_DEFAULT: ToolbarMenuTheme = {
    containerDefault: 'toolbar-menu-container-default',
    itemDefault: 'toolbar-menu-item-default',
    itemSelected: 'toolbar-menu-item-selected-default',
    itemDisabled: 'toolbar-menu-item-disabled-default',
    itemIcon: 'toolbar-menu-item-icon-default',
    submenuIcon: 'toolbar-menu-item-submenu-icon-default',

    itemIconSize: '21px',

    SubmenuIcon: Icon( FaAngleDown ),

    fontFamily: 'toolbar-menu-font-family-default',
    horizontalContainer: 'toolbar-menu-container-default toolbar-menu-horizontal-container-default',
};

export const TOOLBAR_THEME_DEFAULT: ToolbarTheme = {
    container: 'toolbar-container-default',
    menuTheme: TOOLBAR_MENU_THEME_DEFAULT,
};
