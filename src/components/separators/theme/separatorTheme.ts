import { CSSTheme } from "@utils";

export interface SeparatorTheme {
  separatorHorizontal: CSSTheme;
  separatorHorizontalStrong: CSSTheme;
  separatorVertical: CSSTheme;
  separatorVerticalStrong: CSSTheme;
}

export const SEPARATOR_THEME_DEFAULT: SeparatorTheme = {
  separatorHorizontal: "separator-horizontal-default",
  separatorHorizontalStrong: "separator-horizontal-strong-default",
  separatorVertical: "separator-vertical-default",
  separatorVerticalStrong: "separator-vertical-strong-default",
};
