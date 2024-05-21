import { useContext } from "react";
import Submenu, { CotextSubmenuOptionProps } from "../../menu/submenu";
import { $getNodeByKeyOrThrow, $getSelection, $isRangeSelection, $setSelection } from "lexical";
import MenuItem from "../../menu/menuItem";
import {
    $getTableCellNodeFromLexicalNode, $getTableNodeFromLexicalNodeOrThrow, $isTableCellNode, $isTableSelection,
    TableCellNode
} from "@lexical/table";
import TableContextNumberInput from "./tableContextNumberInput";
import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode } from "../../../nodes/table/extendedTableNode";
import { $getTableColumnIndexFromTableCellNode } from "../../../plugins/tablePlugin/tableHelpers";
import { TableBodyNode } from "../../../nodes/table/tableBodyNode";
import { TableContextOptionProps } from "../tableContextOptions";
import { ContextMenuContextData } from "../../../plugins/contextMenuPlugin/contextMenuContext";
import { MenuContext } from "../../menu/menu";


export function TableContextAddColumnAfter({ editor }: TableContextOptionProps) {
    const menuContext = useContext(MenuContext) as ContextMenuContextData

    function AddColumnAfterIcon() {
        if ( !menuContext.theme.tableMenuTheme || !menuContext.theme.tableMenuTheme.AddColumnAfterIcon ) 
            throw Error("No theme for table menu!");

        return menuContext.theme.tableMenuTheme.AddColumnAfterIcon
    }

    const OptionElement = ({ children }: CotextSubmenuOptionProps) => {
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

export function TableContextAddColumnBefore({ editor }: TableContextOptionProps) {
    const menuContext = useContext(MenuContext) as ContextMenuContextData

    function AddColumnBeforeIcon() {
        if ( !menuContext.theme.tableMenuTheme || !menuContext.theme.tableMenuTheme.AddColumnBeforeIcon ) 
            throw Error("No theme for table menu!");

        return menuContext.theme.tableMenuTheme.AddColumnBeforeIcon
    }

    const OptionElement = ({ children }: CotextSubmenuOptionProps) => {
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

export function TableContextColumnRemove({ editor }: TableContextOptionProps) {
    const menuContext = useContext(MenuContext) as ContextMenuContextData

    function RemoveColumnIcon() {
        if ( !menuContext.theme.tableMenuTheme || !menuContext.theme.tableMenuTheme.RemoveColumnIcon ) 
            throw Error("No theme for table menu!");

        return menuContext.theme.tableMenuTheme.RemoveColumnIcon
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
