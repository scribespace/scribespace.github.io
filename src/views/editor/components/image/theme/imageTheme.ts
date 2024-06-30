import { MENU_THEME_DEFAULT, MenuTheme } from "@/components/menu/theme";

import "./css/image.css";
import { CSSTheme } from "@utils";

export interface ImageControlTheme {
  anchorSize: number;
  anchor: CSSTheme;
  marker: CSSTheme;
}

export const IMAGE_CONTROL_THEME_DEFAULT: ImageControlTheme = {
  anchorSize: 10,
  anchor: "image-control-anchor-default",
  marker: "image-control-marker-default",
};

export const IMAGE_EDITOR_MENU_THEME_DEFAULT: MenuTheme = {
  ...MENU_THEME_DEFAULT,
  itemDefault:
    MENU_THEME_DEFAULT.itemDefault + " image-editor-menu-item-default",
};

export interface ImageTheme {
  element: CSSTheme;
  selected: CSSTheme;
  control: ImageControlTheme;
}

export const IMAGE_THEME_DEFAULT: ImageTheme = {
  element: "image-element-default",
  selected: "image-selected-default",
  control: IMAGE_CONTROL_THEME_DEFAULT,
};
