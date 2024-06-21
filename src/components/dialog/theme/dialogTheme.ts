import { EditorThemeClassName } from "lexical";
import './css/dialog.css';

export interface DialogTheme {
    container: EditorThemeClassName;
}

export const DIALOG_THEME_DEFAULT: DialogTheme = {
    container: 'dialog-container-default',
};