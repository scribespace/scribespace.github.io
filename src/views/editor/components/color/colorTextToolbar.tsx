import { useMainThemeContext } from "@/mainThemeContext";
import { mergeRegister } from "@lexical/utils";
import { COMMAND_PRIORITY_LOW } from "lexical";
import { useEffect, useState } from "react";
import { ColorResult } from 'react-color';
import { $closeToolbarMenu, TOOLBAR_CLOSE_MENU_COMMAND } from "@editor/plugins/toolbarPlugin/common";
import { useToolbarContext } from "@editor/plugins/toolbarPlugin/context";
import { MenuItem, Submenu } from "../menu";
import ColorPicker from "./colorPicker";
import { SET_FONT_COLOR_COMMAND } from "@editor/plugins/colorPlugin";

export default function ColorTextToolbar() {
    const {editor} = useToolbarContext();
    const {editorTheme: {colorTheme: {ColorTextIcon}} } = useMainThemeContext();

    const onChange = (color: ColorResult) => {
        editor.dispatchCommand(SET_FONT_COLOR_COMMAND, color.hex);
        $closeToolbarMenu(editor);
    };

    const [showSubmenu, setShowSubmenu] = useState<boolean>(false);

    useEffect(
        () => {
            return mergeRegister( 
                editor.registerCommand( 
                    TOOLBAR_CLOSE_MENU_COMMAND,
                    () => {
                        setShowSubmenu(false);
                        return false;
                    },
                    COMMAND_PRIORITY_LOW
                 )
             );
        },
        [editor, showSubmenu, setShowSubmenu]
    );
 
     return (
        <Submenu className="" showSubmenu={showSubmenu} setShowSubmenu={setShowSubmenu}>
            <MenuItem>
                <ColorTextIcon/>
            </MenuItem>
            <ColorPicker onChange={onChange}/>
        </Submenu>
     );
}