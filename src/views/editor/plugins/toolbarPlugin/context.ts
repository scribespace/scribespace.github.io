import { useContext } from "react";
import { MenuContext, MenuContextData } from "@src/views/editor/components/menu/menuContext";
import { TOOLBAR_MENU_THEME_DEFAULT, ToolbarMenuTheme } from "./theme";
import { LexicalEditor } from "lexical";
import { assert } from "@src/utils/common";

export interface ToolbarContextData extends MenuContextData<ToolbarMenuTheme> {
    editor: LexicalEditor | null;
}

export const TOOLBAR_CONTEX_DEFAULT: ToolbarContextData = { theme: TOOLBAR_MENU_THEME_DEFAULT, layout:'below', editor: null, closeMenu: () => { } };

export function useToolbarContext() { 
    const context = useContext(MenuContext) as ToolbarContextData; 
    assert(context.editor != null, "ToolbarContext: editor = null");
    return {...context, editor: context.editor!};
}

