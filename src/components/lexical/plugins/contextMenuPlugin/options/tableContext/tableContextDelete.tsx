import { useContext } from "react";
import { ContextMenuContext, ContextMenuContextObject } from "../../contextMenuPlugin";
import { $getNodeByKeyOrThrow, $getSelection, $isRangeSelection } from "lexical";
import ContextMenuItem from "../../contextMenuItem";
import { $getTableNodeFromLexicalNodeOrThrow, $isTableSelection } from "@lexical/table";
import { TableContextOptionProps } from "../tableContextOptions";


export function TableContextDelete({ editor, icons }: TableContextOptionProps) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext);
    const onClick = () => {
        editor.update(() => {
            let tableNode = null;

            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                tableNode = $getTableNodeFromLexicalNodeOrThrow(selection.anchor.getNode());
            }
            if ($isTableSelection(selection)) {
                tableNode = $getNodeByKeyOrThrow(selection.tableKey);
            }

            if (!tableNode) throw Error("TableContextDelete: expected table");

            tableNode.remove();
        });
        contextObject.closeContextMenu();
    };

    return <ContextMenuItem Icon={icons.DeleteTableIcon} title="Delete Table" onClick={onClick} />;
}
