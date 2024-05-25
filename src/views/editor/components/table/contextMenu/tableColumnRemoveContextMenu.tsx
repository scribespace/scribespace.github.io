import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode, TableBodyNode } from "@editor/nodes/table";
import { $getTableColumnIndexFromTableCellNode } from "@editor/plugins/tablePlugin/utils";
import {
    $getTableCellNodeFromLexicalNode, $getTableNodeFromLexicalNodeOrThrow, $isTableCellNode, $isTableSelection,
    TableCellNode
} from "@lexical/table";
import { $getSelection, $isRangeSelection, $setSelection } from "lexical";
import { useMemo } from "react";
import { MenuItem } from "../../menu";
import { TableContextMenuOptionProps } from "./tableContextMenuCommon";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";


export default function TableColumnRemoveContextMenu({ editor }: TableContextMenuOptionProps) {
    const {editorTheme}: MainTheme = useMainThemeContext();

    const RemoveColumnIcon = useMemo(()=>{
        return editorTheme.tableTheme.menuTheme.RemoveColumnIcon;
    },[editorTheme.tableTheme.menuTheme.RemoveColumnIcon]);

    const onClick = () => {
        editor.update(() => {
            let tableNode: ExtendedTableNode | null = null;
            let cellNode: TableCellNode | null = null;
            let columnsCount = 0;

            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                cellNode = $getTableCellNodeFromLexicalNode(selection.anchor.getNode());
                if (!$isTableCellNode(cellNode)) throw Error("TableContextColumnRemove: expecetd cell node");
                tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow(cellNode);
                columnsCount = 1;
            }

            if ($isTableSelection(selection)) {
                if (selection.anchor.isBefore(selection.focus)) {
                    cellNode = selection.anchor.getNode() as TableCellNode;
                } else {
                    cellNode = selection.focus.getNode() as TableCellNode;
                }
                const tableBodyNode = $getTableNodeFromLexicalNodeOrThrow(cellNode) as TableBodyNode;
                tableNode = tableBodyNode.getParentOrThrow<ExtendedTableNode>();

                const resolvedTable = tableBodyNode.getResolvedTable();
                const columnID = $getTableColumnIndexFromTableCellNode(cellNode, resolvedTable);

                for (const node of selection.getNodes()) {
                    if ($isTableCellNode(node)) {
                        if (tableBodyNode == $getTableNodeFromLexicalNodeOrThrow(node)) {
                            const testColumnID = $getTableColumnIndexFromTableCellNode(node, resolvedTable);

                            columnsCount = Math.max(columnsCount, testColumnID - columnID);
                        }
                    }
                }
                ++columnsCount;
            }

            if (!cellNode) throw Error("TableContextColumnRemove: null Cell Node");
            if (!tableNode) throw Error("TableContextColumnRemove: null Table Node");

            tableNode.removeColumns(cellNode, columnsCount);
            $setSelection(null);
            $closeContextMenu(editor);
        },
            { tag: 'table-column-remove' });
    };

    return (
        <MenuItem onClick={onClick} >
            <RemoveColumnIcon/>
            <div>Remove Column</div>
        </MenuItem>
    );
}
