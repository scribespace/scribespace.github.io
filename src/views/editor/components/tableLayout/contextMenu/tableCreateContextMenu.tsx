import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { $createExtendedTableNodeWithDimensions } from "@editor/nodes/table";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes } from "lexical";
import { TableCreator } from "../table/tableCreator";
import { Submenu, MenuItem } from "@/components/menu";
import SubmenuIcon from "@/components/menu/submenuIcon";

export function TableCreateContextMenu() {
    const [editor] = useLexicalComposerContext();
    const {editorTheme: {tableLayoutTheme: {menuTheme: {TableAddIcon}}}} = useMainThemeContext();

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
                <TableAddIcon/>
                <div>Create Table</div>
                <SubmenuIcon/>
            </MenuItem>
            <TableCreator gridSize="100px" rowsCount={10} columnsCount={10} onClick={onClick} />
        </Submenu>
    );
}
