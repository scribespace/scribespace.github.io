import { $getNodeByKeyOrThrow, $getSelection, $isRangeSelection } from "lexical";
import { MenuItem } from "../../menu";
import { $isTableSelection } from "@lexical/table";
import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode } from "../../../nodes/table/extendedTableNode";
import { getContextMenuContext } from "../../../plugins/contextMenuPlugin/context";
import { TableContextOptionProps } from "./tableContextCommon";


export default function TableContextDelete({ editor }: TableContextOptionProps) {
    const menuContext = getContextMenuContext()

    function DeleteTableIcon() {
        if ( !menuContext.theme.tableMenuTheme || !menuContext.theme.tableMenuTheme.DeleteTableIcon ) 
            throw Error("No theme for table menu!");

        return menuContext.theme.tableMenuTheme.DeleteTableIcon
    }

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

    return <MenuItem Icon={DeleteTableIcon()} title="Delete Table" onClick={onClick} />;
}
