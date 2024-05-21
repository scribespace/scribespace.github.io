import { $getSelection, $isRangeSelection, $setSelection } from "lexical";
import { MenuItem } from "../../menu";
import {
    $getTableCellNodeFromLexicalNode, $getTableNodeFromLexicalNodeOrThrow, $getTableRowIndexFromTableCellNode, $isTableCellNode, $isTableSelection,
    TableCellNode
} from "@lexical/table";
import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode } from "../../../nodes/table/extendedTableNode";
import { TableBodyNode } from "../../../nodes/table/tableBodyNode";
import { getContextMenuContext } from "../../../plugins/contextMenuPlugin/context";
import { TableContextOptionProps } from "./tableContextCommon";


export default function TableContextRowRemove({ editor }: TableContextOptionProps) {
    const menuContext = getContextMenuContext();

    function RemoveRowIcon() {
        if (!menuContext.theme.tableMenuTheme || !menuContext.theme.tableMenuTheme.RemoveRowIcon)
            throw Error("No theme for table menu!");

        return menuContext.theme.tableMenuTheme.RemoveRowIcon;
    }

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
            menuContext.closeMenu();
        },
            { tag: 'table-row-remove' });
    };

    return <MenuItem Icon={RemoveRowIcon()} title="Remove Row" onClick={onClick} />;
}
