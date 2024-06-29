import { EditorThemeClassName } from 'lexical';
import './css/infobar.css';

export interface InfobarTheme {
    container: EditorThemeClassName;
    info: EditorThemeClassName;
}

export const INFOBAR_THEME_DEFAULT: InfobarTheme = {
    container: 'infobar-container-default',
    info: 'infobar-info-default',
};