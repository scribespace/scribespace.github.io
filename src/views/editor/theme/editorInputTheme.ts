import { EditorThemeClasses } from "lexical";

export const EDITOR_INPUT_THEME_DEFAULT: EditorThemeClasses = {
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
};
