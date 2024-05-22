import { EditorThemeClassName } from "lexical";
import { IconType } from "react-icons";
import { HiExternalLink } from "react-icons/hi";
import { MdEdit, MdLink } from "react-icons/md";

export interface LinkTheme {
    editor?: EditorThemeClassName;
    container?: EditorThemeClassName;
    icon?: EditorThemeClassName;
    input?: EditorThemeClassName;
    button?: EditorThemeClassName;

    TextIcon?: IconType;
    LinkIcon?: IconType;
    OpenIcon?: IconType;
}

export const LINK_THEME_DEFAULT: LinkTheme = {
    editor: 'link-editor-default',
    container: 'link-input-container-default',
    icon: 'link-input-icon-default',
    input: 'link-input-text-default',
    button: 'link-input-icon-default',

    TextIcon: MdEdit,
    LinkIcon: MdLink,
    OpenIcon: HiExternalLink,
};