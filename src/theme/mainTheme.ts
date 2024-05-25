import { EDITOR_THEME_DEFAULT, EditorTheme } from "@editor/theme";
import { TREE_THEME_DEFAULT, TreeTheme } from "@/views/tree/theme/treeTheme";

export interface MainTheme {
    editorTheme: EditorTheme
    treeTheme: TreeTheme
}

export const MAIN_THEME_DEFAULT: MainTheme = {
    editorTheme: EDITOR_THEME_DEFAULT,
    treeTheme: TREE_THEME_DEFAULT,
};