import { CONTEXT_MENU_THEME_DEFAULT, ContextMenuTheme } from "../plugins/contextMenuPlugin/theme";
import { EditorThemeClassName } from "lexical";
import { LINK_THEME_DEFAULT, LinkTheme } from "../components/link/theme";
import { NumberInputTheme, NUMBER_INPUT_THEME_DEFAULT } from "../components/numberInput/theme";
import { SeparatorTheme, SEPARATOR_THEME_DEFAULT } from "../components/separators/theme";
import { TableCreatorTheme, TABLE_CREATOR_EDITOR_THEME_DEFAULT } from "../components/table/theme";


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
};
