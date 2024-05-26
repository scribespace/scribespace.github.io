import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { $createExtendedTableNodeWithDimensions } from "@editor/nodes/table";
import { $closeToolbarMenu, TOOLBAR_CLOSE_MENU_COMMAND } from "@editor/plugins/toolbarPlugin/common";
import { useToolbarContext } from "@editor/plugins/toolbarPlugin/context";
import { mergeRegister } from "@lexical/utils";
import { $insertNodes, COMMAND_PRIORITY_LOW } from "lexical";
import { useEffect, useMemo, useState } from "react";
import { MenuItem, Submenu } from "../../menu";
import { TableCreator } from "../tableCreator";

export default function TableCreateToolbar() {
    const {editor} = useToolbarContext();
    const {editorTheme}: MainTheme = useMainThemeContext();

    const [showSubmenu, setShowSubmenu] = useState<boolean>(false);

    const AddTableIcon = useMemo(()=>{
        return editorTheme.tableTheme.menuTheme.AddTableIcon;
    },[editorTheme.tableTheme.menuTheme.AddTableIcon]);
 
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
                <AddTableIcon/>
            </MenuItem>
            <TableCreator gridSize="100px" rowsCount={10} columnsCount={10} onClick={onClick} />
        </Submenu>
    );
}
