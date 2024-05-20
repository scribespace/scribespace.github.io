import { useContext } from "react";
import { $getNodeByKey, $getSelection, $isRangeSelection, $setSelection } from "lexical";
import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode } from "../../../nodes/table/extendedTableNode";
import MenuItem from "../../menu/menuItem";
import {
    $findCellNode, $isTableCellNode, $isTableSelection,
    TableCellNode
} from "@lexical/table";
import { TableContextOptionProps } from "../tableContextOptions";
import { TableBodyNode } from "../../../nodes/table/tableBodyNode";
import { ContextMenuContextData } from "../../../plugins/contextMenuPlugin/contextMenuPlugin";
import { MenuContext } from "../../menu/menu";


export default function TableContextSplitCells({ editor }: TableContextOptionProps) {
    const menuContext = useContext(MenuContext) as ContextMenuContextData
    const onClick = () => {
        editor.update(() => {
            const selection = $getSelection();
            let tableNode: ExtendedTableNode | null = null;

            const nodesKeys = new Set<string>();
            if ($isTableSelection(selection)) {
                const tableBodyNode = $getNodeByKey(selection.tableKey) as TableBodyNode;
                tableNode = tableBodyNode?.getParentOrThrow<ExtendedTableNode>()
                for (const node of selection.getNodes()) {
                    if ($isTableCellNode(node) && !nodesKeys.has(node.getKey())) {
                        nodesKeys.add(node.getKey());
                    }
                }
            }

            if ($isRangeSelection(selection)) {
                const node = $findCellNode(selection.getNodes()[0]);
                if (node) {
                    tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow(node);
                    nodesKeys.add(node.getKey());
                }
            }

            for (const nodeKey of nodesKeys) {
                const node = $getNodeByKey(nodeKey) as TableCellNode;
                tableNode?.splitCell(editor, node);
            }

            $setSelection(null);
            menuContext.closeMenu();
        });
    };

    return <MenuItem Icon={menuContext.icons.tableIcons.SplitCellIcon} title="Split Cells" onClick={onClick} />;
}
