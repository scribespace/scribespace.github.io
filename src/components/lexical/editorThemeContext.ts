import { createContext } from "react";
import { CONTEXT_MENU_DEFAULT_THEME, ContextMenuTheme } from "./plugins/contextMenuPlugin/contextMenuContext";
import { EditorThemeClassName } from "lexical";
import { TABLE_CREATOR_EDITOR_THEME_DEFAULT, TableCreatorTheme as TableCreatorTheme } from "./components/table/themes/tableCreatorEditorTheme";

export interface EditorTheme {
    editorContainer: EditorThemeClassName;
    editorInner: EditorThemeClassName;
    editorEditable: EditorThemeClassName;

    contextMenuTheme: ContextMenuTheme;
    tableCreatorTheme: TableCreatorTheme;
}

export const EDITOR_THEME_DEFAULT: EditorTheme = {
    editorContainer: 'editor-container',
    editorInner: 'editor-inner',
    editorEditable: 'editor-input section-to-print',
    contextMenuTheme: CONTEXT_MENU_DEFAULT_THEME,
    tableCreatorTheme: TABLE_CREATOR_EDITOR_THEME_DEFAULT,
}

export const EditorThemeContext = createContext<EditorTheme>(EDITOR_THEME_DEFAULT)