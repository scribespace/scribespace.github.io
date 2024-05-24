import { EditorThemeClassName } from "lexical";
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
