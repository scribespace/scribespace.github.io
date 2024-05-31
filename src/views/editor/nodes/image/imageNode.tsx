import { Image } from '@editor/components/image';
import { addClassNamesToElement } from "@lexical/utils";
import { $applyNodeReplacement, DOMConversionMap, DOMConversionOutput, DOMExportOutput, DecoratorNode, EditorConfig, LexicalNode, NodeKey, SerializedLexicalNode, Spread } from "lexical";
import { ReactElement } from "react";
import { EditorInputTheme } from '../../theme/editorTheme';

export type SerializedImageNode = Spread<
  {
    src: string;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<ReactElement> {
    __src: string;
    __blob?: Blob;

    constructor(src?: string, blob?: Blob, key?: NodeKey) {
        super(key);

        this.__src = src || '';
        this.__blob = blob;
    }

    static getType(): string {
        return 'image';
      }

      static clone(node: ImageNode): ImageNode {
        return new ImageNode(node.__src, node.__blob, node.__key);
      }

      setSrc(src: string) {
    const self = this.getWritable();
        self.__src = src;
      }

      static importJSON(serializedNode: SerializedImageNode): ImageNode {
        const imageNode = $createImageNode(serializedNode.src);
        return imageNode;
      }
    
      exportJSON(): SerializedImageNode {
        return {
          ...super.exportJSON(),
          src: this.__src,
          type: 'image',
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
        const element = document.createElement('img');
        // element.setAttribute('src', this.__src);
        // element.setAttribute('alt', this.__altText);
        // element.setAttribute('width', this.__width.toString());
        // element.setAttribute('height', this.__height.toString());
        return {element};
      }

      createDOM(config: EditorConfig): HTMLElement {
        const span = document.createElement('span');
        addClassNamesToElement(span, (config.theme as EditorInputTheme).image);
        return span;
      }
    
      updateDOM(): false {
        return false;
      }

      decorate(): JSX.Element {
        return (
            <Image src={this.__src} blob={this.__blob} imageKey={this.getKey()}/>
        );
      }
}

  export function $createImageNode(src?: string, blob?: Blob): ImageNode {
      return $applyNodeReplacement( new ImageNode(src, blob) );
  }

  export function $isImageNode(
    node: LexicalNode | null | undefined,
  ): node is ImageNode {  
    return node instanceof ImageNode;
  }
  

  function $convertImageElement(domNode: Node): null | DOMConversionOutput {
    const img = domNode as HTMLImageElement;
    if (img.src.startsWith('file:///')) {
      return null;
    }
    const node = $createImageNode(img.src);
    return {node};
  }