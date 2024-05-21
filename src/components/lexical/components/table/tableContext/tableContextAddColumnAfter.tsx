import { $getNodeByKeyOrThrow, $getSelection, $isRangeSelection } from "lexical";
import {
    $getTableCellNodeFromLexicalNode, $getTableNodeFromLexicalNodeOrThrow, $isTableCellNode, $isTableSelection,
    TableCellNode
} from "@lexical/table";
import TableContextNumberInput from "./tableContextNumberInput";
import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode } from "../../../nodes/table/extendedTableNode";
import { $getTableColumnIndexFromTableCellNode } from "../../../plugins/tablePlugin/tableHelpers";
import { TableBodyNode } from "../../../nodes/table/tableBodyNode";
import { getContextMenuContext } from "../../../plugins/contextMenuPlugin/context";
import { PropsWithChildren } from "react";
import { TableContextOptionProps } from "./tableContextCommon";
import { MenuItem, Submenu } from "../../menu";

export default function TableContextAddColumnAfter({ editor }: TableContextOptionProps) {
    const menuContext = getContextMenuContext();

    function AddColumnAfterIcon() {
        if (!menuContext.theme.tableMenuTheme || !menuContext.theme.tableMenuTheme.AddColumnAfterIcon)
            throw Error("No theme for table menu!");

        return menuContext.theme.tableMenuTheme.AddColumnAfterIcon;
    }

    const OptionElement = ({ children }: PropsWithChildren) => {
        return (
            <MenuItem Icon={AddColumnAfterIcon()} title="Insert Column After">
                {children}
            </MenuItem>
        );
    };

    const onInputAccepted = (input: HTMLInputElement) => {
        const value = input.valueAsNumber;

        editor.update(() => {
            const selection = $getSelection();

            let tableNode: ExtendedTableNode | null = null;
            let cellNode: TableCellNode | null = null;
            if ($isRangeSelection(selection)) {
                cellNode = $getTableCellNodeFromLexicalNode(selection.getNodes()[0]);
                if (!cellNode) throw Error("AddColumnAfter: couldn't find node");
                tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow(cellNode) as ExtendedTableNode;
            }

            if ($isTableSelection(selection)) {
                const tableBodyNode = $getNodeByKeyOrThrow<TableBodyNode>(selection.tableKey);
                tableNode = tableBodyNode.getParentOrThrow<ExtendedTableNode>();
                const resolvedTable = tableBodyNode.getResolvedTable();
                const columnID = -1;
                for (const node of selection.getNodes()) {
                    if ($isTableCellNode(node)) {
                        const cellsTableNode = $getTableNodeFromLexicalNodeOrThrow(node);
                        if (cellsTableNode == tableBodyNode) {
                            const nodesColumnID = $getTableColumnIndexFromTableCellNode(node, resolvedTable);
                            if (nodesColumnID > columnID) {
                                columnID == columnID;
                                cellNode = node;
                            }
                        }
                    }
                }
            }

            if (!cellNode) throw Error("AddColumnAfter: node not found");
            tableNode?.addColumnsAfter(cellNode, value);
        },
            { tag: 'table-add-column-after' });

        menuContext.closeMenu();
    };

    return (
        <Submenu Option={OptionElement} disableBackground={true}>
            <TableContextNumberInput onInputAccepted={onInputAccepted} />
        </Submenu>
    );
}
