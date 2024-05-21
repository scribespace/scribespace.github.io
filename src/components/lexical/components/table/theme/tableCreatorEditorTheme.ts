import { EditorThemeClassName } from "lexical";

export interface TableCreatorTheme {
    container?: EditorThemeClassName;
    cellContainer?: EditorThemeClassName;
    cell?: EditorThemeClassName;
    label?: EditorThemeClassName;
}

export const TABLE_CREATOR_EDITOR_THEME_DEFAULT: TableCreatorTheme = {
    container: 'table-creator-container-default',
    cellContainer: 'table-creator-cells-container-default',
    cell: 'table-creator-cell-default',
    label: 'table-creator-label-default',
}