import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode, TableBodyNode } from "@editor/nodes/table";
import {
    $getTableCellNodeFromLexicalNode, $isTableSelection,
    TableCellNode
} from "@lexical/table";
import { $getNodeByKeyOrThrow, $getSelection, $isRangeSelection, $setSelection } from "lexical";
import { useMemo } from "react";
import { MenuItem, Submenu } from "../../menu";
import SubmenuIcon from "../../menu/submenuIcon";
import { TableContextMenuOptionProps } from "./tableContextMenuCommon";
import TableNumberInputContextMenu from "./tableNumberInputContextMenu";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";



export default function TableAddRowBeforeContextMenu({ editor }: TableContextMenuOptionProps) {
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
            $closeContextMenu(editor);
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
