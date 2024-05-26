import { useCallback } from "react";
import { MenuItem } from "../menu";
import { useToolbarContext } from "../../plugins/toolbarPlugin/context";
import { $createLayoutNodeWithColumns } from "../../nodes/layout";
import { $insertNodes } from "lexical";

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