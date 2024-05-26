import { TABLE_CREATOR_EDITOR_THEME_DEFAULT, TableCreatorTheme } from "./tableCreatorEditorTheme";

export interface TableTheme {
    creatorTheme: TableCreatorTheme;
}

export const TABLE_THEME_DEFAULT: TableTheme = {
    creatorTheme: TABLE_CREATOR_EDITOR_THEME_DEFAULT,
};