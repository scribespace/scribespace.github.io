import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode, TableBodyNode } from "@editor/nodes/table";
import {
    $getTableCellNodeFromLexicalNode, $getTableNodeFromLexicalNodeOrThrow, $getTableRowIndexFromTableCellNode, $isTableCellNode, $isTableSelection,
    TableCellNode
} from "@lexical/table";
import { $getSelection, $isRangeSelection, $setSelection } from "lexical";
import { useMemo } from "react";
import { MenuItem } from "../../menu";
import { TableContextMenuOptionProps } from "./tableContextMenuCommon";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";


export default function TableRowRemoveContextMenu({ editor }: TableContextMenuOptionProps) {
    const {editorTheme}: MainTheme = useMainThemeContext();

    const RemoveRowIcon = useMemo(()=>{
        return editorTheme.tableTheme.menuTheme.RemoveRowIcon;
    },[editorTheme.tableTheme.menuTheme.RemoveRowIcon]);

    const onClick = () => {
        editor.update(() => {
            let tableNode: ExtendedTableNode | null = null;
            let cellNode: TableCellNode | null = null;
            let rowsCount = 0;

            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                cellNode = $getTableCellNodeFromLexicalNode(selection.anchor.getNode());
                if (!$isTableCellNode(cellNode)) throw Error("TableContextRowRemove: expecetd cell node");
                tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow(cellNode);
                rowsCount = 1;
            }

            if ($isTableSelection(selection)) {
                if (selection.anchor.isBefore(selection.focus)) {
                    cellNode = selection.anchor.getNode() as TableCellNode;
                } else {
                    cellNode = selection.focus.getNode() as TableCellNode;
                }
                const tableBodyNode = $getTableNodeFromLexicalNodeOrThrow(cellNode) as TableBodyNode;
                tableNode = tableBodyNode.getParentOrThrow<ExtendedTableNode>();

                const rowID = $getTableRowIndexFromTableCellNode(cellNode);
                for (const node of selection.getNodes()) {
                    if ($isTableCellNode(node)) {
                        if (tableBodyNode == $getTableNodeFromLexicalNodeOrThrow(node)) {
                            const testRowID = $getTableRowIndexFromTableCellNode(node);

                            rowsCount = Math.max(rowsCount, testRowID - rowID);
                        }
                    }
                }
                ++rowsCount;
            }

            if (!cellNode) throw Error("TableContextRowRemove: null Cell Node");
            if (!tableNode) throw Error("TableContextRowRemove: null Table Node");

            tableNode.removeRows(cellNode, rowsCount);
            $setSelection(null);

            $closeContextMenu(editor);
        },
            { tag: 'table-row-remove' });
    };

    return (
        <MenuItem onClick={onClick}>
            <RemoveRowIcon/>
            <div>Remove Row</div>
        </MenuItem>
    );
}
