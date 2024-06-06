import { useContext } from "react";
import { TOOLBAR_MENU_THEME_DEFAULT, ToolbarMenuTheme } from "../theme";
import { MenuContextData, MenuContext } from "@/components/menu/menuContext";

export interface ToolbarContextData extends MenuContextData<ToolbarMenuTheme> {}

export const TOOLBAR_CONTEX_DEFAULT: ToolbarContextData = {
  theme: TOOLBAR_MENU_THEME_DEFAULT,
  layout: "below",
};

export function useToolbarContext() {
  return useContext(MenuContext) as ToolbarContextData;
}
