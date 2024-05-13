import { ImTable2 } from "react-icons/im";
import { ToolbarToolProps } from "./toolsProps";
import { $insertNodes } from "lexical";
import { TableRowNode, TableCellNode } from '@lexical/table';
import { $createExtendedTableNodeWithDimensions, ExtendedTableNode } from "../../tablePlugin/nodes/extendedTableNode";
import DropdownTool from "./dropdownTool";
import TableCreatorEditor from "../../tablePlugin/tableCreatorEditor";

export default function TableTool({editor} : ToolbarToolProps) {
    
    function onClick(rowsCount: number, columnsCount: number) {
        editor.update(()=>{
            const tableNode = $createExtendedTableNodeWithDimensions(rowsCount, columnsCount);
            $insertNodes([tableNode])
        })
    }

    const Tool = () => { 
        return <ImTable2 className="item"/>
    }
     return (
         <DropdownTool Tool={Tool}>
                 <TableCreatorEditor gridSize="100px" rowsCount={10} columnsCount={10} onClick={onClick}/>
         </DropdownTool>
     )
}   