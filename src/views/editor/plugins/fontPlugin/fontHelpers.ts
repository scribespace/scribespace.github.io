import { $isElementNode, $isTextNode, LexicalNode } from "lexical";

export function $clearFormat(node: LexicalNode, defaultStyle: string, startNode: LexicalNode | null, endNode: LexicalNode | null) {
    if ( $isTextNode(node) || $isElementNode(node) ) {
        if ( (startNode == null || node.is(startNode) || startNode.isBefore(node)) && (endNode == null || node.is(endNode) || node.isBefore(endNode)) ) {
            if ( $isTextNode(node) ) {
                node.setFormat(0);
                node.setStyle(defaultStyle);
            } else {
                node.setFormat("");
                const children = node.getChildren();
                for ( const child of children ) {
                    $clearFormat(child, defaultStyle, startNode, endNode);
                }
            }
        }
    }   
}