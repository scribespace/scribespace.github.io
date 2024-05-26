import { useEffect, useState } from "react";
import { $getNodeByKey, $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import {
    $findCellNode, $findTableNode, $isTableCellNode, $isTableSelection,
} from "@lexical/table";


import { SeparatorHorizontalStrong, SeparatorHorizontal } from "../separators";

import { useContextMenuContext } from "@editor/plugins/contextMenuPlugin/context";
import { ColumnAddAfterContextMenu, ColumnAddBeforeContextMenu, ColumnRemoveContextMenu, DeleteContextMenu, MergeCellsContextMenu, SplitCellsContextMenu, TableCreateContextMenu, TableRowAddAfterContextMenu, TableRowAddBeforeContextMenu, TableRowRemoveContextMenu } from "./contextMenu";
import { $isLayoutBodyNode } from "../../nodes/layout";

interface TableContextOptionsProps {
    editor: LexicalEditor,
}

export function TableLayoutContextOptions({editor}: TableContextOptionsProps) {
    const menuContext = useContextMenuContext();

    const [insideTable, setInsideTable] = useState<boolean>(false);
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
    },[editor, menuContext.mousePosition]);

    return (
        <>
            <SeparatorHorizontalStrong/>
            <TableCreateContextMenu editor={editor}/>
            {insideTable && 
                <DeleteContextMenu editor={editor}/>
            }
            {(cellsSelected || mergedCellSelected) && (
                <>
                <SeparatorHorizontal/>
                {cellsSelected && <MergeCellsContextMenu editor={editor}/>}
                {mergedCellSelected && <SplitCellsContextMenu editor={editor}/>}
                </>
            )}
            {insideTable && (
            <>
                <SeparatorHorizontal/>
                <ColumnRemoveContextMenu editor={editor}/>
                {!isLayout && <TableRowRemoveContextMenu editor={editor}/>}
                <SeparatorHorizontal/>
                <ColumnAddBeforeContextMenu editor={editor}/>
                <ColumnAddAfterContextMenu editor={editor}/>
                {!isLayout && 
                    <>
                    <TableRowAddBeforeContextMenu editor={editor}/>
                    <TableRowAddAfterContextMenu editor={editor}/>
                    </>
                }
            </>
            )}           
        </>
    );
}