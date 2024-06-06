import { Icon } from "@/components";
import { EditorThemeClassName } from "lexical";
import { IconType } from "react-icons";
import { MdFormatColorText, MdOutlineFormatColorFill } from "react-icons/md";

export interface ColorMenuTheme {
  colorPickerContainer: EditorThemeClassName;

  ColorTextIcon: IconType;
  ColorBackgroundIcon: IconType;
}
export const COLOR_MENU_THEME_DEFAULT: ColorMenuTheme = {
  colorPickerContainer: "color-picker-container-default",
  ColorTextIcon: Icon(MdFormatColorText),
  ColorBackgroundIcon: Icon(MdOutlineFormatColorFill),
};
