import { useContext } from "react";
import { ContextMenuContext, ContextMenuContextObject } from "../../contextMenuPlugin";
import { $getNodeByKey, $getSelection, $isRangeSelection, $setSelection } from "lexical";
import { ExtendedTableNode } from "../../../tablePlugin/nodes/extendedTableNode";
import ContextMenuItem from "../../contextMenuItem";
import {
    $findCellNode, $getTableNodeFromLexicalNodeOrThrow, $isTableCellNode, $isTableSelection,
    TableCellNode
} from "@lexical/table";
import { AiOutlineSplitCells } from "react-icons/ai";
import { TableContextOptionProps } from "../tableContextOptions";


export default function TableContextSplitCells({ editor, icons }: TableContextOptionProps) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext);
    const onClick = () => {
        editor.update(() => {
            const selection = $getSelection();
            let tableNode: ExtendedTableNode | null = null;

            const nodesKeys = new Set<string>();
            if ($isTableSelection(selection)) {
                tableNode = $getNodeByKey(selection.tableKey);
                for (const node of selection.getNodes()) {
                    if ($isTableCellNode(node) && !nodesKeys.has(node.getKey())) {
                        nodesKeys.add(node.getKey());
                    }
                }
            }

            if ($isRangeSelection(selection)) {
                const node = $findCellNode(selection.getNodes()[0]);
                if (node) {
                    tableNode = $getTableNodeFromLexicalNodeOrThrow(node) as ExtendedTableNode;
                    nodesKeys.add(node.getKey());
                }
            }

            for (const nodeKey of nodesKeys) {
                const node = $getNodeByKey(nodeKey) as TableCellNode;
                tableNode?.splitCell(editor, node);
            }

            $setSelection(null);
            contextObject.closeContextMenu();
        });
    };

    return <ContextMenuItem Icon={icons.SplitCellIcon} title="Split Cells" onClick={onClick} />;
}
