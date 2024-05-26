import { useMainThemeContext } from "@/mainThemeContext";
import { $createExtendedTableNodeWithDimensions } from "@editor/nodes/table";
import { $closeToolbarMenu, TOOLBAR_CLOSE_MENU_COMMAND } from "@editor/plugins/toolbarPlugin/common";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $insertNodes, COMMAND_PRIORITY_LOW } from "lexical";
import { useEffect, useState } from "react";
import { MenuItem, Submenu } from "../../../menu";
import { TableCreator } from "../tableCreator";

export function TableCreateToolbar() {
    const [editor] = useLexicalComposerContext();
    const {editorTheme: {tableLayoutTheme: {menuTheme: {TableAddIcon}}}} = useMainThemeContext();
    
    const [showSubmenu, setShowSubmenu] = useState<boolean>(false);

    function onClick(rowsCount: number, columnsCount: number) {
        editor.update(() => {
            const tableNode = $createExtendedTableNodeWithDimensions(rowsCount, columnsCount);
            $insertNodes([tableNode]);
            $closeToolbarMenu(editor);
        });
    }

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
                <TableAddIcon/>
            </MenuItem>
            <TableCreator gridSize="100px" rowsCount={10} columnsCount={10} onClick={onClick} />
        </Submenu>
    );
}
