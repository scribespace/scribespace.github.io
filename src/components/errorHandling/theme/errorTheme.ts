import { EditorThemeClassName } from "lexical";
import './css/error.css';

export interface ErrorTheme {
    container: EditorThemeClassName;
    msg: EditorThemeClassName;
    callstack: EditorThemeClassName;
}

export const ERROR_THEME_DEFAULT: ErrorTheme = {
    container: 'error-container-default',
    msg: 'error-msg-default',
    callstack: 'error-callstack-default',
};