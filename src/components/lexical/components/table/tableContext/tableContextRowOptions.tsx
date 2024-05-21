import { useContext } from "react";
import Submenu, { CotextSubmenuOptionProps } from "../../menu/submenu";
import { $getNodeByKeyOrThrow, $getSelection, $isRangeSelection, $setSelection } from "lexical";
import MenuItem from "../../menu/menuItem";
import {
    $getTableCellNodeFromLexicalNode, $getTableNodeFromLexicalNodeOrThrow, $getTableRowIndexFromTableCellNode, $isTableCellNode, $isTableSelection,
    TableCellNode
} from "@lexical/table";
import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode } from "../../../nodes/table/extendedTableNode";
import { TableContextOptionProps } from "../tableContextOptions";
import TableContextNumberInput from "./tableContextNumberInput";
import { TableBodyNode } from "../../../nodes/table/tableBodyNode";
import { ContextMenuContextData } from "../../../plugins/contextMenuPlugin/contextMenuContext";
import { MenuContext } from "../../menu/menu";


export function TableContextAddRowBefore({ editor }: TableContextOptionProps) {
    const menuContext = useContext(MenuContext) as ContextMenuContextData

    function AddRowBeforeIcon() {
        if ( !menuContext.theme.tableMenuTheme || !menuContext.theme.tableMenuTheme.AddRowBeforeIcon ) 
            throw Error("No theme for table menu!");

        return menuContext.theme.tableMenuTheme.AddRowBeforeIcon
    }

    const OptionElement = ({ children }: CotextSubmenuOptionProps) => {
        return (
            <MenuItem Icon={AddRowBeforeIcon()} title="Insert Row Before">
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
                if (!cellNode) throw Error("AddRowBefore: couldn't find node");
                tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow(cellNode);
            }

            if ($isTableSelection(selection)) {
                const tableBodyNode = $getNodeByKeyOrThrow<TableBodyNode>(selection.tableKey);
                tableNode = tableBodyNode.getParentOrThrow<ExtendedTableNode>();
                if (selection.anchor.isBefore(selection.focus)) {
                    cellNode = selection.anchor.getNode() as TableCellNode;
                } else {
                    cellNode = selection.focus.getNode() as TableCellNode;
                }
            }

            if (!cellNode) throw Error("AddRowBefore: node not found");
            tableNode?.addRowsBefore(cellNode, value);

            $setSelection(null);
            menuContext.closeMenu();
        },
            { tag: 'table-add-row-before' });
    };

    return (
        <Submenu Option={OptionElement} disableBackground={true}>
            <TableContextNumberInput onInputAccepted={onInputAccepted} />
        </Submenu>
    );
}

export function TableContextAddRowAfter({ editor }: TableContextOptionProps) {
    const menuContext = useContext(MenuContext) as ContextMenuContextData

    function AddRowAfterIcon() {
        if ( !menuContext.theme.tableMenuTheme || !menuContext.theme.tableMenuTheme.AddRowAfterIcon ) 
            throw Error("No theme for table menu!");

        return menuContext.theme.tableMenuTheme.AddRowAfterIcon
    }

    const OptionElement = ({ children }: CotextSubmenuOptionProps) => {
        return (
            <MenuItem Icon={AddRowAfterIcon()} title="Insert Row After">
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
                if (!cellNode) throw Error("AddRowAfter: couldn't find node");
                tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow(cellNode);
            }

            if ($isTableSelection(selection)) {
                const tableBodyNode = $getNodeByKeyOrThrow<TableBodyNode>(selection.tableKey);
                tableNode = tableBodyNode.getParentOrThrow<ExtendedTableNode>()
                let rowID = -1;
                for (const node of selection.getNodes()) {
                    if ($isTableCellNode(node)) {
                        const cellsTableNode = $getTableNodeFromLexicalNodeOrThrow(node);
                        if (cellsTableNode == tableBodyNode) {
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

        menuContext.closeMenu();
    };

    return (
        <Submenu Option={OptionElement} disableBackground={true}>
            <TableContextNumberInput onInputAccepted={onInputAccepted} />
        </Submenu>
    );
}

export function TableContextRowRemove({ editor }: TableContextOptionProps) {
    const menuContext = useContext(MenuContext) as ContextMenuContextData

    function RemoveRowIcon() {
        if ( !menuContext.theme.tableMenuTheme || !menuContext.theme.tableMenuTheme.RemoveRowIcon ) 
            throw Error("No theme for table menu!");

        return menuContext.theme.tableMenuTheme.RemoveRowIcon
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
