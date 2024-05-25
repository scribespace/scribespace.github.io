import { EmptyComponent } from "@/components";
import { EditorThemeClassName } from "lexical";
import { CSSProperties } from "react";
import { IconType } from "react-icons";


export interface MenuTheme {
    float: EditorThemeClassName;
    container: EditorThemeClassName;
    item: EditorThemeClassName;
    itemSelected: EditorThemeClassName;
    itemDisabled: EditorThemeClassName;
    itemIcon: EditorThemeClassName;
    submenuIcon: EditorThemeClassName;
    itemIconSize: string;

    SubmenuIcon: IconType;
}

export const MENU_THEME_EMPTY: MenuTheme = {
    float: '',
    container: '',
    item: '',
    itemSelected: '',
    itemDisabled: '',
    itemIcon: '',
    submenuIcon: '',
    itemIconSize: '',

    SubmenuIcon: EmptyComponent,
};

export const $menuItemParent: CSSProperties = {alignContent: 'center', display: 'flex', alignItems: "stretch", position: "relative"};