import { ImTable2 } from "react-icons/im";
import { ToolbarToolProps } from "./toolsProps";
import { $createParagraphNode, $createTextNode, $getSelection, $insertNodes, $isRangeSelection, BaseSelection, COMMAND_PRIORITY_LOW, LexicalEditor, LexicalNode, ParagraphNode, RangeSelection, SELECTION_CHANGE_COMMAND } from "lexical";
import { $createTableNodeWithDimensions } from '@lexical/table'
import { $isTableSelection, $createTableRowNode, TableRowNode, $createTableCellNode, TableCellHeaderStates, $isTableCellNode, TableNode, TableCellNode, $isTableNode, $computeTableMap} from '@lexical/table';
import { useEffect, useRef } from "react";
import { $findMatchingParent } from "@lexical/utils";
import { ExtendedTableNode } from "../../tablePlugin/nodes/extendedTableNode";
import { FaClipboardList } from "react-icons/fa";

export default function TableTool({editor} : ToolbarToolProps) {
    function onClick() {
        editor.update(()=>{
                const tableNode = $createTableNodeWithDimensions(4, 5, false);
                ((tableNode.getChildren()[0] as TableRowNode).getChildren()[0] as TableCellNode).setColSpan(2);
                ((tableNode.getChildren()[0] as TableRowNode).getChildren()[1] as TableCellNode).remove();
                
                // 2x2 collapsed
                ((tableNode.getChildren()[0] as TableRowNode).getChildren()[0] as TableCellNode).setRowSpan(2);
                ((tableNode.getChildren()[1] as TableRowNode).getChildren()[1] as TableCellNode).remove();
                ((tableNode.getChildren()[1] as TableRowNode).getChildren()[0] as TableCellNode).remove();

                ((tableNode.getChildren()[2] as TableRowNode).getChildren()[3] as TableCellNode).setColSpan(2);
                ((tableNode.getChildren()[2] as TableRowNode).getChildren()[4] as TableCellNode).remove();
                
                // 2x2 collapsed
                ((tableNode.getChildren()[2] as TableRowNode).getChildren()[3] as TableCellNode).setRowSpan(2);
                ((tableNode.getChildren()[3] as TableRowNode).getChildren()[4] as TableCellNode).remove();
                ((tableNode.getChildren()[3] as TableRowNode).getChildren()[3] as TableCellNode).remove();


                // const tableNode = $createTableNodeWithDimensions(4, 4, false);
                // ((tableNode.getChildren()[0] as TableRowNode).getChildren()[0] as TableCellNode).setColSpan(2);
                // ((tableNode.getChildren()[0] as TableRowNode).getChildren()[1] as TableCellNode).remove();
                
                // // 2x2 collapsed
                // ((tableNode.getChildren()[0] as TableRowNode).getChildren()[0] as TableCellNode).setRowSpan(2);
                // ((tableNode.getChildren()[1] as TableRowNode).getChildren()[1] as TableCellNode).remove();
                // ((tableNode.getChildren()[1] as TableRowNode).getChildren()[0] as TableCellNode).remove();

                // ((tableNode.getChildren()[2] as TableRowNode).getChildren()[2] as TableCellNode).setColSpan(2);
                // ((tableNode.getChildren()[2] as TableRowNode).getChildren()[3] as TableCellNode).remove();
                
                // // 2x2 collapsed
                // ((tableNode.getChildren()[2] as TableRowNode).getChildren()[2] as TableCellNode).setRowSpan(2);
                // ((tableNode.getChildren()[3] as TableRowNode).getChildren()[3] as TableCellNode).remove();
                // ((tableNode.getChildren()[3] as TableRowNode).getChildren()[2] as TableCellNode).remove();


                //const tableNode = $createTableNodeWithDimensions(3, 3, false);
                //((tableNode.getChildren()[0] as TableRowNode).getChildren()[0] as TableCellNode).setColSpan(2);
                //((tableNode.getChildren()[0] as TableRowNode).getChildren()[1] as TableCellNode).remove();
                
                // 2x2 collapsed
                //((tableNode.getChildren()[0] as TableRowNode).getChildren()[0] as TableCellNode).setRowSpan(2);
                //((tableNode.getChildren()[1] as TableRowNode).getChildren()[1] as TableCellNode).remove();
                //((tableNode.getChildren()[1] as TableRowNode).getChildren()[0] as TableCellNode).remove();
                
                // bottom right collapsed
                //((tableNode.getChildren()[2] as TableRowNode).getChildren()[1] as TableCellNode).setColSpan(2);
                //((tableNode.getChildren()[2] as TableRowNode).getChildren()[2] as TableCellNode).remove();

                (tableNode as ExtendedTableNode).updateColGroup()

                $insertNodes([tableNode])
        })
    }

    return ( 
        <ImTable2 className="item" onClick={onClick}/>
    )
}   