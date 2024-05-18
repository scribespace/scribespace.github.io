import { useContext, useEffect, useMemo, useState } from "react";
import { TbColumnInsertLeft, TbColumnInsertRight, TbColumnRemove, TbRowInsertBottom, TbRowInsertTop, TbRowRemove, TbTableOff, TbTablePlus } from "react-icons/tb";
import { ContextMenuContext, ContextMenuContextObject } from "../contextMenuPlugin";
import ContextSubmenu, { CotextSubmenuOptionProps } from "../contextSubmenu";
import { $getNodeByKey, $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import ContextMenuItem from "../contextMenuItem";
import { 
    $findCellNode, $getTableRowNodeFromTableCellNodeOrThrow, $isTableCellNode, $isTableSelection,
    TableRowNode,  
} from "@lexical/table";
import { SeparatorHorizontal, SeparatorHorizontalStrong } from "../../../editors/separator";
import NumberInputEditor from "../../../editors/numberInputEditor";
import TableContextSplitCells from "./tableContext/tableContextSplitCells";
import TableContextMergeCells from "./tableContext/tableContextMergeCells";
import TableContextCreate from "./tableContext/tableContextCreate";
import { IconType } from "react-icons";
import { AiOutlineMergeCells, AiOutlineSplitCells } from "react-icons/ai";
import { copyExistingValues } from "../../../../../common";
import { TableContextDelete } from "./tableContext/tableContextDelete";
import { TableContextRowRemove, TableContextAddRowBefore, TableContextAddRowAfter } from "./tableContext/tableContextRowOptions";


export interface TableContextMenuIcons {
    AddTableIcon: IconType;
    DeleteTableIcon: IconType;
    MergeCellIcon: IconType;
    SplitCellIcon: IconType;
    AddRowBeforeIcon: IconType;
    AddRowAfterIcon: IconType;
    AddColumnBeforeIcon: IconType;
    AddColumnAfterIcon: IconType;
    RemoveRowIcon: IconType;
    RemoveColumnIcon: IconType;
}

const TABLE_CONTEXT_MENU_DEFAULT_ICONS: TableContextMenuIcons = {
    AddTableIcon: TbTablePlus,
    DeleteTableIcon: TbTableOff,
    MergeCellIcon: AiOutlineMergeCells,
    SplitCellIcon: AiOutlineSplitCells,
    AddRowBeforeIcon: TbRowInsertTop,
    AddRowAfterIcon: TbRowInsertBottom,
    AddColumnBeforeIcon: TbColumnInsertLeft,
    AddColumnAfterIcon: TbColumnInsertRight,
    RemoveRowIcon: TbRowRemove,
    RemoveColumnIcon: TbColumnRemove,
}

export interface TableContextOptionProps {
    editor: LexicalEditor,
    icons: TableContextMenuIcons,
}
const onClickNotImplemented = () => {
    throw Error("Not implemented")
}

interface TableContextNumberInputEditorProps {
    onInputAccepted: (target: HTMLInputElement) => void;
}

export function TableContextNumberInputEditor({onInputAccepted}: TableContextNumberInputEditorProps) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext)

    return (
        <div className={contextObject.theme.contextMenuEditorContainer}>
            <NumberInputEditor type="number" defaultValue="1" min={1} useAcceptButton={true} onInputAccepted={onInputAccepted}/>
        </div>
    )
}

export function TableContextAddColumnAfter( {editor, icons}: TableContextOptionProps ) {
    const OptionElement = ({children}: CotextSubmenuOptionProps) => {
        return (
         <ContextMenuItem Icon={icons.AddColumnAfterIcon} title="Insert Column After">
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

export function TableContextAddColumnBefore( {editor, icons}: TableContextOptionProps ) {
    const OptionElement = ({children}: CotextSubmenuOptionProps) => {
        return (
         <ContextMenuItem Icon={icons.AddColumnBeforeIcon} title="Insert Column Before">
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

export function TableContextColumnRemove( {editor, icons}: TableContextOptionProps ) {
    return <ContextMenuItem Icon={icons.RemoveColumnIcon} title="Remove Column" onClick={onClickNotImplemented}/>
}


interface TableContextOptionsProps {
    editor: LexicalEditor,
    icons?: TableContextMenuIcons
}

export default function TableContextOptions({editor, icons}: TableContextOptionsProps) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext)

    const [insideTable, setInsideTable] = useState<boolean>(false)
    const [cellsSelected, setCellsSelected] = useState<boolean>(false)
    const [mergedCellSelected, setMergedCellSelected] = useState<boolean>(false)

    const currentIcons = useMemo(() => copyExistingValues<TableContextMenuIcons>(icons, TABLE_CONTEXT_MENU_DEFAULT_ICONS), [icons])

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
            <TableContextCreate editor={editor} icons={currentIcons}/>
            {insideTable && 
                <TableContextDelete editor={editor} icons={currentIcons}/>
            }
            {(cellsSelected || mergedCellSelected) && (
                <>
                <SeparatorHorizontal/>
                {cellsSelected && <TableContextMergeCells editor={editor} icons={currentIcons}/>}
                {mergedCellSelected && <TableContextSplitCells editor={editor} icons={currentIcons}/>}
                </>
            )}
            {insideTable && (
            <>
                <SeparatorHorizontal/>
                <TableContextColumnRemove editor={editor} icons={currentIcons}/>
                <TableContextRowRemove editor={editor} icons={currentIcons}/>
                <SeparatorHorizontal/>
                <TableContextAddColumnBefore editor={editor} icons={currentIcons}/>
                <TableContextAddColumnAfter editor={editor} icons={currentIcons}/>
                <TableContextAddRowBefore editor={editor} icons={currentIcons}/>
                <TableContextAddRowAfter editor={editor} icons={currentIcons}/>
            </>
            )}           
        </>
    )
}