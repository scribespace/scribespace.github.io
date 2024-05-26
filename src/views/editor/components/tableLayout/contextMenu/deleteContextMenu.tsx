import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode } from "@editor/nodes/table";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isTableSelection } from "@lexical/table";
import { $getNodeByKeyOrThrow, $getSelection, $isRangeSelection } from "lexical";
import { MenuItem } from "../../menu";

export function DeleteContextMenu() {
    const [editor] = useLexicalComposerContext();
    const {editorTheme: {tableLayoutTheme: {menuTheme: {DeleteIcon}}}} = useMainThemeContext();
    
    const onClick = () => {
        editor.update(() => {
            let tableNode: ExtendedTableNode | null = null;

            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow(selection.anchor.getNode());
            }
            if ($isTableSelection(selection)) {
                const tableBodyNode = $getNodeByKeyOrThrow(selection.tableKey);
                tableNode = tableBodyNode.getParentOrThrow<ExtendedTableNode>();
            }

            if (!tableNode) throw Error("TableContextDelete: expected table");

            tableNode.remove();
        });
        $closeContextMenu(editor);
    };

    return (
        <MenuItem onClick={onClick}>
            <DeleteIcon/>
            <div>Delete</div>
        </MenuItem>
    );
}
