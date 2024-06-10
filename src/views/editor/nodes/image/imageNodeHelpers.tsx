import { $applyNodeReplacement, $getNodeByKey, DOMConversionOutput, LexicalNode, NodeKey } from "lexical";
import { ImageNode } from "./imageNode";

export function $createImageNode(
  src?: string,
  width?: number,
  height?: number,
  blob?: Blob
): ImageNode {
  return $applyNodeReplacement(new ImageNode(src, width, height, blob));
}

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode;
}

export function $getImageNodeByKey(key: NodeKey) {
  const node = $getNodeByKey(key);
  if ( $isImageNode(node) ) return node;
  return null;
}

export function $convertImageElement(domNode: Node): null | DOMConversionOutput {
  const img = domNode as HTMLImageElement;
  const { src, width, height } = img;
  if (src.startsWith("file:///")) {
    return null;
  }

  const node = $createImageNode(src, width, height);
  return { node };
}
