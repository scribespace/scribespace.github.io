import { useContext, useEffect, useState } from "react";
import { $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import { 
    $findCellNode, $isTableCellNode, $isTableSelection,  
} from "@lexical/table";
import { SeparatorHorizontal, SeparatorHorizontalStrong } from "../separator";
import TableContextSplitCells from "./tableContext/tableContextSplitCells";
import TableContextMergeCells from "./tableContext/tableContextMergeCells";
import TableContextCreate from "./tableContext/tableContextCreate";
import { TableContextDelete } from "./tableContext/tableContextDelete";
import { TableContextRowRemove, TableContextAddRowBefore, TableContextAddRowAfter } from "./tableContext/tableContextRowOptions";
import { TableContextColumnRemove, TableContextAddColumnBefore, TableContextAddColumnAfter } from "./tableContext/tableContextColumnOptions";
import { MenuContext } from "../menu/menu";
import { ContextMenuContextData } from "../../plugins/contextMenuPlugin/contextMenuPlugin";


export interface TableContextOptionProps {
    editor: LexicalEditor,
}

interface TableContextOptionsProps {
    editor: LexicalEditor,
}

export default function TableContextOptions({editor}: TableContextOptionsProps) {
    const menuContext = useContext(MenuContext) as ContextMenuContextData

    const [insideTable, setInsideTable] = useState<boolean>(false)
    const [cellsSelected, setCellsSelected] = useState<boolean>(false)
    const [mergedCellSelected, setMergedCellSelected] = useState<boolean>(false)

    useEffect(()=>{
        editor.update(()=>{
            let insideTableState = false;
            let cellsSelectedState = false;
            let mergedCellSelectedState = false;

            const selection = $getSelection()
            if ( selection ) {
                if ( $isRangeSelection(selection) ) {
                    let allNodesInTable = true;
                    let anyMergedNode = false;
                    for ( const node of selection.getNodes() ) {
                        const tableNode = $findCellNode(node)
                        anyMergedNode = anyMergedNode || ((tableNode != null) && (tableNode.getColSpan() > 1 || tableNode.getRowSpan() > 1));
                        allNodesInTable = allNodesInTable && (tableNode != null)
                    }

                    insideTableState = allNodesInTable;
                    mergedCellSelectedState = anyMergedNode;
                }              
                
                if ( $isTableSelection(selection) ) {
                    let anyMergedNode = false;
                    const selectedNodes = selection.getNodes()
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

            setInsideTable(insideTableState)
            setCellsSelected(cellsSelectedState)
            setMergedCellSelected(mergedCellSelectedState)
        })
    },[menuContext.mousePosition])

    return (
        <>
            <SeparatorHorizontalStrong/>
            <TableContextCreate editor={editor}/>
            {insideTable && 
                <TableContextDelete editor={editor}/>
            }
            {(cellsSelected || mergedCellSelected) && (
                <>
                <SeparatorHorizontal/>
                {cellsSelected && <TableContextMergeCells editor={editor}/>}
                {mergedCellSelected && <TableContextSplitCells editor={editor}/>}
                </>
            )}
            {insideTable && (
            <>
                <SeparatorHorizontal/>
                <TableContextColumnRemove editor={editor}/>
                <TableContextRowRemove editor={editor}/>
                <SeparatorHorizontal/>
                <TableContextAddColumnBefore editor={editor}/>
                <TableContextAddColumnAfter editor={editor}/>
                <TableContextAddRowBefore editor={editor}/>
                <TableContextAddRowAfter editor={editor}/>
            </>
            )}           
        </>
    )
}