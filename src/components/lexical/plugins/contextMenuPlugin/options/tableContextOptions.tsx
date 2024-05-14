import { ContextMenuSeparator } from "../contextMenu";
import ContextSubmenu from "../contextSubmenu";

export function TableContextOptions2() {
    return (
        <ContextSubmenu Option={()=><div>table options</div>}>
            <div>test1</div>
            <ContextMenuSeparator/>
            <div>test3</div>
            <div>test4</div>
            <div>test5</div>
        </ContextSubmenu>
    )
}


export default function TableContextOptions() {
    return (
        <ContextSubmenu Option={()=><div>table options</div>}>
            <div>test1</div>
            <div>test2test2test2test2test2</div>
            <ContextMenuSeparator/>
            <div>test3</div>
            <TableContextOptions2/>
            <TableContextOptions2/>
        </ContextSubmenu>
    )
}