import { useContext } from "react";
import { ContextMenuContext, ContextMenuContextObject } from "../../contextMenuPlugin";
import { $getNodeByKeyOrThrow, $getSelection, $isRangeSelection } from "lexical";
import ContextMenuItem from "../../contextMenuItem";
import { $isTableSelection } from "@lexical/table";
import { TableContextOptionProps } from "../tableContextOptions";
import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode } from "../../../tablePlugin/nodes/extendedTableNode";


export function TableContextDelete({ editor, icons }: TableContextOptionProps) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext);
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
        contextObject.closeContextMenu();
    };

    return <ContextMenuItem Icon={icons.DeleteTableIcon} title="Delete Table" onClick={onClick} />;
}
