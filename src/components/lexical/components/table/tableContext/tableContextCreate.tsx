import { MenuItem, Submenu } from "../../menu";
import TableCreator from "../tableCreator";
import { $insertNodes } from "lexical";
import { useContextMenuContext } from "../../../plugins/contextMenuPlugin/context";
import { PropsWithChildren } from "react";
import { TableContextOptionProps } from "./tableContextCommon";
import { $createExtendedTableNodeWithDimensions } from "../../../nodes/table";

export default function TableContextCreate({ editor }: TableContextOptionProps) {
    const menuContext = useContextMenuContext();

    function AddTableIcon() {
        if ( !menuContext.theme.tableMenuTheme || !menuContext.theme.tableMenuTheme.AddTableIcon ) 
            throw Error("No theme for table menu!");

        return menuContext.theme.tableMenuTheme.AddTableIcon;
    }

    const OptionElement = ({ children }: PropsWithChildren) => {
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
            <TableCreator gridSize="100px" rowsCount={10} columnsCount={10} onClick={onClick} />
        </Submenu>
    );
}
