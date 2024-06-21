import { DIALOG_THEME_DEFAULT, DialogTheme } from "@/components/dialog/theme/dialogTheme";
import { SHORTCUTS_THEME_DEFAULT, ShortcutsTheme } from "@/components/shortcuts/theme/shortcutsTheme";
import { EditorThemeClassName } from "lexical";

export interface CommonTheme {
  pulsing: EditorThemeClassName;

  dialogTheme: DialogTheme;
  shortcutsTheme: ShortcutsTheme;
}

export const COMMON_THEME_DEFAULT: CommonTheme = {
  pulsing: "pulsing",

  dialogTheme: DIALOG_THEME_DEFAULT,
  shortcutsTheme: SHORTCUTS_THEME_DEFAULT,
};
