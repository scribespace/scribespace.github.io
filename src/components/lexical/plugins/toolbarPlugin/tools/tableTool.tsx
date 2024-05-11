import { ImTable2 } from "react-icons/im";
import { ToolbarToolProps } from "./toolsProps";
import { $createParagraphNode, $createTextNode, $getSelection, $insertNodes, $isRangeSelection, BaseSelection, COMMAND_PRIORITY_LOW, LexicalEditor, LexicalNode, ParagraphNode, RangeSelection, SELECTION_CHANGE_COMMAND } from "lexical";
import { $createTableNodeWithDimensions } from '@lexical/table'
import { $isTableSelection, $createTableRowNode, TableRowNode, $createTableCellNode, TableCellHeaderStates, $isTableCellNode, TableNode, TableCellNode, $isTableNode, $computeTableMap} from '@lexical/table';
import { useEffect, useRef } from "react";
import { $findMatchingParent } from "@lexical/utils";

export default function TableTool({editor} : ToolbarToolProps) {
    function onClick() {
        editor.update(()=>{
                const tableNode = $createTableNodeWithDimensions(3, 3, false);
                ((tableNode.getFirstChild() as TableRowNode).getFirstChild() as TableCellNode).setRowSpan(2);
                (tableNode.getChildren()[1] as TableRowNode).getFirstChild()?.remove()
                $insertNodes([tableNode])
        })
    }

    return ( 
        <ImTable2 className="item" onClick={onClick}/>
    )
}   