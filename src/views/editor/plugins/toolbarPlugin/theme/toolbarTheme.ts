import { EditorThemeClassName } from "lexical";
import { FaAngleDown } from "react-icons/fa";
import { Icon } from "@/components";
import { MENU_THEME_DEFAULT, MenuTheme } from "@/components/menu/theme";

export interface ToolbarMenuTheme extends MenuTheme {
  fontFamily: EditorThemeClassName;
  horizontalContainer: EditorThemeClassName;
}

export interface ToolbarTheme {
  container: EditorThemeClassName;
  menuTheme: ToolbarMenuTheme;
}

export const TOOLBAR_MENU_THEME_DEFAULT: ToolbarMenuTheme = {
  ...MENU_THEME_DEFAULT,
  containerDefault:
    MENU_THEME_DEFAULT.containerDefault + " toolbar-menu-container-default",
  itemDefault: MENU_THEME_DEFAULT.itemDefault + " toolbar-menu-item-default",

  itemIconSize: "21px",

  SubmenuIcon: Icon(FaAngleDown),

  fontFamily: "toolbar-menu-font-family-default",
  horizontalContainer:
    MENU_THEME_DEFAULT.containerDefault +
    " toolbar-menu-container-default toolbar-menu-horizontal-container-default",
};

export const TOOLBAR_THEME_DEFAULT: ToolbarTheme = {
  container: "toolbar-container-default",
  menuTheme: TOOLBAR_MENU_THEME_DEFAULT,
};
