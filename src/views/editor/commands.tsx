import { $createParagraphNode, $getSelection, $isRangeSelection, $isTextNode, COMMAND_PRIORITY_LOW, LexicalCommand, TextNode, createCommand } from "lexical";
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import { useEffect, useRef } from "react";
import { $isDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import { $getNearestBlockElementAncestorOrThrow } from '@lexical/utils';
import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import {$patchStyleText} from '@lexical/selection';
import { $isTableCellNode, $isTableSelection } from "@lexical/table";



export const SET_FONT_COLOR_COMMAND: LexicalCommand<string> = createCommand();
export const SET_BACKGROUND_COLOR_COMMAND: LexicalCommand<string> = createCommand();
export const FONT_COLOR_CHANGE_COMMAND: LexicalCommand<void> = createCommand();
export const BACKGROUND_COLOR_CHANGE_COMMAND: LexicalCommand<void> = createCommand();

export default function RegisterCustomCommands() {
    const [editor] = useLexicalComposerContext();

    useEffect(()=>{
            const removeFunctionsArray: {(): void}[] = [];

        


        const removeSetFontColor = editor.registerCommand(SET_FONT_COLOR_COMMAND, (color: string) => {
            const selection = $getSelection();
            if ( $isRangeSelection(selection)) {
                $patchStyleText( selection, {'color': color});
                editor.dispatchCommand(FONT_COLOR_CHANGE_COMMAND, undefined);
            }

            return false;
        },
        COMMAND_PRIORITY_LOW);
        removeFunctionsArray.push( removeSetFontColor );

        const removeSetBackgroundColor = editor.registerCommand(SET_BACKGROUND_COLOR_COMMAND, (color: string) => {
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
        COMMAND_PRIORITY_LOW);
        removeFunctionsArray.push( removeSetBackgroundColor );
        
        return () => { 
            removeFunctionsArray.forEach(f => f());
         };
    }, [editor]);

    return null;
}