import { useContext, useEffect, useState } from "react";
import { ImTable2 } from "react-icons/im";
import { TbColumnInsertRight } from "react-icons/tb";
import { ContextMenuContext, ContextMenuContextObject } from "../contextMenuPlugin";
import ContextSubmenu, { CotextSubmenuOptionProps } from "../contextSubmenu";
import TableCreatorEditor from "../../tablePlugin/tableCreatorEditor";
import { $getSelection, $insertNodes, LexicalEditor } from "lexical";
import { $createExtendedTableNodeWithDimensions } from "../../tablePlugin/nodes/extendedTableNode";
import ContextMenuItem from "../contextMenuItem";
import { $findTableNode } from "@lexical/table";

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

export function TableContextAddColumnRight( {editor}: TableContextOptionProps ) {
    return <ContextMenuItem Icon={TbColumnInsertRight} title="Insert Column Right"/>
}

export function TableContextAddColumnLeft( {editor}: TableContextOptionProps ) {
    return <ContextMenuItem Icon={TbColumnInsertRight} title="Insert Column Left"/>
}

export default function TableContextOptions({editor}: TableContextOptionProps) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext)

    const [insideTable, setInsideTable] = useState<boolean>(false)

    useEffect(()=>{
        editor.update(()=>{
            const selection = $getSelection()
            if ( selection ) {
                let allNodesInTable = true;
                for ( const node of selection.getNodes() ) {
                    allNodesInTable = allNodesInTable && ($findTableNode(node) != null)
                }
                setInsideTable(allNodesInTable)
            }
        })
    },[contextObject.mousePosition])

    return (
        <>
            <TableContextCreate editor={editor}/>
            {insideTable && (
            <>
                <TableContextAddColumnRight editor={editor}/>
                <TableContextAddColumnLeft editor={editor}/>
            </>
            )}
        </>
    )
}