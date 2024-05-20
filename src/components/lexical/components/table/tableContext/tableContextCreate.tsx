import { useContext } from "react";
import Submenu, { CotextSubmenuOptionProps } from "../../menu/submenu";
import TableCreatorEditor from "../tableCreatorEditor";
import { $insertNodes } from "lexical";
import { $createExtendedTableNodeWithDimensions } from "../../../nodes/table/extendedTableNode";
import MenuItem from "../../menu/menuItem";
import { TableContextOptionProps } from "../tableContextOptions";
import { ContextMenuContextData } from "../../../plugins/contextMenuPlugin/contextMenuContext";
import { MenuContext } from "../../menu/menu";

export default function TableContextCreate({ editor }: TableContextOptionProps) {
    const menuContext = useContext(MenuContext) as ContextMenuContextData

    function AddTableIcon() {
        if ( !menuContext.theme.tableMenuTheme || !menuContext.theme.tableMenuTheme.AddTableIcon ) 
            throw Error("No theme for table menu!");

        return menuContext.theme.tableMenuTheme.AddTableIcon
    }

    const OptionElement = ({ children }: CotextSubmenuOptionProps) => {
        return (
            <MenuItem Icon={AddTableIcon()} title="Create Table">
                {children}
            </MenuItem>
        );
    };

    function onClick(rowsCount: number, columnsCount: number) {
        editor.update(() => {
            const tableNode = $createExtendedTableNodeWithDimensions(rowsCount, columnsCount);
            $insertNodes([tableNode]);
        });

        menuContext.closeMenu();
    }

    return (
        <Submenu Option={OptionElement} disableBackground={true}>
            <TableCreatorEditor gridSize="100px" rowsCount={10} columnsCount={10} onClick={onClick} />
        </Submenu>
    );
}
