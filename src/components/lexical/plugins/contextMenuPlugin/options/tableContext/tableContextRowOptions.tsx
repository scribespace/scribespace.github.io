import { useContext } from "react";
import { ContextMenuContext, ContextMenuContextObject } from "../../contextMenuPlugin";
import ContextSubmenu, { CotextSubmenuOptionProps } from "../../contextSubmenu";
import { $getNodeByKeyOrThrow, $getSelection, $isRangeSelection, $setSelection } from "lexical";
import ContextMenuItem from "../../contextMenuItem";
import {
    $getTableCellNodeFromLexicalNode, $getTableNodeFromLexicalNodeOrThrow, $getTableRowIndexFromTableCellNode, $isTableCellNode, $isTableSelection,
    TableCellNode
} from "@lexical/table";
import { ExtendedTableNode } from "../../../tablePlugin/nodes/extendedTableNode";
import { TableContextOptionProps, TableContextNumberInputEditor } from "../tableContextOptions";


export function TableContextAddRowBefore({ editor, icons }: TableContextOptionProps) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext);

    const OptionElement = ({ children }: CotextSubmenuOptionProps) => {
        return (
            <ContextMenuItem Icon={icons.AddRowBeforeIcon} title="Insert Row Before">
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
                if (!cellNode) throw Error("AddRowBefore: couldn't find node");
                tableNode = $getTableNodeFromLexicalNodeOrThrow(cellNode) as ExtendedTableNode;
            }

            if ($isTableSelection(selection)) {
                tableNode = $getNodeByKeyOrThrow<ExtendedTableNode>(selection.tableKey);
                if (selection.anchor.isBefore(selection.focus)) {
                    cellNode = selection.anchor.getNode() as TableCellNode;
                } else {
                    cellNode = selection.focus.getNode() as TableCellNode;
                }
            }

            if (!cellNode) throw Error("AddRowBefore: node not found");
            tableNode?.addRowsBefore(cellNode, value);
        },
            { tag: 'table-add-row-before' });

        contextObject.closeContextMenu();
    };

    return (
        <ContextSubmenu Option={OptionElement} disableBackground={true}>
            <TableContextNumberInputEditor onInputAccepted={onInputAccepted} />
        </ContextSubmenu>
    );
}

export function TableContextAddRowAfter({ editor, icons }: TableContextOptionProps) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext);

    const OptionElement = ({ children }: CotextSubmenuOptionProps) => {
        return (
            <ContextMenuItem Icon={icons.AddRowAfterIcon} title="Insert Row After">
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
                if (!cellNode) throw Error("AddRowAfter: couldn't find node");
                tableNode = $getTableNodeFromLexicalNodeOrThrow(cellNode) as ExtendedTableNode;
            }

            if ($isTableSelection(selection)) {
                tableNode = $getNodeByKeyOrThrow<ExtendedTableNode>(selection.tableKey);
                let rowID = -1;
                for (const node of selection.getNodes()) {
                    if ($isTableCellNode(node)) {
                        const cellsTableNode = $getTableNodeFromLexicalNodeOrThrow(node);
                        if (cellsTableNode == tableNode) {
                            const nodesRowID = $getTableRowIndexFromTableCellNode(node);
                            if (nodesRowID > rowID) {
                                rowID == nodesRowID;
                                cellNode = node;
                            }
                        }
                    }
                }
            }

            if (!cellNode) throw Error("AddRowAfter: node not found");
            tableNode?.addRowsAfter(cellNode, value);
        },
            { tag: 'table-add-row-after' });

        contextObject.closeContextMenu();
    };

    return (
        <ContextSubmenu Option={OptionElement} disableBackground={true}>
            <TableContextNumberInputEditor onInputAccepted={onInputAccepted} />
        </ContextSubmenu>
    );
}

export function TableContextRowRemove({ editor, icons }: TableContextOptionProps) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext);

    const onClick = () => {
        editor.update(() => {
            let tableNode: ExtendedTableNode | null = null;
            let cellNode: TableCellNode | null = null;
            let rowsCount = 0;

            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                cellNode = $getTableCellNodeFromLexicalNode(selection.anchor.getNode());
                if (!$isTableCellNode(cellNode)) throw Error("TableContextRowRemove: expecetd cell node");
                tableNode = $getTableNodeFromLexicalNodeOrThrow(cellNode) as ExtendedTableNode;
                rowsCount = 1;
            }

            if ($isTableSelection(selection)) {
                if (selection.anchor.isBefore(selection.focus)) {
                    cellNode = selection.anchor.getNode() as TableCellNode;
                } else {
                    cellNode = selection.focus.getNode() as TableCellNode;
                }
                tableNode = $getTableNodeFromLexicalNodeOrThrow(cellNode) as ExtendedTableNode;

                const rowID = $getTableRowIndexFromTableCellNode(cellNode);
                for (const node of selection.getNodes()) {
                    if ($isTableCellNode(node)) {
                        if (tableNode == $getTableNodeFromLexicalNodeOrThrow(node)) {
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
            contextObject.closeContextMenu();
        },
            { tag: 'table-row-remove' });
    };

    return <ContextMenuItem Icon={icons.RemoveRowIcon} title="Remove Row" onClick={onClick} />;
}
