import { useEffect, useState } from "react";
import { $getNodeByKey, $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import {
    $findCellNode, $findTableNode, $isTableCellNode, $isTableSelection,
} from "@lexical/table";


import { SeparatorHorizontalStrong, SeparatorHorizontal } from "../separators";

import { useContextMenuContext } from "@editor/plugins/contextMenuPlugin/context";
import { ColumnAddAfterContextMenu, ColumnAddBeforeContextMenu, ColumnRemoveContextMenu, DeleteContextMenu, MergeCellsContextMenu, SplitCellsContextMenu, TableCreateContextMenu, TableRowAddAfterContextMenu, TableRowAddBeforeContextMenu, TableRowRemoveContextMenu } from "./contextMenu";
import { $isLayoutBodyNode } from "../../nodes/layout";
import { MenuItem } from "../menu";
import { LayoutCreateContextMenu } from "./contextMenu/layoutCreateContextMenu";

interface TableContextOptionsProps {
    editor: LexicalEditor,
}

export function TableLayoutContextOptions({editor}: TableContextOptionsProps) {
    const {mousePosition,theme: {menuLabel}} = useContextMenuContext();

    const [insideTableLayout, setInsideTable] = useState<boolean>(false);
    const [cellsSelected, setCellsSelected] = useState<boolean>(false);
    const [mergedCellSelected, setMergedCellSelected] = useState<boolean>(false);
    const [isLayout, setIsLayout] = useState<boolean>(false);

    useEffect(()=>{
        editor.update(()=>{
            let insideTableState = false;
            let cellsSelectedState = false;
            let mergedCellSelectedState = false;
            let isLayoutState = false;

            const selection = $getSelection();
            if ( selection ) {
                let anyMergedNode = false;
                let selectedLayout = true;

                if ( $isRangeSelection(selection) ) {
                    let allNodesInTable = true;
                    for ( const node of selection.getNodes() ) {
                        const tableCell = $findCellNode(node);
                        const tableNode = $findTableNode(node);
                        anyMergedNode = anyMergedNode || ((tableCell != null) && (tableCell.getColSpan() > 1 || tableCell.getRowSpan() > 1));
                        allNodesInTable = allNodesInTable && (tableCell != null);
                        selectedLayout = selectedLayout && (tableNode != null) && $isLayoutBodyNode(tableNode);
                    }

                    insideTableState = allNodesInTable;
                }              
                
                if ( $isTableSelection(selection) ) {
                    const selectedNodes = selection.getNodes();
                    for ( const node of selectedNodes ) {
                        if ( $isTableCellNode(node) ) {
                            anyMergedNode = anyMergedNode || (node.getColSpan() > 1 || node.getRowSpan() > 1);
                        }
                    }

                    insideTableState = true;
                    cellsSelectedState = true;
                    selectedLayout = $isLayoutBodyNode( $getNodeByKey(selection.tableKey) );
                }

                isLayoutState = selectedLayout;
                mergedCellSelectedState = anyMergedNode;
            }

            setInsideTable(insideTableState);
            setCellsSelected(cellsSelectedState);
            setMergedCellSelected(mergedCellSelectedState);
            setIsLayout( isLayoutState );
        });
    },[editor, mousePosition]);

    return (
        <>
            <SeparatorHorizontalStrong/>
            <TableCreateContextMenu/>
            <LayoutCreateContextMenu/>

            {insideTableLayout && (
                <>
                <SeparatorHorizontalStrong/>
                {isLayout ?
                (<MenuItem>
                    <div className={menuLabel}>Layout</div>
                </MenuItem>) :
                (<MenuItem>
                    <div className={menuLabel}>Table</div>
                </MenuItem>)}
                </>
            )}

            {insideTableLayout && 
                <DeleteContextMenu/>
            }
            {(cellsSelected || mergedCellSelected) && (
                <>
                <SeparatorHorizontal/>
                {cellsSelected && <MergeCellsContextMenu/>}
                {mergedCellSelected && <SplitCellsContextMenu/>}
                </>
            )}
            {insideTableLayout && (
            <>
                <SeparatorHorizontal/>
                <ColumnRemoveContextMenu/>
                {!isLayout && <TableRowRemoveContextMenu/>}
                <SeparatorHorizontal/>
                <ColumnAddBeforeContextMenu/>
                <ColumnAddAfterContextMenu/>
                {!isLayout && 
                    <>
                    <TableRowAddBeforeContextMenu/>
                    <TableRowAddAfterContextMenu/>
                    </>
                }
            </>
            )}           
        </>
    );
}