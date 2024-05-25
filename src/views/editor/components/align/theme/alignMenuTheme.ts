import { Icon } from "@/components";
import { IconType } from "react-icons";
import { ImParagraphLeft, ImParagraphCenter, ImParagraphRight, ImParagraphJustify } from "react-icons/im";

export interface AlignMenuTheme {
    AlignLeftIcon: IconType;
    AlignCenterIcon: IconType;
    AlignRightIcon: IconType;
    AlignJustifyIcon: IconType;
}
export const ALIGN_MENU_THEME_DEFAULT: AlignMenuTheme = {
        AlignLeftIcon: Icon( ImParagraphLeft ),
        AlignCenterIcon: Icon( ImParagraphCenter ),
        AlignRightIcon: Icon( ImParagraphRight ),
        AlignJustifyIcon: Icon( ImParagraphJustify ),
};