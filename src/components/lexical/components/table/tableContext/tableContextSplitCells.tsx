import { $getNodeByKey, $getSelection, $isRangeSelection, $setSelection } from "lexical";
import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode } from "../../../nodes/table/extendedTableNode";
import { MenuItem } from "../../menu";
import {
    $findCellNode, $isTableCellNode, $isTableSelection,
    TableCellNode
} from "@lexical/table";
import { TableBodyNode } from "../../../nodes/table/tableBodyNode";
import { TableContextOptionProps } from "./tableContextCommon";
import { getContextMenuContext } from "../../../plugins/contextMenuPlugin/context";

export default function TableContextSplitCells({ editor }: TableContextOptionProps) {
    const menuContext = getContextMenuContext()

    function SplitCellIcon() {
        if ( !menuContext.theme.tableMenuTheme || !menuContext.theme.tableMenuTheme.SplitCellIcon ) 
            throw Error("No theme for table menu!");

        return menuContext.theme.tableMenuTheme.SplitCellIcon
    }

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

    return <MenuItem Icon={SplitCellIcon()} title="Split Cells" onClick={onClick} />;
}
