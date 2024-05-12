import { ImTable2 } from "react-icons/im";
import { ToolbarToolProps } from "./toolsProps";
import { $insertNodes } from "lexical";
import { $createTableNodeWithDimensions } from '@lexical/table'
import { TableRowNode, TableCellNode } from '@lexical/table';
import { ExtendedTableNode } from "../../tablePlugin/nodes/extendedTableNode";

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