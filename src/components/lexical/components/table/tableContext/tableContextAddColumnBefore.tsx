import { $getNodeByKeyOrThrow, $getSelection, $isRangeSelection } from "lexical";
import {
    $getTableCellNodeFromLexicalNode, $getTableNodeFromLexicalNodeOrThrow, $isTableCellNode, $isTableSelection,
    TableCellNode
} from "@lexical/table";
import TableContextNumberInput from "./tableContextNumberInput";
import { getContextMenuContext } from "../../../plugins/contextMenuPlugin/context";
import { PropsWithChildren } from "react";
import { TableContextOptionProps } from "./tableContextCommon";
import { MenuItem, Submenu } from "../../menu";
import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode, TableBodyNode } from "../../../nodes/table";
import { $getTableColumnIndexFromTableCellNode } from "../../../plugins/tablePlugin/utils";


export default function TableContextAddColumnBefore({ editor }: TableContextOptionProps) {
    const menuContext = getContextMenuContext();

    function AddColumnBeforeIcon() {
        if (!menuContext.theme.tableMenuTheme || !menuContext.theme.tableMenuTheme.AddColumnBeforeIcon)
            throw Error("No theme for table menu!");

        return menuContext.theme.tableMenuTheme.AddColumnBeforeIcon;
    }

    const OptionElement = ({ children }: PropsWithChildren) => {
        return (
            <MenuItem Icon={AddColumnBeforeIcon()} title="Insert Column Before">
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
                if (!cellNode) throw Error("AddColumnBefore: couldn't find node");
                tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow(cellNode);
            }

            if ($isTableSelection(selection)) {
                const tableBodyNode = $getNodeByKeyOrThrow<TableBodyNode>(selection.tableKey);
                tableNode = tableBodyNode.getParentOrThrow<ExtendedTableNode>();
                const resolvedTable = tableBodyNode.getResolvedTable();
                const columnID = resolvedTable[0].cells.length;
                for (const node of selection.getNodes()) {
                    if ($isTableCellNode(node)) {
                        const cellsTableNode = $getTableNodeFromLexicalNodeOrThrow(node);
                        if (cellsTableNode == tableBodyNode) {
                            const nodesColumnID = $getTableColumnIndexFromTableCellNode(node, resolvedTable);
                            if (nodesColumnID < columnID) {
                                columnID == columnID;
                                cellNode = node;
                            }
                        }
                    }
                }
            }

            if (!cellNode) throw Error("AddColumnBefore: node not found");
            tableNode?.addColumnsBefore(cellNode, value);
        },
            { tag: 'table-add-column-before' });

        menuContext.closeMenu();
    };

    return (
        <Submenu Option={OptionElement} disableBackground={true}>
            <TableContextNumberInput onInputAccepted={onInputAccepted} />
        </Submenu>
    );
}
