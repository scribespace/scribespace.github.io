import { LAYOUT_THEME_DEFAULT, LayoutTheme } from "../layout/theme";
import { TABLE_THEME_DEFAULT, TableTheme } from "../table/theme";
import {
  TABLE_LAYOUT_MENU_THEME_DEFAULT,
  TableLayoutMenuTheme,
} from "./tableLayoutMenuTheme";

export interface TableLayoutTheme {
  menuTheme: TableLayoutMenuTheme;
  tableTheme: TableTheme;
  layoutTheme: LayoutTheme;
}
export const TABLE_LAYOUT_THEME_DEFAULT: TableLayoutTheme = {
  menuTheme: TABLE_LAYOUT_MENU_THEME_DEFAULT,
  tableTheme: TABLE_THEME_DEFAULT,
  layoutTheme: LAYOUT_THEME_DEFAULT,
};
