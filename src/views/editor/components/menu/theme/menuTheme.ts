import { EditorThemeClassName } from "lexical";
import { IconType } from "react-icons";


export interface MenuTheme {
    menuFloat?: EditorThemeClassName;
    menuContainer?: EditorThemeClassName;
    menuItem?: EditorThemeClassName;
    menuItemIcon?: EditorThemeClassName;
    menuItemSubmenuIcon?: EditorThemeClassName;

    SubmenuIcon?: IconType;
}
