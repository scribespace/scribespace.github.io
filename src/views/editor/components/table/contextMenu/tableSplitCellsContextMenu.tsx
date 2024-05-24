import { $getNodeByKey, $getSelection, $isRangeSelection, $setSelection } from "lexical";
import { MenuItem } from "../../menu";
import {
    $findCellNode, $isTableCellNode, $isTableSelection,
    TableCellNode
} from "@lexical/table";
import { TableContextMenuOptionProps } from "./tableContextMenuCommon";
import { useContextMenuContext } from "@editor/plugins/contextMenuPlugin/context";
import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode, TableBodyNode } from "@editor/nodes/table";
import { MainTheme } from "@src/theme";
import { useMainThemeContext } from "@src/mainThemeContext";
import { useMemo } from "react";

export default function TableSplitCellsContextMenu({ editor }: TableContextMenuOptionProps) {
    const menuContext = useContextMenuContext();
    const {editorTheme}: MainTheme = useMainThemeContext();

    const SplitCellIcon = useMemo(()=>{
        return editorTheme.tableTheme.menuTheme.SplitCellIcon;
    },[editorTheme.tableTheme.menuTheme.SplitCellIcon]);

    const onClick = () => {
        editor.update(() => {
            const selection = $getSelection();
            let tableNode: ExtendedTableNode | null = null;

            const nodesKeys = new Set<string>();
            if ($isTableSelection(selection)) {
                const tableBodyNode = $getNodeByKey(selection.tableKey) as TableBodyNode;
                tableNode = tableBodyNode?.getParentOrThrow<ExtendedTableNode>();
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

    return (
        <MenuItem onClick={onClick}>
            <SplitCellIcon/>
            <div>Split Cells</div>
        </MenuItem>
    );
}
