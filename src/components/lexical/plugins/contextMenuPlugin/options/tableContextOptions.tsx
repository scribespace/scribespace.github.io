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

export function TableContextAddColumnRight( {editor}: TableContextOptionProps ) {
    const OptionElement = ({children}: CotextSubmenuOptionProps) => {
        return (
         <ContextMenuItem Icon={TbColumnInsertRight} title="Insert Column Right">
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

export function TableContextAddColumnLeft( {editor}: TableContextOptionProps ) {
    const OptionElement = ({children}: CotextSubmenuOptionProps) => {
        return (
         <ContextMenuItem Icon={TbColumnInsertLeft} title="Insert Column Left">
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

export function TableContextAddRowTop( {editor}: TableContextOptionProps ) {
    const OptionElement = ({children}: CotextSubmenuOptionProps) => {
        return (
         <ContextMenuItem Icon={TbRowInsertTop} title="Insert Row Top">
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

export function TableContextAddRowBottom( {editor}: TableContextOptionProps ) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext)

    const OptionElement = ({children}: CotextSubmenuOptionProps) => {
        return (
         <ContextMenuItem Icon={TbRowInsertBottom} title="Insert Row Bottom">
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
                if ( !cellNode ) throw Error("AddRow: couldn't find node");
                tableNode = $getTableNodeFromLexicalNodeOrThrow(cellNode) as ExtendedTableNode
            }

            if ( $isTableSelection(selection) ) {
                tableNode = $getNodeByKeyOrThrow<ExtendedTableNode>(selection.tableKey);
                let rowID = -1;
                for ( const node of selection.getNodes() ) {
                    if ( $isTableCellNode(node) ) {
                        const nodesRowID = $getTableRowIndexFromTableCellNode(node);
                        if ( nodesRowID > rowID ) {
                            rowID == nodesRowID
                            cellNode = node;
                        }
                    }
                }
            }

            if ( !cellNode ) throw Error("AddRowBottom: node not found")
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
                <TableContextAddColumnLeft editor={editor}/>
                <TableContextAddColumnRight editor={editor}/>
                <TableContextAddRowTop editor={editor}/>
                <TableContextAddRowBottom editor={editor}/>
                
            </>
            )}           
        </>
    )
}