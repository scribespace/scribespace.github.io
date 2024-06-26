import { Icon } from "@/components";
import { CSSProperties } from "react";
import { IconType } from "react-icons";
import { FaAngleRight } from "react-icons/fa";

import "./css/menuTheme.css";
import { CSSTheme } from "@utils";

export interface MenuTheme {
  containerDefault: CSSTheme;
  itemDefault: CSSTheme;
  itemSelected: CSSTheme;
  itemDisabled: CSSTheme;
  itemIcon: CSSTheme;
  submenuIcon: CSSTheme;
  itemIconSize: string;

  SubmenuIcon: IconType;
}

export const MENU_THEME_DEFAULT: MenuTheme = {
  containerDefault: "menu-container-default",
  itemDefault: "menu-item-default",
  itemSelected: "menu-item-selected-default",
  itemDisabled: "menu-item-disabled-default",
  itemIcon: "menu-item-icon-default",
  submenuIcon: "menu-item-submenu-icon-default",
  itemIconSize: "",

  SubmenuIcon: Icon(FaAngleRight),
};

export const $menuItemParent: CSSProperties = {
  alignContent: "center",
  display: "flex",
  alignItems: "center",
  height: "100%",
  position: "relative",
};
