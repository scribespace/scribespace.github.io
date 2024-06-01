import { Icon } from "@/components";
import { MENU_THEME_DEFAULT, MenuTheme } from "@/components/menu/theme";
import { EditorThemeClassName } from "lexical";
import { IconType } from "react-icons";

import { FaArrowRotateLeft, FaArrowRotateRight, FaCropSimple } from "react-icons/fa6";
import { GiResize } from "react-icons/gi";

import './css/image.css';
import './css/imageEditor.css';

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

export interface ImageEditorTheme {
    container: EditorThemeClassName;
    menu: MenuTheme;

    RotateLeftIcon: IconType;
    RotateRightIcon: IconType;
    ResizeIcon: IconType;
    CropIcon: IconType;
}

export const IMAGE_EDITOR_MENU_THEME_DEFAULT: MenuTheme = {
    ...MENU_THEME_DEFAULT,
    itemDefault: MENU_THEME_DEFAULT.itemDefault + " image-editor-menu-item-default",
};

export const IMAGE_EDITOR_THEME_DEFAULT: ImageEditorTheme = {
    container: 'editor-see-through image-editor-container-default',
    menu: IMAGE_EDITOR_MENU_THEME_DEFAULT,

    RotateLeftIcon: Icon(FaArrowRotateLeft),
    RotateRightIcon: Icon(FaArrowRotateRight),
    ResizeIcon: Icon(GiResize),
    CropIcon: Icon(FaCropSimple),
};

export interface ImageTheme {
    element: EditorThemeClassName;
    selected: EditorThemeClassName;    
    control: ImageControlTheme;
    editor: ImageEditorTheme;
}

export const IMAGE_THEME_DEFAULT: ImageTheme = {
    element: 'image-element-default',
    selected: 'image-selected-default',
    control: IMAGE_CONTROL_THEME_DEFAULT,
    editor: IMAGE_EDITOR_THEME_DEFAULT,
};