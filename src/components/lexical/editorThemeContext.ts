import { createContext, useContext } from "react";
import { CONTEXT_MENU_DEFAULT_THEME, ContextMenuTheme } from "./plugins/contextMenuPlugin/contextMenuContext";
import { EditorThemeClassName } from "lexical";
import { TABLE_CREATOR_EDITOR_THEME_DEFAULT, TableCreatorTheme as TableCreatorTheme } from "./components/table/themes/tableCreatorEditorTheme";
import { NUMBER_INPUT_DEFAULT_THEME, NumberInputTheme } from "./components/numberInput/theme/numberInputTheme";

export interface EditorTheme {
    editorContainer: EditorThemeClassName;
    editorInner: EditorThemeClassName;
    editorEditable: EditorThemeClassName;

    contextMenuTheme: ContextMenuTheme;
    tableCreatorTheme: TableCreatorTheme;
    numberInputTheme: NumberInputTheme;
}

export const EDITOR_THEME_DEFAULT: EditorTheme = {
    editorContainer: 'editor-container',
    editorInner: 'editor-inner',
    editorEditable: 'editor-input section-to-print',
    contextMenuTheme: CONTEXT_MENU_DEFAULT_THEME,
    tableCreatorTheme: TABLE_CREATOR_EDITOR_THEME_DEFAULT,
    numberInputTheme: NUMBER_INPUT_DEFAULT_THEME,
}

export const EditorThemeContext = createContext<EditorTheme>(EDITOR_THEME_DEFAULT)

export function getEditorThemeContext() { return useContext(EditorThemeContext) }