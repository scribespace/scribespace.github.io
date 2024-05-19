import { useContext } from "react";
import { ContextMenuContext, ContextMenuContextObject } from "../../contextMenuPlugin";
import ContextSubmenu, { CotextSubmenuOptionProps } from "../../contextSubmenu";
import { $getNodeByKeyOrThrow, $getSelection, $isRangeSelection, $setSelection } from "lexical";
import ContextMenuItem from "../../contextMenuItem";
import {
    $getTableCellNodeFromLexicalNode, $getTableNodeFromLexicalNodeOrThrow, $isTableCellNode, $isTableSelection,
    TableCellNode
} from "@lexical/table";
import TableContextNumberInputEditor from "./tableContextNumberInputEditor";
import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode } from "../../../tablePlugin/nodes/extendedTableNode";
import { $getTableColumnIndexFromTableCellNode } from "../../../tablePlugin/tableHelpers";
import { TableBodyNode } from "../../../tablePlugin/nodes/tableBodyNode";
import { TableContextOptionProps } from "../tableContextOptions";


export function TableContextAddColumnAfter({ editor, icons }: TableContextOptionProps) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext);

    const OptionElement = ({ children }: CotextSubmenuOptionProps) => {
        return (
            <ContextMenuItem Icon={icons.AddColumnAfterIcon} title="Insert Column After">
                {children}
            </ContextMenuItem>
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
                let columnID = -1;
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

        contextObject.closeContextMenu();
    };

    return (
        <ContextSubmenu Option={OptionElement} disableBackground={true}>
            <TableContextNumberInputEditor onInputAccepted={onInputAccepted} />
        </ContextSubmenu>
    );
}

export function TableContextAddColumnBefore({ editor, icons }: TableContextOptionProps) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext);

    const OptionElement = ({ children }: CotextSubmenuOptionProps) => {
        return (
            <ContextMenuItem Icon={icons.AddColumnBeforeIcon} title="Insert Column Before">
                {children}
            </ContextMenuItem>
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
                let columnID = resolvedTable[0].cells.length;
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

        contextObject.closeContextMenu();
    };

    return (
        <ContextSubmenu Option={OptionElement} disableBackground={true}>
            <TableContextNumberInputEditor onInputAccepted={onInputAccepted} />
        </ContextSubmenu>
    );
}

export function TableContextColumnRemove({ editor, icons }: TableContextOptionProps) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext);

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
            contextObject.closeContextMenu();
        },
            { tag: 'table-column-remove' });
    };

    return <ContextMenuItem Icon={icons.RemoveColumnIcon} title="Remove Column" onClick={onClick} />;
}
