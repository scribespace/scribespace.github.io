import { CONTEXT_MENU_THEME_DEFAULT, ContextMenuTheme } from "@editor/plugins/contextMenuPlugin/theme";
import { EditorThemeClassName, EditorThemeClasses } from "lexical";
import { LINK_THEME_DEFAULT, LinkTheme } from "@editor/components/link/theme";
import { NumberInputTheme, NUMBER_INPUT_THEME_DEFAULT } from "@editor/components/numberInput/theme";
import { SeparatorTheme, SEPARATOR_THEME_DEFAULT } from "@editor/components/separators/theme";
import { TOOLBAR_THEME_DEFAULT, ToolbarTheme } from "@editor/plugins/toolbarPlugin/theme";
import { UNDO_REDO_THEME_DEFAULT, UndoRedoTheme } from "@editor/components/undoRedo/theme";
import { FONT_STYLE_THEME_DEFAULT, FontStyleTheme } from "@editor/components/fontStyle/theme";
import { Font } from "@utils";
import { ALIGN_MENU_THEME_DEFAULT, AlignMenuTheme } from "../components/align/theme";
import { COLOR_MENU_THEME_DEFAULT, ColorMenuTheme } from "../components/color/theme";
import { TABLE_LAYOUT_THEME_DEFAULT, TableLayoutTheme } from "../components/tableLayout/theme";

export interface EditorInputTheme extends EditorThemeClasses {
    defaultFontSize: EditorThemeClassName;
    defaultFontFamily: Font;

    layout: EditorThemeClassName;
}

export interface EditorTheme {
    editorContainer: EditorThemeClassName;
    editorInner: EditorThemeClassName;
    editorEditable: EditorThemeClassName;
    editorInputTheme: EditorInputTheme;
    
    editorSeeThrough: EditorThemeClassName;
    editorPrintDisabled: EditorThemeClassName;

    tableLayoutTheme: TableLayoutTheme;
    separatorTheme: SeparatorTheme;
    linkTheme: LinkTheme;
    numberInputTheme: NumberInputTheme;
    undoRedoTheme: UndoRedoTheme;
    fontStyleTheme: FontStyleTheme;
    alignTheme: AlignMenuTheme;
    colorTheme: ColorMenuTheme;

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

    image: 'editor-image',
    imageContainer: 'editor-image-container',

    defaultFontSize: '',
    defaultFontFamily: {name:'', alt: ''},

    layout: 'editor-layout',
};

export const EDITOR_THEME_DEFAULT: EditorTheme = {
    editorContainer: 'editor-container',
    editorInner: 'editor-inner',
    editorEditable: 'editor-input section-to-print',
    editorInputTheme: EDITOR_INPUT_THEME_DEFAULT,

    editorSeeThrough: 'editor-see-through',
    editorPrintDisabled: 'print-disabled',

    tableLayoutTheme: TABLE_LAYOUT_THEME_DEFAULT,
    numberInputTheme: NUMBER_INPUT_THEME_DEFAULT,
    separatorTheme: SEPARATOR_THEME_DEFAULT,
    linkTheme: LINK_THEME_DEFAULT,
    undoRedoTheme: UNDO_REDO_THEME_DEFAULT,
    fontStyleTheme: FONT_STYLE_THEME_DEFAULT,
    alignTheme: ALIGN_MENU_THEME_DEFAULT,
    colorTheme: COLOR_MENU_THEME_DEFAULT,

    toolbarTheme: TOOLBAR_THEME_DEFAULT,
    contextMenuTheme: CONTEXT_MENU_THEME_DEFAULT,
};
