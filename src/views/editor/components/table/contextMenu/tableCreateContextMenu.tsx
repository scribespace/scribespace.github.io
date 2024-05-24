import { $createExtendedTableNodeWithDimensions } from "@editor/nodes/table";
import { useContextMenuContext } from "@editor/plugins/contextMenuPlugin/context";
import { useMainThemeContext } from "@src/mainThemeContext";
import { MainTheme } from "@src/theme";
import { $insertNodes } from "lexical";
import { useMemo } from "react";
import { MenuItem, Submenu } from "../../menu";
import SubmenuIcon from "../../menu/submenuIcon";
import TableCreator from "../tableCreator";
import { TableContextMenuOptionProps } from "./tableContextMenuCommon";

export default function TableCreateContextMenu({ editor }: TableContextMenuOptionProps) {
    const menuContext = useContextMenuContext();
    const {editorTheme}: MainTheme = useMainThemeContext();

    const AddTableIcon = useMemo(()=>{
        return editorTheme.tableTheme.menuTheme.AddTableIcon;
    },[editorTheme.tableTheme.menuTheme.AddTableIcon]);

    function onClick(rowsCount: number, columnsCount: number) {
        editor.update(() => {
            const tableNode = $createExtendedTableNodeWithDimensions(rowsCount, columnsCount);
            $insertNodes([tableNode]);
        });

        menuContext.closeMenu();
    }

    return (
        <Submenu disableBackground={true}>
            <MenuItem>
                <AddTableIcon/>
                <div>Create Table</div>
                <SubmenuIcon/>
            </MenuItem>
            <TableCreator gridSize="100px" rowsCount={10} columnsCount={10} onClick={onClick} />
        </Submenu>
    );
}
