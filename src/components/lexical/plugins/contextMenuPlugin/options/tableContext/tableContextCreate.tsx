import { useContext } from "react";
import { ImTable2 } from "react-icons/im";
import { ContextMenuContext, ContextMenuContextObject } from "../../contextMenuPlugin";
import ContextSubmenu, { CotextSubmenuOptionProps } from "../../contextSubmenu";
import TableCreatorEditor from "../../../tablePlugin/tableCreatorEditor";
import { $insertNodes } from "lexical";
import { $createExtendedTableNodeWithDimensions } from "../../../tablePlugin/nodes/extendedTableNode";
import ContextMenuItem from "../../contextMenuItem";
import { TableContextOptionProps } from "../tableContextOptions";

export default function TableContextCreate({ editor, icons }: TableContextOptionProps) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext);

    const OptionElement = ({ children }: CotextSubmenuOptionProps) => {
        return (
            <ContextMenuItem Icon={icons.AddTableIcon} title="Create Table">
                {children}
            </ContextMenuItem>
        );
    };

    function onClick(rowsCount: number, columnsCount: number) {
        editor.update(() => {
            const tableNode = $createExtendedTableNodeWithDimensions(rowsCount, columnsCount);
            $insertNodes([tableNode]);
        });

        contextObject.closeContextMenu();
    }

    return (
        <ContextSubmenu Option={OptionElement} disableBackground={true}>
            <TableCreatorEditor gridSize="100px" rowsCount={10} columnsCount={10} onClick={onClick} />
        </ContextSubmenu>
    );
}
