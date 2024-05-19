import { useContext, useEffect, useMemo, useState } from "react";
import { TbColumnInsertLeft, TbColumnInsertRight, TbColumnRemove, TbRowInsertBottom, TbRowInsertTop, TbRowRemove, TbTableOff, TbTablePlus } from "react-icons/tb";
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
import TableContextSplitCells from "./tableContext/tableContextSplitCells";
import TableContextMergeCells from "./tableContext/tableContextMergeCells";
import TableContextCreate from "./tableContext/tableContextCreate";
import { IconType } from "react-icons";
import { AiOutlineMergeCells, AiOutlineSplitCells } from "react-icons/ai";
import { copyExistingValues } from "../../../../../common";
import { TableContextDelete } from "./tableContext/tableContextDelete";
import { TableContextRowRemove, TableContextAddRowBefore, TableContextAddRowAfter } from "./tableContext/tableContextRowOptions";
import TableContextNumberInputEditor from "./tableContext/tableContextNumberInputEditor";
import { ExtendedTableNode } from "../../tablePlugin/nodes/extendedTableNode";
import { $getTableColumnIndexFromTableCellNode } from "../../tablePlugin/tableHelpers";


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

export function TableContextAddColumnAfter( {editor, icons}: TableContextOptionProps ) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext);

    const OptionElement = ({children}: CotextSubmenuOptionProps) => {
        return (
         <ContextMenuItem Icon={icons.AddColumnAfterIcon} title="Insert Column After">
             {children}
         </ContextMenuItem>
        )
     }

     const onInputAccepted = (input: HTMLInputElement) => {
        const value = input.valueAsNumber;

        editor.update(() => {
            const selection = $getSelection();

            let tableNode: ExtendedTableNode | null = null;
            let cellNode: TableCellNode | null = null;
            if ($isRangeSelection(selection)) {
                cellNode = $getTableCellNodeFromLexicalNode(selection.getNodes()[0]);
                if (!cellNode) throw Error("AddColumnAfter: couldn't find node");
                tableNode = $getTableNodeFromLexicalNodeOrThrow(cellNode) as ExtendedTableNode;
            }

            if ($isTableSelection(selection)) {
                tableNode = $getNodeByKeyOrThrow<ExtendedTableNode>(selection.tableKey);
                const resolvedTable = tableNode.getResolvedTable()
                let columnID = -1;
                for (const node of selection.getNodes()) {
                    if ($isTableCellNode(node)) {
                        const cellsTableNode = $getTableNodeFromLexicalNodeOrThrow(node);
                        if (cellsTableNode == tableNode) {
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

        contextObject.closeContextMenu();
    };

    return (
        <ContextSubmenu Option={OptionElement} disableBackground={true}>
            <TableContextNumberInputEditor onInputAccepted={onInputAccepted}/>
        </ContextSubmenu>
    )
}

export function TableContextAddColumnBefore( {editor, icons}: TableContextOptionProps ) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext);

    const OptionElement = ({children}: CotextSubmenuOptionProps) => {
        return (
         <ContextMenuItem Icon={icons.AddColumnBeforeIcon} title="Insert Column Before">
             {children}
         </ContextMenuItem>
        )
     }

     const onInputAccepted = (input: HTMLInputElement) => {
        const value = input.valueAsNumber;

        editor.update(() => {
            const selection = $getSelection();

            let tableNode: ExtendedTableNode | null = null;
            let cellNode: TableCellNode | null = null;
            if ($isRangeSelection(selection)) {
                cellNode = $getTableCellNodeFromLexicalNode(selection.getNodes()[0]);
                if (!cellNode) throw Error("AddColumnBefore: couldn't find node");
                tableNode = $getTableNodeFromLexicalNodeOrThrow(cellNode) as ExtendedTableNode;
            }

            if ($isTableSelection(selection)) {
                tableNode = $getNodeByKeyOrThrow<ExtendedTableNode>(selection.tableKey);
                const resolvedTable = tableNode.getResolvedTable()
                let columnID = resolvedTable[0].cells.length;
                for (const node of selection.getNodes()) {
                    if ($isTableCellNode(node)) {
                        const cellsTableNode = $getTableNodeFromLexicalNodeOrThrow(node);
                        if (cellsTableNode == tableNode) {
                            const nodesColumnID = $getTableColumnIndexFromTableCellNode(node, resolvedTable);
                            if (nodesColumnID < columnID) {
                                columnID == columnID;
                                cellNode = node;
                            }
                        }
                    }
                }
            }

            if (!cellNode) throw Error("AddColumnBefore: node not found");
            tableNode?.addColumnsBefore(cellNode, value);
        },
        { tag: 'table-add-column-before' });

        contextObject.closeContextMenu();
    };

    return (
        <ContextSubmenu Option={OptionElement} disableBackground={true}>
            <TableContextNumberInputEditor onInputAccepted={onInputAccepted}/>
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