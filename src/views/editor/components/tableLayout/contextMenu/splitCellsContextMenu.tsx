import { MenuItem } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode, TableBodyNode } from "@editor/nodes/table";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    $findCellNode, $isTableCellNode, $isTableSelection,
    TableCellNode
} from "@lexical/table";
import { $getNodeByKey, $getSelection, $isRangeSelection, $setSelection } from "lexical";

export function SplitCellsContextMenu() {
    const [editor] = useLexicalComposerContext();
    const {editorTheme: {tableLayoutTheme: {menuTheme: {SplitCellIcon}}}} = useMainThemeContext();

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

            $closeContextMenu(editor);
        });
    };

    return (
        <MenuItem onClick={onClick}>
            <SplitCellIcon/>
            <div>Split Cells</div>
        </MenuItem>
    );
}
