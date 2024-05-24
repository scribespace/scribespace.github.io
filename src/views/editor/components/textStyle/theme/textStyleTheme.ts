import { Icon } from "@src/components/icon";
import { IconType } from "react-icons";
import { ImBold, ImItalic, ImUnderline, ImStrikethrough, ImClearFormatting } from "react-icons/im";

export interface TextStyleTheme {
    BoldIcon: IconType;
    ItalicIcon: IconType;
    UnderlineIcon: IconType;
    StrikethroughIcon: IconType;
    ClearFormattingIcon: IconType;
}

export const TEXT_STYLE_THEME_DEFAULT: TextStyleTheme = {
    BoldIcon: Icon( ImBold ),
    ItalicIcon: Icon( ImItalic ),
    UnderlineIcon: Icon( ImUnderline ),
    StrikethroughIcon: Icon( ImStrikethrough ),
    ClearFormattingIcon: Icon( ImClearFormatting ),
};