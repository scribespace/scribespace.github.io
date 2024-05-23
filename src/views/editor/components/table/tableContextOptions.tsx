import { useEffect, useState } from "react";
import { $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import {
    $findCellNode, $isTableCellNode, $isTableSelection,
} from "@lexical/table";


import { SeparatorHorizontalStrong, SeparatorHorizontal } from "../separators";
import { 
    TableAddColumnAfterContextMenu, 
    TableAddColumnBeforeContextMenu, 
    TableAddRowAfterContextMenu, 
    TableAddRowBeforeContextMenu, 
    TableColumnRemoveContextMenu, 
    TableCreateContextMenu, 
    TableDeleteContextMenu, 
    TableMergeCellsContextMenu, 
    TableRowRemoveContextMenu, 
    TableSplitCellsContextMenu 
} from "./contextMenu";
import { useContextMenuContext } from "@editor/plugins/contextMenuPlugin/context";

interface TableContextOptionsProps {
    editor: LexicalEditor,
}

export default function TableContextOptions({editor}: TableContextOptionsProps) {
    const menuContext = useContextMenuContext();

    const [insideTable, setInsideTable] = useState<boolean>(false);
    const [cellsSelected, setCellsSelected] = useState<boolean>(false);
    const [mergedCellSelected, setMergedCellSelected] = useState<boolean>(false);

    useEffect(()=>{
        editor.update(()=>{
            let insideTableState = false;
            let cellsSelectedState = false;
            let mergedCellSelectedState = false;

            const selection = $getSelection();
            if ( selection ) {
                if ( $isRangeSelection(selection) ) {
                    let allNodesInTable = true;
                    let anyMergedNode = false;
                    for ( const node of selection.getNodes() ) {
                        const tableNode = $findCellNode(node);
                        anyMergedNode = anyMergedNode || ((tableNode != null) && (tableNode.getColSpan() > 1 || tableNode.getRowSpan() > 1));
                        allNodesInTable = allNodesInTable && (tableNode != null);
                    }

                    insideTableState = allNodesInTable;
                    mergedCellSelectedState = anyMergedNode;
                }              
                
                if ( $isTableSelection(selection) ) {
                    let anyMergedNode = false;
                    const selectedNodes = selection.getNodes();
                    for ( const node of selectedNodes ) {
                        if ( $isTableCellNode(node) ) {
                            anyMergedNode = anyMergedNode || (node.getColSpan() > 1 || node.getRowSpan() > 1);
                        }
                    }

                    insideTableState = true;
                    cellsSelectedState = true;
                    mergedCellSelectedState = anyMergedNode;
                }
            }

            setInsideTable(insideTableState);
            setCellsSelected(cellsSelectedState);
            setMergedCellSelected(mergedCellSelectedState);
        });
    },[editor, menuContext.mousePosition]);

    return (
        <>
            <SeparatorHorizontalStrong/>
            <TableCreateContextMenu editor={editor}/>
            {insideTable && 
                <TableDeleteContextMenu editor={editor}/>
            }
            {(cellsSelected || mergedCellSelected) && (
                <>
                <SeparatorHorizontal/>
                {cellsSelected && <TableMergeCellsContextMenu editor={editor}/>}
                {mergedCellSelected && <TableSplitCellsContextMenu editor={editor}/>}
                </>
            )}
            {insideTable && (
            <>
                <SeparatorHorizontal/>
                <TableColumnRemoveContextMenu editor={editor}/>
                <TableRowRemoveContextMenu editor={editor}/>
                <SeparatorHorizontal/>
                <TableAddColumnBeforeContextMenu editor={editor}/>
                <TableAddColumnAfterContextMenu editor={editor}/>
                <TableAddRowBeforeContextMenu editor={editor}/>
                <TableAddRowAfterContextMenu editor={editor}/>
            </>
            )}           
        </>
    );
}