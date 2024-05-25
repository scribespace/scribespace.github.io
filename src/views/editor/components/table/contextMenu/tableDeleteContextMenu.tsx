import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode } from "@editor/nodes/table";
import { $isTableSelection } from "@lexical/table";
import { $getNodeByKeyOrThrow, $getSelection, $isRangeSelection } from "lexical";
import { useMemo } from "react";
import { MenuItem } from "../../menu";
import { TableContextMenuOptionProps } from "./tableContextMenuCommon";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";


export default function TableDeleteContextMenu({ editor }: TableContextMenuOptionProps) {
    const {editorTheme}: MainTheme = useMainThemeContext();

    const DeleteTableIcon = useMemo(()=>{
        return editorTheme.tableTheme.menuTheme.DeleteTableIcon;
    },[editorTheme.tableTheme.menuTheme.DeleteTableIcon]);
    
    const onClick = () => {
        editor.update(() => {
            let tableNode: ExtendedTableNode | null = null;

            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow(selection.anchor.getNode());
            }
            if ($isTableSelection(selection)) {
                const tableBodyNode = $getNodeByKeyOrThrow(selection.tableKey);
                tableNode = tableBodyNode.getParentOrThrow<ExtendedTableNode>();
            }

            if (!tableNode) throw Error("TableContextDelete: expected table");

            tableNode.remove();
        });
        $closeContextMenu(editor);
    };

    return (
        <MenuItem onClick={onClick}>
            <DeleteTableIcon/>
            <div>Delete Table</div>
        </MenuItem>
    );
}
