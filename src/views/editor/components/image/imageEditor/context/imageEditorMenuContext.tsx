import { MenuContext, MenuContextData } from "@/components/menu/menuContext";
import { MenuTheme } from "@/components/menu/theme";
import { useContext } from "react";
import { IMAGE_EDITOR_MENU_THEME_DEFAULT } from "../../theme";

export interface ImageEditorMenuContextData extends MenuContextData<MenuTheme> {
    
}

export const IMAGE_EDITOR_MENU_CONTEX_DEFAULT: ImageEditorMenuContextData = { theme: IMAGE_EDITOR_MENU_THEME_DEFAULT, layout:'below' };

export function useImageEditorMenuContext() { 
    return useContext(MenuContext) as ImageEditorMenuContextData;    
}
