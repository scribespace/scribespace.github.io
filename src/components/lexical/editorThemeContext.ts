import { createContext } from "react";
import { CONTEXT_MENU_DEFAULT_THEME, ContextMenuTheme } from "./plugins/contextMenuPlugin/contextMenuContext";
import { EditorThemeClassName } from "lexical";

export interface EditorTheme {
    editorContainer: EditorThemeClassName;
    editorInner: EditorThemeClassName;
    editorEditable: EditorThemeClassName;

    contextMenuTheme: ContextMenuTheme;
}

export const EDITOR_THEME_DEFAULT: EditorTheme = {
    editorContainer: 'editor-container',
    editorInner: 'editor-inner',
    editorEditable: 'editor-input section-to-print',
    contextMenuTheme: CONTEXT_MENU_DEFAULT_THEME,
}

export const EditorThemeContext = createContext<EditorTheme>(EDITOR_THEME_DEFAULT)