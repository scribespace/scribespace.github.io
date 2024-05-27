import { EditorThemeClassName } from "lexical";

export interface ImageTheme {
    element: EditorThemeClassName;
    selected: EditorThemeClassName;
}

export const IMAGE_THEME_DEFAULT: ImageTheme = {
    element: 'image-element-default',
    selected: 'image-selected-default',
};