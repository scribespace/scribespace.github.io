import { MENU_THEME_DEFAULT, MenuTheme } from "@/components/menu/theme";
import { EditorThemeClassName } from "lexical";

export interface ContextMenuMenuTheme extends MenuTheme {
    editorContainer: EditorThemeClassName;
    menuLabel: EditorThemeClassName;
}

export interface ContextMenuTheme {
    menuTheme: ContextMenuMenuTheme;
}

export const CONTEXT_MENU_MENU_THEME_DEFAULT: ContextMenuMenuTheme = {
    ...MENU_THEME_DEFAULT,
    editorContainer: 'context-menu-editor-container-default',
    menuLabel: 'context-menu-label-defualt',

    containerDefault: MENU_THEME_DEFAULT.containerDefault + ' context-menu-container-default',
    itemDefault: MENU_THEME_DEFAULT.itemDefault + ' context-menu-item-default',
    itemIcon: MENU_THEME_DEFAULT.itemIcon + ' context-menu-item-icon-default',
};

export const CONTEXT_MENU_THEME_DEFAULT: ContextMenuTheme = {
    menuTheme: CONTEXT_MENU_MENU_THEME_DEFAULT,
};
