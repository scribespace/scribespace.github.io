import { CSSTheme } from '@utils';
import './css/infobar.css';

export interface InfobarTheme {
    container: CSSTheme;
    info: CSSTheme;
}

export const INFOBAR_THEME_DEFAULT: InfobarTheme = {
    container: 'infobar-container-default',
    info: 'infobar-info-default',
};