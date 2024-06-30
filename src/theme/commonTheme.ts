import { DIALOG_THEME_DEFAULT, DialogTheme } from "@/components/dialog/theme/dialogTheme";
import { ERROR_THEME_DEFAULT, ErrorTheme } from "@/components/errorHandling/theme/errorTheme";
import { NOTES_CONVERT_THEME_DEFAULT } from "@/components/notesConvertDialog/theme/notesConvertDialogTheme";
import { SHORTCUTS_THEME_DEFAULT, ShortcutsTheme } from "@/components/shortcuts/theme/shortcutsTheme";
import { CSSTheme } from "@utils";

export interface CommonTheme {
  pulsing: CSSTheme;
  
  dialogTheme: DialogTheme;
  notesConvertTheme: CSSTheme;
  shortcutsTheme: ShortcutsTheme;
  errorTheme: ErrorTheme;
}

export const COMMON_THEME_DEFAULT: CommonTheme = {
  pulsing: "pulsing",

  dialogTheme: DIALOG_THEME_DEFAULT,
  notesConvertTheme: NOTES_CONVERT_THEME_DEFAULT,
  shortcutsTheme: SHORTCUTS_THEME_DEFAULT,
  errorTheme: ERROR_THEME_DEFAULT,
};
