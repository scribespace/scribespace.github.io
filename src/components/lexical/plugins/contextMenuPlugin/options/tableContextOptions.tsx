import { useContext, useEffect, useState } from "react";
import { TbColumnInsertLeft, TbColumnInsertRight, TbColumnRemove, TbRowInsertBottom, TbRowInsertTop, TbRowRemove } from "react-icons/tb";
import { ContextMenuContext, ContextMenuContextObject } from "../contextMenuPlugin";
import ContextSubmenu, { CotextSubmenuOptionProps } from "../contextSubmenu";
import { $getNodeByKey, $getNodeByKeyOrThrow, $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import ContextMenuItem from "../contextMenuItem";
import { 
    $findCellNode, $getTableCellNodeFromLexicalNode, $getTableNodeFromLexicalNodeOrThrow, $getTableRowIndexFromTableCellNode, $getTableRowNodeFromTableCellNodeOrThrow, $isTableCellNode, $isTableSelection,
    TableCellNode,
    TableRowNode,  
} from "@lexical/table";
import { SeparatorHorizontal, SeparatorHorizontalStrong } from "../../../editors/separator";
import NumberInputEditor from "../../../editors/numberInputEditor";
import TableContextSplitCells from "./tableContext/tableContextSplitCells";
import TableContextMergeCells from "./tableContext/tableContextMergeCells";
import TableContextCreate from "./tableContext/tableContextCreate";
import { ExtendedTableNode } from "../../tablePlugin/nodes/extendedTableNode";

export interface TableContextOptionProps {
    editor: LexicalEditor
}
const onClickNotImplemented = () => {
    throw Error("Not implemented")
}

interface TableContextNumberInputEditorProps {
    onInputAccepted: (target: HTMLInputElement) => void;
}
function TableContextNumberInputEditor({onInputAccepted}: TableContextNumberInputEditorProps) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext)

    return (
        <div className={contextObject.theme.contextMenuEditorContainer}>
            <NumberInputEditor type="number" defaultValue="1" min={1} useAcceptButton={true} onInputAccepted={onInputAccepted}/>
        </div>
    )
}

export function TableContextAddColumnAfter( {editor}: TableContextOptionProps ) {
    const OptionElement = ({children}: CotextSubmenuOptionProps) => {
        return (
         <ContextMenuItem Icon={TbColumnInsertRight} title="Insert Column After">
             {children}
         </ContextMenuItem>
        )
     }

    return (
        <ContextSubmenu Option={OptionElement} disableBackground={true}>
            <TableContextNumberInputEditor onInputAccepted={onClickNotImplemented}/>
        </ContextSubmenu>
    )
}

export function TableContextAddColumnBefore( {editor}: TableContextOptionProps ) {
    const OptionElement = ({children}: CotextSubmenuOptionProps) => {
        return (
         <ContextMenuItem Icon={TbColumnInsertLeft} title="Insert Column Before">
             {children}
         </ContextMenuItem>
        )
     }

    return (
        <ContextSubmenu Option={OptionElement} disableBackground={true}>
            <TableContextNumberInputEditor onInputAccepted={onClickNotImplemented}/>
        </ContextSubmenu>
    )
}

export function TableContextAddRowBefore( {editor}: TableContextOptionProps ) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext)
    
    const OptionElement = ({children}: CotextSubmenuOptionProps) => {
        return (
         <ContextMenuItem Icon={TbRowInsertTop} title="Insert Row Before">
             {children}
         </ContextMenuItem>
        )
     }

     const onInputAccepted = (input: HTMLInputElement) => {
        const value = input.valueAsNumber;

        editor.update(()=>{
            const selection = $getSelection();

            let tableNode: ExtendedTableNode | null = null;
            let cellNode: TableCellNode | null = null;
            if ( $isRangeSelection(selection) ) {
                cellNode = $getTableCellNodeFromLexicalNode(selection.getNodes()[0]);
                if ( !cellNode ) throw Error("AddRowBefore: couldn't find node");
                tableNode = $getTableNodeFromLexicalNodeOrThrow(cellNode) as ExtendedTableNode
            }

            if ( $isTableSelection(selection) ) {
                tableNode = $getNodeByKeyOrThrow<ExtendedTableNode>(selection.tableKey);
                if ( selection.anchor.isBefore(selection.focus) ) {
                    cellNode = selection.anchor.getNode() as TableCellNode;
                } else {
                    cellNode = selection.focus.getNode() as TableCellNode;
                }
            }

            if ( !cellNode ) throw Error("AddRowBefore: node not found")
            tableNode?.addRowsBefore( cellNode, value );
        })

        contextObject.closeContextMenu();
     }

    return (
        <ContextSubmenu Option={OptionElement} disableBackground={true}>
            <TableContextNumberInputEditor onInputAccepted={onInputAccepted}/>
        </ContextSubmenu>
    )
}

export function TableContextAddRowAfter( {editor}: TableContextOptionProps ) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext)

    const OptionElement = ({children}: CotextSubmenuOptionProps) => {
        return (
         <ContextMenuItem Icon={TbRowInsertBottom} title="Insert Row After">
             {children}
         </ContextMenuItem>
        )
     }

     const onInputAccepted = (input: HTMLInputElement) => {
        const value = input.valueAsNumber;

        editor.update(()=>{
            const selection = $getSelection();

            let tableNode: ExtendedTableNode | null = null;
            let cellNode: TableCellNode | null = null;
            if ( $isRangeSelection(selection) ) {
                cellNode = $getTableCellNodeFromLexicalNode(selection.getNodes()[0]);
                if ( !cellNode ) throw Error("AddRowAfter: couldn't find node");
                tableNode = $getTableNodeFromLexicalNodeOrThrow(cellNode) as ExtendedTableNode
            }

            if ( $isTableSelection(selection) ) {
                tableNode = $getNodeByKeyOrThrow<ExtendedTableNode>(selection.tableKey);
                let rowID = -1;
                for ( const node of selection.getNodes() ) {
                    if ( $isTableCellNode(node)) {
                        const cellsTableNode = $getTableNodeFromLexicalNodeOrThrow(node);
                        if ( cellsTableNode == tableNode ) {
                            const nodesRowID = $getTableRowIndexFromTableCellNode(node);
                            if ( nodesRowID > rowID ) {
                                rowID == nodesRowID
                                cellNode = node;
                            }
                        }
                    }
                }
            }

            if ( !cellNode ) throw Error("AddRowAfter: node not found")
            tableNode?.addRowsAfter( cellNode, value );
        })

        contextObject.closeContextMenu();
     }

    return (
        <ContextSubmenu Option={OptionElement} disableBackground={true}>
            <TableContextNumberInputEditor onInputAccepted={onInputAccepted}/>
        </ContextSubmenu>
    )
}

export function TableContextColumnRemove( {editor}: TableContextOptionProps ) {
    return <ContextMenuItem Icon={TbColumnRemove} title="Remove Column" onClick={onClickNotImplemented}/>
}

export function TableContextRowRemove( {editor}: TableContextOptionProps ) {
    return <ContextMenuItem Icon={TbRowRemove} title="Remove Row" onClick={onClickNotImplemented}/>
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
            <SeparatorHorizontalStrong/>
            <TableContextCreate editor={editor}/>
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