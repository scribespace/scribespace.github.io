import { MenuItem, MenuRoot } from "@/components/menu";
import { SeparatorVertical } from "@/components/separators";
import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { IMAGE_EDITOR_MENU_CONTEX_DEFAULT, ImageEditorMenuContextData } from "./context/imageEditorMenuContext";
import { useEffect, useState } from "react";

export function ImageEditor() {
    const { 
        editorTheme: {
            imageTheme: {
                editor: imageEditorTheme
            }
        } ,
        editorTheme: {
            imageTheme: {
                editor: {
                    RotateLeftIcon,
                    RotateRightIcon,
                    ResizeIcon,
                    CropIcon,
                }
            }
        }
    }: MainTheme = useMainThemeContext();
    const [imageEditorMenuContext, setImageEditorMenuContext] = useState<ImageEditorMenuContextData>(IMAGE_EDITOR_MENU_CONTEX_DEFAULT);

    useEffect(
        () => {
            setImageEditorMenuContext( (current) => ({...current, theme: imageEditorTheme.menu}) );
        },
        [imageEditorTheme.menu]
    );
  
    return (
        <MenuRoot value={imageEditorMenuContext}>
            <MenuItem>
                <RotateLeftIcon/>
            </MenuItem>
            <MenuItem>
                <RotateRightIcon/>
            </MenuItem>

            <SeparatorVertical/>

            <MenuItem>
                <ResizeIcon/>
            </MenuItem>
            <MenuItem>
                <CropIcon/>
            </MenuItem>        
        </MenuRoot>
    );
}