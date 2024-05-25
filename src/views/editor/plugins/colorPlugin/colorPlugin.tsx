import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $patchStyleText } from "@lexical/selection";
import { $isTableSelection, $isTableCellNode } from "@lexical/table";
import { mergeRegister } from "@lexical/utils";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW } from "lexical";
import { useEffect } from "react";
import { SET_FONT_COLOR_COMMAND, FONT_COLOR_CHANGE_COMMAND, SET_BACKGROUND_COLOR_COMMAND, BACKGROUND_COLOR_CHANGE_COMMAND } from "./colorCommands";

export function ColorPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(
        () => {
            return mergeRegister(
                editor.registerCommand(
                    SET_FONT_COLOR_COMMAND, 
                    (color: string) => {
                        const selection = $getSelection();
                        if ( $isRangeSelection(selection)) {
                            $patchStyleText( selection, {'color': color});
                            editor.dispatchCommand(FONT_COLOR_CHANGE_COMMAND, undefined);
                        }
            
                        return false;
                    },
                    COMMAND_PRIORITY_LOW
                ),
                editor.registerCommand(
                    SET_BACKGROUND_COLOR_COMMAND, 
                    (color: string) => {
                        const selection = $getSelection();
                        if ( $isRangeSelection(selection)) {
                            $patchStyleText( selection, {'background-color': color});
                            editor.dispatchCommand(BACKGROUND_COLOR_CHANGE_COMMAND, undefined);
                        } else if ($isTableSelection(selection)) { 
                            selection.getNodes().forEach((cellNode) => {
                                if ( $isTableCellNode(cellNode)) {
                                    cellNode.setBackgroundColor(color);
                                }
                            });
                        }
            
                        return false;
                    },
                    COMMAND_PRIORITY_LOW
                ),
            );
        },
        [editor]
    );

    return null;
}