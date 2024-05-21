import { createContext, useContext } from "react";
import { CONTEXT_MENU_DEFAULT_THEME, ContextMenuTheme } from "./plugins/contextMenuPlugin/contextMenuContext";
import { EditorThemeClassName } from "lexical";
import { TABLE_CREATOR_EDITOR_THEME_DEFAULT, TableCreatorTheme as TableCreatorTheme } from "./components/table/themes/tableCreatorEditorTheme";
import { NUMBER_INPUT_DEFAULT_THEME as NUMBER_INPUT_THEME_DEFAULT, NumberInputTheme } from "./components/numberInput/theme/numberInputTheme";
import { SEPARATOR_DEFAULT_THEME as SEPARATOR_THEME_DEFAULT, SeparatorTheme } from "./components/separators/theme/separatorTheme";

export interface EditorTheme {
    editorContainer?: EditorThemeClassName;
    editorInner?: EditorThemeClassName;
    editorEditable?: EditorThemeClassName;

    contextMenuTheme?: ContextMenuTheme;
    tableCreatorTheme?: TableCreatorTheme;
    numberInputTheme?: NumberInputTheme;
    separatorTheme?: SeparatorTheme;
}

export const EDITOR_THEME_DEFAULT: EditorTheme = {
    editorContainer: 'editor-container',
    editorInner: 'editor-inner',
    editorEditable: 'editor-input section-to-print',
    contextMenuTheme: CONTEXT_MENU_DEFAULT_THEME,
    tableCreatorTheme: TABLE_CREATOR_EDITOR_THEME_DEFAULT,
    numberInputTheme: NUMBER_INPUT_THEME_DEFAULT,
    separatorTheme: SEPARATOR_THEME_DEFAULT,
}

export const EditorThemeContext = createContext<EditorTheme>(EDITOR_THEME_DEFAULT)

export function getEditorThemeContext() { return useContext(EditorThemeContext) }