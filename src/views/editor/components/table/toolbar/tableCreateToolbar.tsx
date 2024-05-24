import { $createExtendedTableNodeWithDimensions } from "@editor/nodes/table";
import { useMainThemeContext } from "@src/mainThemeContext";
import { MainTheme } from "@src/theme";
import { useToolbarContext } from "@src/views/editor/plugins/toolbarPlugin/context";
import { $insertNodes } from "lexical";
import { useMemo } from "react";
import { MenuItem, Submenu } from "../../menu";
import TableCreator from "../tableCreator";


export default function TableCreateToolbar() {
    const {editor, closeMenu} = useToolbarContext();
    const {editorTheme}: MainTheme = useMainThemeContext();

    const AddTableIcon = useMemo(()=>{
        return editorTheme.tableTheme.menuTheme.AddTableIcon;
    },[editorTheme.tableTheme.menuTheme.AddTableIcon]);
 
    function onClick(rowsCount: number, columnsCount: number) {
        editor.update(() => {
            const tableNode = $createExtendedTableNodeWithDimensions(rowsCount, columnsCount);
            $insertNodes([tableNode]);
        });

        closeMenu();
    }

    return (
        <Submenu disableBackground={true} disableSubmenuIcon={true}>
            <MenuItem>
                <AddTableIcon/>
            </MenuItem>
            <TableCreator gridSize="100px" rowsCount={10} columnsCount={10} onClick={onClick} />
        </Submenu>
    );
}
