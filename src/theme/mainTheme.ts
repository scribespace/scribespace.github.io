import { EDITOR_INPUT_THEME_DEFAULT, EDITOR_THEME_DEFAULT, EditorTheme } from "@editor/theme";
import { TREE_THEME_DEFAULT, TreeTheme } from "@src/views/tree/theme/treeTheme";
import { EditorThemeClasses } from "lexical";

export interface MainTheme {
    editorInputTheme?: EditorThemeClasses
    editorTheme?: EditorTheme
    treeTheme?: TreeTheme
}

export const MAIN_THEME_DEFAULT: MainTheme = {
    editorInputTheme: EDITOR_INPUT_THEME_DEFAULT,
    editorTheme: EDITOR_THEME_DEFAULT,
    treeTheme: TREE_THEME_DEFAULT,
};