import { Icon } from "@/components";
import { CSSTheme } from "@utils";
import { IconType } from "react-icons";
import { MdFormatColorText, MdOutlineFormatColorFill } from "react-icons/md";

export interface ColorMenuTheme {
  colorPickerContainer: CSSTheme;

  ColorTextIcon: IconType;
  ColorBackgroundIcon: IconType;
}
export const COLOR_MENU_THEME_DEFAULT: ColorMenuTheme = {
  colorPickerContainer: "color-picker-container-default",
  ColorTextIcon: Icon(MdFormatColorText),
  ColorBackgroundIcon: Icon(MdOutlineFormatColorFill),
};
