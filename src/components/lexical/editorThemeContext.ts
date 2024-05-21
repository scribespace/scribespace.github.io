import { createContext, useContext } from "react";
import { CONTEXT_MENU_THEME_DEFAULT, ContextMenuTheme } from "./plugins/contextMenuPlugin/theme/contextMenuTheme";
import { EditorThemeClassName } from "lexical";
import { TABLE_CREATOR_EDITOR_THEME_DEFAULT, TableCreatorTheme as TableCreatorTheme } from "./components/table/themes/tableCreatorEditorTheme";
import { NUMBER_INPUT_THEME_DEFAULT, NumberInputTheme } from "./components/numberInput/theme/numberInputTheme";
import { SEPARATOR_THEME_DEFAULT, SeparatorTheme } from "./components/separators/theme/separatorTheme";
import { LINK_THEME_DEFAULT, LinkTheme } from "./components/link/theme/linkTheme";

export interface EditorTheme {
    editorContainer?: EditorThemeClassName;
    editorInner?: EditorThemeClassName;
    editorEditable?: EditorThemeClassName;
    editorSeeThrough?: EditorThemeClassName;
    editorPrintDisabled?: EditorThemeClassName;
    
    contextMenuTheme?: ContextMenuTheme;
    tableCreatorTheme?: TableCreatorTheme;
    numberInputTheme?: NumberInputTheme;
    separatorTheme?: SeparatorTheme;
    linkTheme?: LinkTheme;
}

export const EDITOR_THEME_DEFAULT: EditorTheme = {
    editorContainer: 'editor-container',
    editorInner: 'editor-inner',
    editorEditable: 'editor-input section-to-print',
    editorSeeThrough: 'editor-see-through',
    editorPrintDisabled: 'print-disabled',

    contextMenuTheme: CONTEXT_MENU_THEME_DEFAULT,
    tableCreatorTheme: TABLE_CREATOR_EDITOR_THEME_DEFAULT,
    numberInputTheme: NUMBER_INPUT_THEME_DEFAULT,
    separatorTheme: SEPARATOR_THEME_DEFAULT,
    linkTheme: LINK_THEME_DEFAULT,
}

export const EditorThemeContext = createContext<EditorTheme>(EDITOR_THEME_DEFAULT)

export function getEditorThemeContext() { return useContext(EditorThemeContext) }