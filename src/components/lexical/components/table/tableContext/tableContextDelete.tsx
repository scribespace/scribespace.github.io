import { useContext } from "react";
import { $getNodeByKeyOrThrow, $getSelection, $isRangeSelection } from "lexical";
import MenuItem from "../../menu/menuItem";
import { $isTableSelection } from "@lexical/table";
import { TableContextOptionProps } from "../tableContextOptions";
import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode } from "../../../nodes/table/extendedTableNode";
import { MenuContext } from "../../menu/menu";
import { ContextMenuContextData } from "../../../plugins/contextMenuPlugin/contextMenuPlugin";


export function TableContextDelete({ editor }: TableContextOptionProps) {
    const menuContext = useContext(MenuContext) as ContextMenuContextData
    const onClick = () => {
        editor.update(() => {
            let tableNode: ExtendedTableNode | null = null;

            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow(selection.anchor.getNode());
            }
            if ($isTableSelection(selection)) {
                const tableBodyNode = $getNodeByKeyOrThrow(selection.tableKey);
                tableNode = tableBodyNode.getParentOrThrow<ExtendedTableNode>()
            }

            if (!tableNode) throw Error("TableContextDelete: expected table");

            tableNode.remove();
        });
        menuContext.closeMenu();
    };

    return <MenuItem Icon={menuContext.icons.tableIcons.DeleteTableIcon} title="Delete Table" onClick={onClick} />;
}
