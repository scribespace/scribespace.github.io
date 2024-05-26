import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { ExtendedTableNode, TableBodyNode } from "@editor/nodes/table";
import {
    $findTableNode, $isTableCellNode, $isTableNode, $isTableRowNode, $isTableSelection,
    TableCellNode, TableRowNode
} from "@lexical/table";
import { $getSelection, $setSelection } from "lexical";
import { useMemo } from "react";
import { MenuItem } from "../../menu";
import { TableContextMenuOptionProps } from "./tableContextMenuCommon";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";


export function TableMergeCellsContextMenu({ editor }: TableContextMenuOptionProps) {
    const {editorTheme}: MainTheme = useMainThemeContext();

    const MergeCellIcon = useMemo(()=>{
        return editorTheme.tableTheme.menuTheme.MergeCellIcon;
    },[editorTheme.tableTheme.menuTheme.MergeCellIcon]);

    const onClick = () => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isTableSelection(selection)) {
                const selectedNodes = selection.getNodes();
                const tableNodeID = 0;
                const firstRowNodeID = 1;
                const firstCellNodeID = 2;
                if (!$isTableNode(selectedNodes[0]) || !$isTableRowNode(selectedNodes[1]) || !$isTableCellNode(selectedNodes[2])) {
                    throw Error("Wrong selection. Cell isn't under index 2");
                }

                const tableBodyNode = selectedNodes[tableNodeID] as TableBodyNode;

                let columnsToMerge = 0;
                const firstRowNode = selectedNodes[firstRowNodeID];
                const cellsInFirstRow = new Set<TableCellNode>();
                for (const node of selectedNodes) {
                    if (node.getParent() == firstRowNode) {
                        const cellNode = node as TableCellNode;
                        if (!cellsInFirstRow.has(cellNode)) {
                            cellsInFirstRow.add(cellNode);
                            columnsToMerge += cellNode.getColSpan();
                        }
                    }
                }

                let rowsToMerge = 0;
                const rowsAdded = new Set<TableRowNode>();
                const cellsInRowsAdded = new Set<TableCellNode>();
                for (let n = firstRowNodeID; n < selectedNodes.length; ++n) {
                    const node = selectedNodes[n];
                    if ($isTableRowNode(node) && $findTableNode(node) == tableBodyNode) {
                        if (!rowsAdded.has(node)) {
                            const cellNode = selectedNodes[n + 1] as TableCellNode;
                            if (!cellsInRowsAdded.has(cellNode)) {
                                cellsInRowsAdded.add(cellNode);
                                const rowsSpan = cellNode.getRowSpan();
                                rowsToMerge += rowsSpan;

                                let nextRow: TableRowNode | null = node;
                                for (let s = 0; s < rowsSpan; ++s) {
                                    if (nextRow == null) throw Error("TableContextMergeCells: Trying to process null sibling");
                                    rowsAdded.add(nextRow as TableRowNode);
                                    nextRow = nextRow!.getNextSibling();
                                }
                            }
                        }
                    }
                }

                const firstCellNode = selectedNodes[firstCellNodeID] as TableCellNode;
                tableBodyNode.getParentOrThrow<ExtendedTableNode>().mergeCells(editor, firstCellNode, rowsToMerge, columnsToMerge);

                $setSelection(null);
                $closeContextMenu(editor);
            }
        });
    };

    return (
        <MenuItem onClick={onClick}>
            <MergeCellIcon/>
            <div>Merge Cells</div>
        </MenuItem>
    );
}
