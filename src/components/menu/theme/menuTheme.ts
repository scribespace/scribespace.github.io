import { Icon } from "@/components";
import { EditorThemeClassName } from "lexical";
import { CSSProperties } from "react";
import { IconType } from "react-icons";
import { FaAngleRight } from "react-icons/fa";

import './css/menuTheme.css';

export interface MenuTheme {
    containerDefault: EditorThemeClassName;
    itemDefault: EditorThemeClassName;
    itemSelected: EditorThemeClassName;
    itemDisabled: EditorThemeClassName;
    itemIcon: EditorThemeClassName;
    submenuIcon: EditorThemeClassName;
    itemIconSize: string;

    SubmenuIcon: IconType;
}

export const MENU_THEME_DEFAULT: MenuTheme = {
    containerDefault: 'menu-container-default',
    itemDefault: 'menu-item-default',
    itemSelected: 'menu-item-selected-default',
    itemDisabled: 'menu-item-disabled-default',
    itemIcon: 'menu-item-icon-default',
    submenuIcon: 'menu-item-submenu-icon-default',
    itemIconSize: '',

    SubmenuIcon: Icon( FaAngleRight ),
};

export const $menuItemParent: CSSProperties = {alignContent: 'center', display: 'flex', alignItems: "stretch", position: "relative"};