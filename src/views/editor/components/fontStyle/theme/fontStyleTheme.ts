import { Icon } from "@/components/icon";
import { IconType } from "react-icons";
import { ImBold, ImClearFormatting, ImItalic, ImStrikethrough, ImUnderline } from "react-icons/im";

export interface FontStyleTheme {
    BoldIcon: IconType;
    ItalicIcon: IconType;
    UnderlineIcon: IconType;
    StrikethroughIcon: IconType;
    ClearFormattingIcon: IconType;
}

export const FONT_STYLE_THEME_DEFAULT: FontStyleTheme = {
    BoldIcon: Icon( ImBold ),
    ItalicIcon: Icon( ImItalic ),
    UnderlineIcon: Icon( ImUnderline ),
    StrikethroughIcon: Icon( ImStrikethrough ),
    ClearFormattingIcon: Icon( ImClearFormatting ),
};