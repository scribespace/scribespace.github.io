import { useMainThemeContext } from "@/mainThemeContext";
import { SET_FONT_COLOR_COMMAND } from "@editor/plugins/colorPlugin";
import { $closeToolbarMenu, TOOLBAR_CLOSE_MENU_COMMAND } from "@editor/plugins/toolbarPlugin/common";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { COMMAND_PRIORITY_LOW } from "lexical";
import { useEffect, useState } from "react";
import { ColorResult } from 'react-color';
import ColorPicker from "./colorPicker";
import { Submenu, MenuItem } from "@/components/menu";

export default function ColorTextToolbar() {
    const [editor] = useLexicalComposerContext();
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