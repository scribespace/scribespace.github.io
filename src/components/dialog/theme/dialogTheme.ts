import { CSSTheme } from '@utils';
import './css/dialog.css';

export interface DialogTheme {
    container: CSSTheme;
}

export const DIALOG_THEME_DEFAULT: DialogTheme = {
    container: 'dialog-container-default',
};