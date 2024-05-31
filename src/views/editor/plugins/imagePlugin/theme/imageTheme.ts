import { EditorThemeClassName } from "lexical";

export interface ImageControlTheme {
    anchorSize: number;
    anchor: EditorThemeClassName;
    marker: EditorThemeClassName;
}

export const IMAGE_CONTROL_THEME_DEFAULT: ImageControlTheme = {
    anchorSize: 10,
    anchor: 'image-control-anchor-default',
    marker: 'image-control-marker-default',
};

export interface ImageTheme {
    element: EditorThemeClassName;
    selected: EditorThemeClassName;    
    control: ImageControlTheme;
}

export const IMAGE_THEME_DEFAULT: ImageTheme = {
    element: 'image-element-default',
    selected: 'image-selected-default',
    control: IMAGE_CONTROL_THEME_DEFAULT,
};