import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import { $getNearestBlockElementAncestorOrThrow, mergeRegister } from '@lexical/utils';
import { $createParagraphNode, $getSelection, $isRangeSelection, $isTextNode, COMMAND_PRIORITY_LOW, TextNode } from "lexical";
import { useEffect } from "react";
import { CLEAR_FONT_STYLE_COMMAND, DECREASE_FONT_SIZE_COMMAND, FONT_FAMILY_CHANGED_COMMAND, FONT_SIZE_CHANGED_COMMAND, INCREASE_FONT_SIZE_COMMAND, SET_FONT_FAMILY_COMMAND, SET_FONT_SIZE_COMMAND } from './fontCommands';
import { $patchStyleText } from '@lexical/selection';
import { useMainThemeContext } from '@/mainThemeContext';
import { MainTheme } from '@/theme';

export function FontPlugin() {
    const [editor] = useLexicalComposerContext();
    const {editorTheme:{editorInputTheme:{defaultFontSize}}, editorTheme:{editorInputTheme:{defaultFontFamily}}}: MainTheme = useMainThemeContext();

    useEffect(()=>{
            return mergeRegister( 
                editor.registerCommand(CLEAR_FONT_STYLE_COMMAND, () => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        const anchor = selection.anchor;
                        const focus = selection.focus;
                        const nodes = selection.getNodes();
                
                        if (anchor.key === focus.key && anchor.offset === focus.offset) {
                            return false;
                        }
                
                        nodes.forEach((node, idx) => {
                            // We split the first and last node by the selection
                            // So that we don't format unselected text inside those nodes
                            if ($isTextNode(node)) {
                                if (idx === 0 && anchor.offset !== 0) {
                                    node = node.splitText(anchor.offset)[1] || node;
                                }
                                if (idx === nodes.length - 1) {
                                    node = (node as TextNode).splitText(focus.offset)[0] || node;
                                }
                    
                                if ((node as TextNode).__style !== '') {
                                    (node as TextNode).setStyle('');
                                }
                                if ((node as TextNode).__format !== 0) {
                                    (node as TextNode).setFormat(0);
                                    $getNearestBlockElementAncestorOrThrow(node).setFormat('');
                                }
                            } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
                                node.replace($createParagraphNode(), true);
                            } else if ($isDecoratorBlockNode(node)) {
                                node.setFormat('');
                            }
                        });
                    }
                return false; // propagation
            },
            COMMAND_PRIORITY_LOW),
    );
    }, [editor]);

    useEffect(()=>{
        return mergeRegister( 
            editor.registerCommand(INCREASE_FONT_SIZE_COMMAND, () => {
                const selection = $getSelection();
                if ( $isRangeSelection(selection)) {
                    $patchStyleText(selection, {'font-size': (currentValue) => {
                        if ( !currentValue ) {
                            currentValue = defaultFontSize;
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
            COMMAND_PRIORITY_LOW),

            editor.registerCommand(DECREASE_FONT_SIZE_COMMAND, () => {
                const selection = $getSelection();
                if ( $isRangeSelection(selection)) {
                    $patchStyleText(selection, {'font-size': (currentValue) => {
                        if ( !currentValue ) {
                            currentValue = defaultFontSize;
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
            COMMAND_PRIORITY_LOW),

            editor.registerCommand(SET_FONT_SIZE_COMMAND, (fontSize: string) => {
                const selection = $getSelection();
                if ( $isRangeSelection(selection)) {
                    $patchStyleText( selection, {'font-size': fontSize});
                    editor.dispatchCommand(FONT_SIZE_CHANGED_COMMAND, undefined);
                }

                return false;
            },
            COMMAND_PRIORITY_LOW),
        );
    }, [defaultFontSize, editor]);

    useEffect(()=>{
        return mergeRegister( 
            editor.registerCommand(SET_FONT_FAMILY_COMMAND, (fontFamily: string) => {
                const selection = $getSelection();
                if ( $isRangeSelection(selection)) {
                    $patchStyleText( selection, {'font-family': fontFamily});
                    editor.dispatchCommand(FONT_FAMILY_CHANGED_COMMAND, fontFamily);
                }

                return false;
            },
            COMMAND_PRIORITY_LOW)
        );
    }, [defaultFontFamily, editor]);
    return null;
}