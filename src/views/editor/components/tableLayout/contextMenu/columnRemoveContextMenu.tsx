import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode, TableBodyNode } from "@editor/nodes/table";
import { $getTableColumnIndexFromTableCellNode } from "@editor/plugins/tablePlugin/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    $getTableCellNodeFromLexicalNode, $getTableNodeFromLexicalNodeOrThrow, $isTableCellNode, $isTableSelection,
    TableCellNode
} from "@lexical/table";
import { $getSelection, $isRangeSelection, $setSelection } from "lexical";
import { MenuItem } from "../../menu";


export function ColumnRemoveContextMenu() {
    const [editor] = useLexicalComposerContext();
    const {editorTheme: {tableLayoutTheme: {menuTheme: {ColumnRemoveIcon}}}} = useMainThemeContext();

    const onClick = () => {
        editor.update(() => {
            let tableNode: ExtendedTableNode | null = null;
            let cellNode: TableCellNode | null = null;
            let columnsCount = 0;

            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                cellNode = $getTableCellNodeFromLexicalNode(selection.anchor.getNode());
                if (!$isTableCellNode(cellNode)) throw Error("TableContextColumnRemove: expecetd cell node");
                tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow(cellNode);
                columnsCount = 1;
            }

            if ($isTableSelection(selection)) {
                if (selection.anchor.isBefore(selection.focus)) {
                    cellNode = selection.anchor.getNode() as TableCellNode;
                } else {
                    cellNode = selection.focus.getNode() as TableCellNode;
                }
                const tableBodyNode = $getTableNodeFromLexicalNodeOrThrow(cellNode) as TableBodyNode;
                tableNode = tableBodyNode.getParentOrThrow<ExtendedTableNode>();

                const resolvedTable = tableBodyNode.getResolvedTable();
                const columnID = $getTableColumnIndexFromTableCellNode(cellNode, resolvedTable);

                for (const node of selection.getNodes()) {
                    if ($isTableCellNode(node)) {
                        if (tableBodyNode == $getTableNodeFromLexicalNodeOrThrow(node)) {
                            const testColumnID = $getTableColumnIndexFromTableCellNode(node, resolvedTable);

                            columnsCount = Math.max(columnsCount, testColumnID - columnID);
                        }
                    }
                }
                ++columnsCount;
            }

            if (!cellNode) throw Error("TableContextColumnRemove: null Cell Node");
            if (!tableNode) throw Error("TableContextColumnRemove: null Table Node");

            tableNode.removeColumns(cellNode, columnsCount);
            $setSelection(null);
            $closeContextMenu(editor);
        },
            { tag: 'table-column-remove' });
    };

    return (
        <MenuItem onClick={onClick} >
            <ColumnRemoveIcon/>
            <div>Remove Column</div>
        </MenuItem>
    );
}
