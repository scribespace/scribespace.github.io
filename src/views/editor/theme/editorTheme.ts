import { CONTEXT_MENU_THEME_DEFAULT, ContextMenuTheme } from "@editor/plugins/contextMenuPlugin/theme";
import { EditorThemeClassName, EditorThemeClasses } from "lexical";
import { LINK_THEME_DEFAULT, LinkTheme } from "@editor/components/link/theme";
import { NumberInputTheme, NUMBER_INPUT_THEME_DEFAULT } from "@editor/components/numberInput/theme";
import { SeparatorTheme, SEPARATOR_THEME_DEFAULT } from "@editor/components/separators/theme";
import { TableTheme, TABLE_THEME_DEFAULT } from "@editor/components/table/theme";
import { TOOLBAR_THEME_DEFAULT, ToolbarTheme } from "@editor/plugins/toolbarPlugin/theme";
import { UNDO_REDO_THEME_DEFAULT, UndoRedoTheme } from "@editor/components/undoRedo/theme";
import { FONT_STYLE_THEME_DEFAULT, FontStyleTheme } from "@editor/components/fontStyle/theme";
import { Font } from "@utils";

export interface EditorInputTheme extends EditorThemeClasses {
    defaultFontSize: EditorThemeClassName;
    defaultFontFamily: Font;
}

export interface EditorTheme {
    editorContainer: EditorThemeClassName;
    editorInner: EditorThemeClassName;
    editorEditable: EditorThemeClassName;
    editorInputTheme: EditorInputTheme;
    
    editorSeeThrough: EditorThemeClassName;
    editorPrintDisabled: EditorThemeClassName;

    tableTheme: TableTheme;
    separatorTheme: SeparatorTheme;
    linkTheme: LinkTheme;
    numberInputTheme: NumberInputTheme;
    undoRedoTheme: UndoRedoTheme;
    fontStyleTheme: FontStyleTheme;

    toolbarTheme: ToolbarTheme;
    contextMenuTheme: ContextMenuTheme;
}

export const EDITOR_INPUT_THEME_DEFAULT: EditorInputTheme = {
    ltr: "ltr",
    rtl: "rtl",
    placeholder: "editor-placeholder",
    paragraph: "editor-paragraph",
    link: "link",
    text: {
        base: "editor-text",
        bold: "editor-text-bold",
        italic: "editor-text-italic",
        underline: "editor-text-underline",
        strikethrough: "editor-text-strikethrough",
        underlineStrikethrough: "editor-text-underlineStrikethrough",
    },
    table: 'editor-table',
    tableCell: 'editor-table-cell',
    tableRow: 'editor-table-row',

    defaultFontSize: '',
    defaultFontFamily: {name:'', alt: ''},
};

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
    fontStyleTheme: FONT_STYLE_THEME_DEFAULT,

    toolbarTheme: TOOLBAR_THEME_DEFAULT,
    contextMenuTheme: CONTEXT_MENU_THEME_DEFAULT,
};
