import { $createParagraphNode, $getSelection, $isRangeSelection, $isTextNode, COMMAND_PRIORITY_LOW, LexicalCommand, TextNode, createCommand } from "lexical";
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import { useEffect, useRef } from "react";
import { $isDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import { $getNearestBlockElementAncestorOrThrow } from '@lexical/utils';
import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import {$patchStyleText} from '@lexical/selection';
import { $isTableCellNode, $isTableSelection } from "@lexical/table";

export const INCREASE_FONT_SIZE_COMMAND: LexicalCommand<void> = createCommand();
export const DECREASE_FONT_SIZE_COMMAND: LexicalCommand<void> = createCommand();
export const SET_FONT_SIZE_COMMAND: LexicalCommand<string> = createCommand();
export const FONT_SIZE_CHANGED_COMMAND: LexicalCommand<void> = createCommand();
export const SET_FONT_FAMILY_COMMAND: LexicalCommand<string> = createCommand();
export const SET_FONT_COLOR_COMMAND: LexicalCommand<string> = createCommand();
export const SET_BACKGROUND_COLOR_COMMAND: LexicalCommand<string> = createCommand();
export const FONT_COLOR_CHANGE_COMMAND: LexicalCommand<void> = createCommand();
export const BACKGROUND_COLOR_CHANGE_COMMAND: LexicalCommand<void> = createCommand();

export default function RegisterCustomCommands() {
    const [editor] = useLexicalComposerContext();
    const defaultFontSize = useRef<string>('');

    useEffect(()=>{
            defaultFontSize.current = getComputedStyle(document.documentElement).getPropertyValue("--default-font-size");

            const removeFunctionsArray: {(): void}[] = [];

        const removeIncreaseFontSize = editor.registerCommand(INCREASE_FONT_SIZE_COMMAND, () => {
            const selection = $getSelection();
            if ( $isRangeSelection(selection)) {
                $patchStyleText(selection, {'font-size': (currentValue) => {
                    if ( !currentValue ) {
                        currentValue = defaultFontSize.current;
                    }

                    let size = Number((currentValue.match(/\d+/g) as RegExpMatchArray)[0]);
                    const unit = currentValue.match(/[a-zA-Z]+/g);
                    size += 1;
                    return size + (unit ? unit[0] : '');
                }});

                editor.dispatchCommand(FONT_SIZE_CHANGED_COMMAND, undefined);
            }

            return false;
        },
        COMMAND_PRIORITY_LOW);
        removeFunctionsArray.push( removeIncreaseFontSize);

        const removeDecreaseFontSize = editor.registerCommand(DECREASE_FONT_SIZE_COMMAND, () => {
            const selection = $getSelection();
            if ( $isRangeSelection(selection)) {
                $patchStyleText(selection, {'font-size': (currentValue) => {
                    if ( !currentValue ) {
                        currentValue = defaultFontSize.current;
                    }

                    let size = Number((currentValue.match(/\d+/g) as RegExpMatchArray)[0]);
                    const unit = currentValue.match(/[a-zA-Z]+/g);
                    size -= 1;
                    return size + (unit ? unit[0] : '');
                }});
                editor.dispatchCommand(FONT_SIZE_CHANGED_COMMAND, undefined);
            }

            return false;
        },
        COMMAND_PRIORITY_LOW);
        removeFunctionsArray.push( removeDecreaseFontSize);

        const removeSetFontSize = editor.registerCommand(SET_FONT_SIZE_COMMAND, (fontSize: string) => {
            const selection = $getSelection();
            if ( $isRangeSelection(selection)) {
                $patchStyleText( selection, {'font-size': fontSize});
                editor.dispatchCommand(FONT_SIZE_CHANGED_COMMAND, undefined);
            }

            return false;
        },
        COMMAND_PRIORITY_LOW);
        removeFunctionsArray.push( removeSetFontSize );

        const removeSetFontFamily = editor.registerCommand(SET_FONT_FAMILY_COMMAND, (fontFamily: string) => {
            const selection = $getSelection();
            if ( $isRangeSelection(selection)) {
                $patchStyleText( selection, {'font-family': fontFamily});
                editor.dispatchCommand(FONT_SIZE_CHANGED_COMMAND, undefined);
            }

            return false;
        },
        COMMAND_PRIORITY_LOW);
        removeFunctionsArray.push( removeSetFontFamily );

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