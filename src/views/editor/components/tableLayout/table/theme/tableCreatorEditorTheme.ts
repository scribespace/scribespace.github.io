import { CSSTheme } from "@utils";

export interface TableCreatorTheme {
  container: CSSTheme;
  cellContainer: CSSTheme;
  cell: CSSTheme;
  label: CSSTheme;
}

export const TABLE_CREATOR_EDITOR_THEME_DEFAULT: TableCreatorTheme = {
  container: "table-creator-container-default",
  cellContainer: "table-creator-cells-container-default",
  cell: "table-creator-cell-default",
  label: "table-creator-label-default",
};
