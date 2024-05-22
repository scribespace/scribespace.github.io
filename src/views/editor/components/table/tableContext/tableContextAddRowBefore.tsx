import { MenuItem, Submenu } from "../../menu";
import { $getNodeByKeyOrThrow, $getSelection, $isRangeSelection, $setSelection } from "lexical";
import {
    $getTableCellNodeFromLexicalNode, $isTableSelection,
    TableCellNode
} from "@lexical/table";
import TableContextNumberInput from "./tableContextNumberInput";
import { useContextMenuContext } from "@editor/plugins/contextMenuPlugin/context";
import { PropsWithChildren } from "react";
import { TableContextOptionProps } from "./tableContextCommon";
import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode, TableBodyNode } from "@editor/nodes/table";



export default function TableContextAddRowBefore({ editor }: TableContextOptionProps) {
    const menuContext = useContextMenuContext();

    function AddRowBeforeIcon() {
        if (!menuContext.theme.tableMenuTheme || !menuContext.theme.tableMenuTheme.AddRowBeforeIcon)
            throw Error("No theme for table menu!");

        return menuContext.theme.tableMenuTheme.AddRowBeforeIcon;
    }

    const OptionElement = ({ children }: PropsWithChildren) => {
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
