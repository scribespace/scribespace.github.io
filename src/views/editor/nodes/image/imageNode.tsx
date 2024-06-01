import { Image } from '@editor/components/image';
import { addClassNamesToElement } from "@lexical/utils";
import { $applyNodeReplacement, DOMConversionMap, DOMConversionOutput, DOMExportOutput, DecoratorNode, EditorConfig, LexicalNode, NodeKey, SerializedLexicalNode, Spread } from "lexical";
import { ReactElement } from "react";
import { EditorInputTheme } from '@editor/theme/editorTheme';

export type SerializedImageNode = Spread<
  {
    src: string;
    width?: number;
    height?: number;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<ReactElement> {
    __src: string;
    __width?: number;
    __height?: number;

    __blob?: Blob;

    constructor(src?: string, width?: number, height?: number, blob?: Blob, key?: NodeKey) {
        super(key);

        this.__src = src || '';
        this.__blob = blob;

        this.__width = width;
        this.__height = height;
    }

    static getType(): string {
        return 'image';
      }

      static clone(node: ImageNode): ImageNode {
        return new ImageNode(node.__src, node.__width, node.__height, node.__blob, node.__key);
      }

      setSrc(src: string) {
        const self = this.getWritable();
        self.__src = src;
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
        const imageNode = $createImageNode(serializedNode.src, serializedNode.width, serializedNode.height);
        return imageNode;
      }
    
      exportJSON(): SerializedImageNode {
        return {
          ...super.exportJSON(),
          src: this.__src,
          width: this.__width,
          height: this.__height,
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
        element.setAttribute('src', this.__src);        
        element.setAttribute('width', `${this.__width}px`);
        element.setAttribute('height', `${this.__height}px`);
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
            <Image 
              src={this.__src} 
              width={this.__width} 
              height={this.__height} 
              blob={this.__blob} 
              imageKey={this.getKey()} 
              setSrc={(src:string)=> {this.setSrc(src);} } 
              setWidthHeight={(width: number, height: number) => {this.setWidthHeight(width, height);}}/>
        );
      }
}

  export function $createImageNode(src?: string, width?: number, height?: number, blob?: Blob): ImageNode {
      return $applyNodeReplacement( new ImageNode(src, width, height, blob) );
  }

  export function $isImageNode(
    node: LexicalNode | null | undefined,
  ): node is ImageNode {  
    return node instanceof ImageNode;
  }
  

  function $convertImageElement(domNode: Node): null | DOMConversionOutput {
    const img = domNode as HTMLImageElement;
    const {src, width, height} = img;
    if (src.startsWith('file:///')) {
      return null;
    }

    const node = $createImageNode(src, width, height);
    return {node};
  }