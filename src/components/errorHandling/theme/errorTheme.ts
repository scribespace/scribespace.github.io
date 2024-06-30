import { CSSTheme } from '@utils';
import './css/error.css';

export interface ErrorTheme {
    container: CSSTheme;
    msg: CSSTheme;
    callstack: CSSTheme;
}

export const ERROR_THEME_DEFAULT: ErrorTheme = {
    container: 'error-container-default',
    msg: 'error-msg-default',
    callstack: 'error-callstack-default',
};