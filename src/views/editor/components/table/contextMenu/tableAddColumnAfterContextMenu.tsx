import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode, TableBodyNode } from '@editor/nodes/table';
import { $getTableColumnIndexFromTableCellNode } from "@editor/plugins/tablePlugin/utils";
import {
    $getTableCellNodeFromLexicalNode, $getTableNodeFromLexicalNodeOrThrow, $isTableCellNode, $isTableSelection,
    TableCellNode
} from "@lexical/table";
import { $getNodeByKeyOrThrow, $getSelection, $isRangeSelection } from "lexical";
import { useMemo } from "react";
import { MenuItem, Submenu } from "../../menu";
import SubmenuIcon from '../../menu/submenuIcon';
import { TableContextMenuOptionProps } from "./tableContextMenuCommon";
import {TableNumberInputContextMenu} from "./tableNumberInputContextMenu";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";

export function TableAddColumnAfterContextMenu({ editor }: TableContextMenuOptionProps) {
    const {editorTheme}: MainTheme = useMainThemeContext();

    const AddColumnAfterIcon = useMemo(()=>{
        return editorTheme.tableTheme.menuTheme.AddColumnAfterIcon;
    },[editorTheme.tableTheme.menuTheme.AddColumnAfterIcon]);

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

        $closeContextMenu(editor);
    };

    return (
        <Submenu className="">
            <MenuItem>
                <AddColumnAfterIcon/>
                <div>Insert Column Before</div>
                <SubmenuIcon/>
            </MenuItem>
            <TableNumberInputContextMenu onInputAccepted={onInputAccepted} />
        </Submenu>
    );
}
