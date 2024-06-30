import { Metric, MetricSerialized } from "@/utils/types";
import { Image } from "@editor/components/image";
import { EditorInputTheme } from "@editor/theme/editorTheme";
import { addClassNamesToElement } from "@lexical/utils";
import { $callCommand } from "@systems/commandsManager/commandsManager";
import { NOTE_CONVERTED_CMD } from "@systems/notesManager/notesCommands";
import { variableExists } from "@utils";
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

type SerializedImageNodeV1 = Spread<
  {
    src: string;
    filePath: string;
    width?: number;
    height?: number;
  },
  SerializedLexicalNode
>;

export type SerializedImageNode = Spread<
  {
    src: string;
    filePath: string;
    width?: MetricSerialized;
    height?: MetricSerialized;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<ReactElement> {
  __src: string;
  __filePath: string;
  __width?: Metric;
  __height?: Metric;
  __imageID: number;

  constructor(
    imageID: number,
    src?: string,
    filePath?: string,
    width?: Metric,
    height?: Metric,
    key?: NodeKey,
  ) {
    super(key);

    this.__src = src || "";
    this.__filePath = filePath || "";

    this.__width = width && width.value > 0 ? width : undefined;
    this.__height = height && height.value > 0 ? height : undefined;

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

  setWidth(width: Metric) {
    const self = this.getWritable();
    self.__width = width;
  }

  setHeight(height: Metric) {
    const self = this.getWritable();
    self.__height = height;
  }

  setWidthHeight(width: Metric, height: Metric) {
    const self = this.getWritable();
    self.__width = width;
    self.__height = height;
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    if ( serializedNode.version === 1 ) {
      const nodeV1 = serializedNode as SerializedImageNodeV1;
      serializedNode = { ...serializedNode, 
        width: variableExists( nodeV1.width ) ? {value: nodeV1.width, unit: 'px'} : undefined,
        height: variableExists( nodeV1.height ) ? {value: nodeV1.height, unit: 'px'} : undefined,
      } as SerializedImageNode;

      $callCommand(NOTE_CONVERTED_CMD, undefined);
    }

    const imageNode = $createImageNode(
      -1,
      serializedNode.src,
      serializedNode.filePath,
      variableExists(serializedNode.width) ? Metric.import(serializedNode.width) : undefined,
      variableExists(serializedNode.height) ? Metric.import(serializedNode.height) : undefined
    );
    return imageNode;
  }

  exportJSON(): SerializedImageNode {
    return {
      src: this.__src,
      filePath: this.__filePath,
      width: this.__width?.export(),
      height: this.__height?.export(),
      type: "image",
      version: 2,
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
  width?: Metric,
  height?: Metric,
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

  const metricWidth = variableExists(width) ? new Metric(width, 'px') : undefined;
  const metricHeight = variableExists(height) ? new Metric(height, 'px') : undefined;

  const node = $createImageNode(-1, src, undefined, metricWidth, metricHeight);
  return { node };
}


