import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode, TableBodyNode } from "@editor/nodes/table";
import { useContextMenuContext } from "@editor/plugins/contextMenuPlugin/context";
import {
    $getTableCellNodeFromLexicalNode, $isTableSelection,
    TableCellNode
} from "@lexical/table";
import { useMainThemeContext } from "@src/mainThemeContext";
import { MainTheme } from "@src/theme";
import { $getNodeByKeyOrThrow, $getSelection, $isRangeSelection, $setSelection } from "lexical";
import { useMemo } from "react";
import { MenuItem, Submenu } from "../../menu";
import SubmenuIcon from "../../menu/submenuIcon";
import { TableContextMenuOptionProps } from "./tableCommon";
import TableNumberInputContextMenu from "./tableNumberInput";



export default function TableAddRowBeforeContextMenu({ editor }: TableContextMenuOptionProps) {
    const menuContext = useContextMenuContext();
    const {editorTheme}: MainTheme = useMainThemeContext();

    const AddRowBeforeIcon = useMemo(()=>{
        return editorTheme.tableTheme.menuTheme.AddRowBeforeIcon;
    },[editorTheme.tableTheme.menuTheme.AddRowBeforeIcon]);

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
        <Submenu disableBackground={true}>
            <MenuItem>
                <AddRowBeforeIcon/>
                <div>Insert Row Before</div>
                <SubmenuIcon/>
            </MenuItem>
            <TableNumberInputContextMenu onInputAccepted={onInputAccepted} />
        </Submenu>
    );
}
