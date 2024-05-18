import { useContext, useEffect, useState } from "react";
import { ImTable2 } from "react-icons/im";
import { TbColumnInsertRight, TbColumnRemove, TbRowInsertBottom, TbRowInsertTop, TbRowRemove } from "react-icons/tb";
import { ContextMenuContext, ContextMenuContextObject } from "../contextMenuPlugin";
import ContextSubmenu, { CotextSubmenuOptionProps } from "../contextSubmenu";
import TableCreatorEditor from "../../tablePlugin/tableCreatorEditor";
import { $getNodeByKey, $getSelection, $insertNodes, $isRangeSelection, $setSelection, COMMAND_PRIORITY_LOW, LexicalEditor, SELECTION_CHANGE_COMMAND } from "lexical";
import { $createExtendedTableNodeWithDimensions, ExtendedTableNode } from "../../tablePlugin/nodes/extendedTableNode";
import ContextMenuItem from "../contextMenuItem";
import { $createTableCellNode, $findCellNode, $findTableNode, $getTableNodeFromLexicalNodeOrThrow, $isTableCellNode, $isTableNode, $isTableRowNode, $isTableSelection, TableCellHeaderStates, TableCellNode, TableNode, TableRowNode, TableSelection, getTableObserverFromTableElement } from "@lexical/table";
import { ContextMenuSeparator, ContextMenuSeparatorStrong } from "../contextMenu";
import { AiOutlineMergeCells, AiOutlineSplitCells } from "react-icons/ai";
import { mergeRegister } from "@lexical/utils";
import { $createTableCellNodeWithParagraph } from "../../tablePlugin/tableHelpers";

interface TableContextOptionProps {
    editor: LexicalEditor
}
export function TableContextCreate({editor}: TableContextOptionProps) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext)

    const OptionElement = ({children}: CotextSubmenuOptionProps) => {
       return (
        <ContextMenuItem Icon={ImTable2} title="Create Table">
            {children}
        </ContextMenuItem>
       )
    }

    function onClick(rowsCount: number, columnsCount: number) {
        editor.update(()=>{
            const tableNode = $createExtendedTableNodeWithDimensions(rowsCount, columnsCount);
            $insertNodes([tableNode])
        })

        contextObject.closeContextMenu()
    }

    return (
        <ContextSubmenu Option={OptionElement} disableBackground={true}>
            <TableCreatorEditor gridSize="100px" rowsCount={10} columnsCount={10} onClick={onClick}/>
        </ContextSubmenu>
    )
}

const onClickNotImplemented = () => {
    throw Error("Not implemented")
}

export function TableContextAddColumnRight( {editor}: TableContextOptionProps ) {
    return <ContextMenuItem Icon={TbColumnInsertRight} title="Insert Column Right" onClick={onClickNotImplemented}/>
}

export function TableContextAddColumnLeft( {editor}: TableContextOptionProps ) {
    return <ContextMenuItem Icon={TbColumnInsertRight} title="Insert Column Left" onClick={onClickNotImplemented}/>
}

export function TableContextAddRowTop( {editor}: TableContextOptionProps ) {
    return <ContextMenuItem Icon={TbRowInsertTop} title="Insert Row Top" onClick={onClickNotImplemented}/>
}

export function TableContextAddRowBottom( {editor}: TableContextOptionProps ) {
    return <ContextMenuItem Icon={TbRowInsertBottom} title="Insert Row Bottom" onClick={onClickNotImplemented}/>
}

export function TableContextColumnRemove( {editor}: TableContextOptionProps ) {
    return <ContextMenuItem Icon={TbColumnRemove} title="Remove Column" onClick={onClickNotImplemented}/>
}

export function TableContextRowRemove( {editor}: TableContextOptionProps ) {
    return <ContextMenuItem Icon={TbRowRemove} title="Remove Row" onClick={onClickNotImplemented}/>
}

export function TableContextMergeCells( {editor}: TableContextOptionProps ) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext)
    
    const onClick = () => {
        editor.update( () => {
            const selection = $getSelection()
            if ( $isTableSelection(selection) ) {
                const selectedNodes = selection.getNodes();
                const tableNodeID = 0;
                const firstRowNodeID = 1;
                const firstCellNodeID = 2;
                if ( !$isTableNode(selectedNodes[0]) || !$isTableRowNode(selectedNodes[1]) || !$isTableCellNode(selectedNodes[2]) ) {
                    throw Error("Wrong selection. Cell isn't under index 2")
                }

                const tableNode = selectedNodes[tableNodeID] as ExtendedTableNode;

                let columnsToMerge = 0;
                const firstRowNode = selectedNodes[firstRowNodeID];
                const cellsInFirstRow = new Set<TableCellNode>();
                for ( const node of selectedNodes) {
                    if ( node.getParent() == firstRowNode ) {
                        const cellNode = node as TableCellNode;
                        if ( !cellsInFirstRow.has(cellNode) ) {
                            cellsInFirstRow.add(cellNode)
                            columnsToMerge += cellNode.getColSpan();
                        }
                    }
                }

                let rowsToMerge = 0;
                const rowsAdded = new Set<TableRowNode>();
                const cellsInRowsAdded = new Set<TableCellNode>();
                for ( let n = firstRowNodeID; n < selectedNodes.length; ++n ) {
                    const node = selectedNodes[n];
                    if ( $isTableRowNode(node) && $findTableNode(node) == tableNode) {
                        if ( !rowsAdded.has(node) ) {
                            const cellNode = selectedNodes[n+1] as TableCellNode;
                            if ( !cellsInRowsAdded.has(cellNode) ) {
                                cellsInRowsAdded.add(cellNode);
                                const rowsSpan = cellNode.getRowSpan();
                                rowsToMerge += rowsSpan;

                                let nextRow: TableRowNode | null = node;
                                for ( let s = 0; s < rowsSpan; ++s ) {
                                    if ( nextRow == null ) throw Error("TableContextMergeCells: Trying to process null sibling")
                                    rowsAdded.add( nextRow  as TableRowNode );
                                    nextRow = nextRow!.getNextSibling();
                                }
                            }
                        }
                    }
                }
                
                const firstCellNode = selectedNodes[firstCellNodeID] as TableCellNode;
                tableNode.mergeCells(editor, firstCellNode, rowsToMerge, columnsToMerge);

                $setSelection(null)
                contextObject.closeContextMenu()
            }
        })
    }

    return <ContextMenuItem Icon={AiOutlineMergeCells} title="Merge Cells" onClick={onClick}/>
}

export function TableContextSplitCells( {editor}: TableContextOptionProps ) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext)
    const onClick = () => {
            editor.update(()=>{
            const selection = $getSelection();
            let tableNode: ExtendedTableNode | null = null;

            const nodesKeys = new Set<string>()
            if ( $isTableSelection(selection )) {
                tableNode = $getNodeByKey( selection.tableKey )
                for ( const node of selection.getNodes()) {
                    if ( $isTableCellNode(node) && !nodesKeys.has(node.getKey())) {
                        nodesKeys.add(node.getKey())
                    }
                }
            }

            if ( $isRangeSelection(selection )) {
                const node = $findCellNode(selection.getNodes()[0])
                if ( node ) { 
                    tableNode = $getTableNodeFromLexicalNodeOrThrow(node) as ExtendedTableNode
                    nodesKeys.add(node.getKey())
                }
            }

            for ( const nodeKey of nodesKeys) {
                const node = $getNodeByKey(nodeKey) as TableCellNode
                tableNode?.splitCell(editor, node)
            }

            $setSelection(null)
            contextObject.closeContextMenu()
        })
    }

    return <ContextMenuItem Icon={AiOutlineSplitCells} title="Split Cells" onClick={onClick}/>
}

export default function TableContextOptions({editor}: TableContextOptionProps) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext)

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
    },[contextObject.mousePosition])

    return (
        <>
            <ContextMenuSeparatorStrong/>
            <TableContextCreate editor={editor}/>
            {insideTable && (
            <>
                <ContextMenuSeparator/>
                <TableContextAddColumnLeft editor={editor}/>
                <TableContextAddColumnRight editor={editor}/>
                <TableContextAddRowTop editor={editor}/>
                <TableContextAddRowBottom editor={editor}/>
                <ContextMenuSeparator/>
                <TableContextColumnRemove editor={editor}/>
                <TableContextRowRemove editor={editor}/>
                
            </>
            )}
            {(cellsSelected || mergedCellSelected) && (
                <>
                <ContextMenuSeparator/>
                {cellsSelected && <TableContextMergeCells editor={editor}/>}
                {mergedCellSelected && <TableContextSplitCells editor={editor}/>}
                </>
            )}
        </>
    )
}