import { useMainThemeContext } from "@/mainThemeContext";
import { SET_BACKGROUND_COLOR_COMMAND } from "@editor/plugins/colorPlugin";
import { $closeToolbarMenu, TOOLBAR_CLOSE_MENU_COMMAND } from "@editor/plugins/toolbarPlugin/common";
import { useToolbarContext } from "@editor/plugins/toolbarPlugin/context";
import { mergeRegister } from "@lexical/utils";
import { COMMAND_PRIORITY_LOW } from "lexical";
import { useEffect, useState } from "react";
import { ColorResult } from 'react-color';
import { MenuItem, Submenu } from "../menu";
import ColorPicker from "./colorPicker";

export default function ColorBackgroundToolbar() {
    const {editor} = useToolbarContext();
    const {editorTheme: {colorTheme: {ColorBackgroundIcon}} } = useMainThemeContext();

    const onChange = (color: ColorResult) => {
        editor.dispatchCommand(SET_BACKGROUND_COLOR_COMMAND, color.hex);
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
                <ColorBackgroundIcon/>
            </MenuItem>
            <ColorPicker onChange={onChange}/>
        </Submenu>
     );
}