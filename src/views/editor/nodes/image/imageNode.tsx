import { Image } from "@editor/components/image";
import { EditorInputTheme } from "@editor/theme/editorTheme";
import { addClassNamesToElement } from "@lexical/utils";
import {
  $applyNodeReplacement,
  $getNodeByKey,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  DecoratorNode,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { ReactElement } from "react";

export type SerializedImageNode = Spread<
  {
    src: string;
    filePath: string;
    width?: number;
    height?: number;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<ReactElement> {
  __src: string;
  __filePath: string;
  __width?: number;
  __height?: number;
  __imageID: number;

  constructor(
    imageID: number,
    src?: string,
    filePath?: string,
    width?: number,
    height?: number,
    key?: NodeKey,
  ) {
    super(key);

    this.__src = src || "";
    this.__filePath = filePath || "";

    this.__width = width && width > 0 ? width : undefined;
    this.__height = height && height > 0 ? height : undefined;

    this.__imageID = imageID;
  }

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__imageID,
      node.__src,
      node.__filePath,
      node.__width,
      node.__height,
    );
  }

  setSrc(src: string) {
    const self = this.getWritable();
    self.__src = src;
  }

  setFilePath(filePath: string) {
    const self = this.getWritable();
    self.__filePath = filePath;
  }

  setWidth(width: number) {
    const self = this.getWritable();
    self.__width = width;
  }

  setHeight(height: number) {
    const self = this.getWritable();
    self.__height = height;
  }

  setWidthHeight(width: number, height: number) {
    const self = this.getWritable();
    self.__width = width;
    self.__height = height;
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const imageNode = $createImageNode(
      -1,
      serializedNode.src,
      serializedNode.filePath,
      serializedNode.width,
      serializedNode.height
    );
    return imageNode;
  }

  exportJSON(): SerializedImageNode {
    return {
      src: this.__src,
      filePath: this.__filePath,
      width: this.__width,
      height: this.__height,
      type: "image",
      version: 1,
    };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: $convertImageElement,
        priority: 0,
      }),
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("width", `${this.__width}%`);
    element.setAttribute("height", `${this.__height}%`);
    return { element };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    addClassNamesToElement(span, (config.theme as EditorInputTheme).image);
    return span;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <Image
        src={this.__src}
        width={this.__width}
        height={this.__height}
        imageNodeKey={this.getKey()}
        imageID={this.__imageID}
      />
    );
  }
}

export function $createImageNode(
  imageID: number,
  src?: string,
  filePath?: string,
  width?: number,
  height?: number,
): ImageNode {
  return $applyNodeReplacement(new ImageNode(imageID, src, filePath, width, height));
}

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode;
}

export function $getImageNodeByKey(key: NodeKey) {
  const node = $getNodeByKey(key);
  if ($isImageNode(node)) return node;
  return null;
}

export function $convertImageElement(domNode: Node): null | DOMConversionOutput {
  const img = domNode as HTMLImageElement;
  const { src, width, height } = img;
  if (src.startsWith("file:///")) {
    return null;
  }

  const node = $createImageNode(-1, src, undefined, width, height);
  return { node };
}


