import { CONTEXT_MENU_THEME_DEFAULT, ContextMenuTheme } from "../plugins/contextMenuPlugin/theme";
import { EditorThemeClassName, EditorThemeClasses } from "lexical";
import { LINK_THEME_DEFAULT, LinkTheme } from "../components/link/theme";
import { NumberInputTheme, NUMBER_INPUT_THEME_DEFAULT } from "../components/numberInput/theme";
import { SeparatorTheme, SEPARATOR_THEME_DEFAULT } from "../components/separators/theme";
import { TableTheme, TABLE_THEME_DEFAULT } from "../components/table/theme";
import { EDITOR_INPUT_THEME_DEFAULT } from "./editorInputTheme";
import { TOOLBAR_THEME_DEFAULT, ToolbarTheme } from "../plugins/toolbarPlugin/theme";
import { UNDO_REDO_THEME_DEFAULT, UndoRedoTheme } from "../components/undoRedo/theme";
import { TEXT_STYLE_THEME_DEFAULT, TextStyleTheme } from "../components/textStyle/theme";


export interface EditorTheme {
    editorContainer: EditorThemeClassName;
    editorInner: EditorThemeClassName;
    editorEditable: EditorThemeClassName;
    editorInputTheme: EditorThemeClasses;
    
    editorSeeThrough: EditorThemeClassName;
    editorPrintDisabled: EditorThemeClassName;

    tableTheme: TableTheme;
    separatorTheme: SeparatorTheme;
    linkTheme: LinkTheme;
    numberInputTheme: NumberInputTheme;
    undoRedoTheme: UndoRedoTheme;
    textStyleTheme: TextStyleTheme;

    toolbarTheme: ToolbarTheme;
    contextMenuTheme: ContextMenuTheme;
}

export const EDITOR_THEME_DEFAULT: EditorTheme = {
    editorContainer: 'editor-container',
    editorInner: 'editor-inner',
    editorEditable: 'editor-input section-to-print',
    editorInputTheme: EDITOR_INPUT_THEME_DEFAULT,

    editorSeeThrough: 'editor-see-through',
    editorPrintDisabled: 'print-disabled',

    tableTheme: TABLE_THEME_DEFAULT,
    numberInputTheme: NUMBER_INPUT_THEME_DEFAULT,
    separatorTheme: SEPARATOR_THEME_DEFAULT,
    linkTheme: LINK_THEME_DEFAULT,
    undoRedoTheme: UNDO_REDO_THEME_DEFAULT,
    textStyleTheme: TEXT_STYLE_THEME_DEFAULT,

    toolbarTheme: TOOLBAR_THEME_DEFAULT,
    contextMenuTheme: CONTEXT_MENU_THEME_DEFAULT,
};
