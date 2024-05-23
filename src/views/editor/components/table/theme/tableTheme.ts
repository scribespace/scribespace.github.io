import { TABLE_CREATOR_EDITOR_THEME_DEFAULT, TableCreatorTheme } from "./tableCreatorEditorTheme";
import { TABLE_MENU_THEME_DEFAULT, TableMenuTheme } from "./tableMenuTheme";

export interface TableTheme {
    menuTheme: TableMenuTheme;
    creatorTheme: TableCreatorTheme;
}

export const TABLE_THEME_DEFAULT: TableTheme = {
    menuTheme: TABLE_MENU_THEME_DEFAULT,
    creatorTheme: TABLE_CREATOR_EDITOR_THEME_DEFAULT,
};