import { EditorThemeClassName } from "lexical";

export interface CommonTheme {
    pulsing: EditorThemeClassName;
}

export const COMMON_THEME_DEFAULT: CommonTheme = {
    pulsing: 'pulsing',
};