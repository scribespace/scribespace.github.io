import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { $createExtendedTableNodeWithDimensions } from "@editor/nodes/table";
import { $insertNodes } from "lexical";
import { useMemo } from "react";
import { MenuItem, Submenu } from "../../menu";
import SubmenuIcon from "../../menu/submenuIcon";
import TableCreator from "../tableCreator";
import { TableContextMenuOptionProps } from "./tableContextMenuCommon";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";

export default function TableCreateContextMenu({ editor }: TableContextMenuOptionProps) {
    const {editorTheme}: MainTheme = useMainThemeContext();

    const AddTableIcon = useMemo(()=>{
        return editorTheme.tableTheme.menuTheme.AddTableIcon;
    },[editorTheme.tableTheme.menuTheme.AddTableIcon]);

    function onClick(rowsCount: number, columnsCount: number) {
        editor.update(() => {
            const tableNode = $createExtendedTableNodeWithDimensions(rowsCount, columnsCount);
            $insertNodes([tableNode]);
        });

        $closeContextMenu(editor);
    }

    return (
        <Submenu className="">
            <MenuItem>
                <AddTableIcon/>
                <div>Create Table</div>
                <SubmenuIcon/>
            </MenuItem>
            <TableCreator gridSize="100px" rowsCount={10} columnsCount={10} onClick={onClick} />
        </Submenu>
    );
}
