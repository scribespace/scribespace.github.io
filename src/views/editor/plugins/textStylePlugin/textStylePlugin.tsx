import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import { $getNearestBlockElementAncestorOrThrow } from '@lexical/utils';
import { $createParagraphNode, $getSelection, $isRangeSelection, $isTextNode, COMMAND_PRIORITY_LOW, TextNode } from "lexical";
import { useEffect } from "react";
import { CLEAR_FORMAT_TEXT_COMMAND } from './commands';

export default function TextStylePlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(()=>{
            return editor.registerCommand(CLEAR_FORMAT_TEXT_COMMAND, () => {
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
        COMMAND_PRIORITY_LOW);
    }, [editor]);

    return null;
}