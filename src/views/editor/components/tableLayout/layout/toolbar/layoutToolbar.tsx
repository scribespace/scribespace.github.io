import { $createLayoutNodeWithColumns } from "@/views/editor/nodes/layout";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes, COMMAND_PRIORITY_LOW } from "lexical";
import { useCallback, useEffect, useState } from "react";
import { useMainThemeContext } from "@/mainThemeContext";
import { $closeToolbarMenu, TOOLBAR_CLOSE_MENU_COMMAND } from "@/views/editor/plugins/toolbarPlugin/common";
import { mergeRegister } from "@lexical/utils";
import NumberInput from "../../../numberInput";
import { useToolbarContext } from "@/views/editor/plugins/toolbarPlugin/context";
import { Submenu, MenuItem } from "@/components/menu";

export function LayoutCreateToolbar() {
    const [editor] = useLexicalComposerContext();
    const {editorTheme: {tableLayoutTheme: {menuTheme: {LayoutAddIcon}}}} = useMainThemeContext();
    const {theme: {horizontalContainer}} = useToolbarContext();
    const [showSubmenu, setShowSubmenu] = useState<boolean>(false);
    
    const onInputAccept = useCallback(
        (input: HTMLInputElement) => {
            editor.update(
                () => {
                    const cols = input.valueAsNumber;
                    const layoutNode = $createLayoutNodeWithColumns(cols);
                    $insertNodes([layoutNode]);
                    $closeToolbarMenu(editor);
                }
            );
        },
        [editor]
    );

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
        <Submenu className={horizontalContainer} showSubmenu={showSubmenu} setShowSubmenu={setShowSubmenu}>
            <MenuItem>
                <LayoutAddIcon/>
            </MenuItem>
            <NumberInput type="number" value="2" min={2} useAcceptButton={true} onInputAccepted={onInputAccept} />
        </Submenu>
    );    
}