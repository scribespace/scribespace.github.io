import { $getSelection, $isRangeSelection, $setSelection } from "lexical";
import { MenuItem } from "../../menu";
import {
    $getTableCellNodeFromLexicalNode, $getTableNodeFromLexicalNodeOrThrow, $isTableCellNode, $isTableSelection,
    TableCellNode
} from "@lexical/table";
import { $getTableColumnIndexFromTableCellNode } from "../../../plugins/tablePlugin/utils";
import { getContextMenuContext } from "../../../plugins/contextMenuPlugin/context";
import { TableContextOptionProps } from "./tableContextCommon";
import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode, TableBodyNode } from "../../../nodes/table";


export default function TableContextColumnRemove({ editor }: TableContextOptionProps) {
    const menuContext = getContextMenuContext();

    function RemoveColumnIcon() {
        if (!menuContext.theme.tableMenuTheme || !menuContext.theme.tableMenuTheme.RemoveColumnIcon)
            throw Error("No theme for table menu!");

        return menuContext.theme.tableMenuTheme.RemoveColumnIcon;
    }

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
            menuContext.closeMenu();
        },
            { tag: 'table-column-remove' });
    };

    return <MenuItem Icon={RemoveColumnIcon()} title="Remove Column" onClick={onClick} />;
}
