import { EditorThemeClassName } from "lexical";


export interface SeparatorTheme {
    separatorHorizontal?: EditorThemeClassName;
    separatorHorizontalStrong?: EditorThemeClassName;
    separatorVertical?: EditorThemeClassName;
    separatorVerticalStrong?: EditorThemeClassName;
}

export const SEPARATOR_DEFAULT_THEME: SeparatorTheme = {
    separatorHorizontal: 'separator-horizontal-default',
    separatorHorizontalStrong: 'separator-horizontal-strong-default',
    separatorVertical: 'separator-vertical-default',
    separatorVerticalStrong: 'separator-vertical-strong-default',
};
