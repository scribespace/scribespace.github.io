import { useCallback } from "react";
import { $insertNodes } from "lexical";
import { $createLayoutNodeWithColumns } from "@/views/editor/nodes/layout";
import { useToolbarContext } from "@/views/editor/plugins/toolbarPlugin/context";
import { MenuItem } from "../../menu";

export function LayoutCreateToolbar() {
    const {editor} = useToolbarContext();

    const onClick = useCallback(
        () => {
            editor.update(
                () => {
                    const layoutNode = $createLayoutNodeWithColumns(3);
                    $insertNodes([layoutNode]);
                }
            );
        },
        [editor]
    );

    return (
        <MenuItem onClick={onClick}>
            <div>TEst</div>
        </MenuItem>
    );    
}