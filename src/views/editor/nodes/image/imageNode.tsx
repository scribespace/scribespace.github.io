import { Image } from '@editor/components/image';
import { addClassNamesToElement } from "@lexical/utils";
import { $applyNodeReplacement, DOMConversionMap, DOMConversionOutput, DOMExportOutput, DecoratorNode, EditorConfig, LexicalNode, NodeKey, SerializedLexicalNode } from "lexical";
import { ReactElement } from "react";

export class ImageNode extends DecoratorNode<ReactElement> {
    _imageFile: File | undefined = undefined;

    constructor(key?: NodeKey) {
        super(key);
    }

    static getType(): string {
        return 'image';
      }

      static clone(node: ImageNode): ImageNode {
        return new ImageNode(node.__key);
      }

      static importJSON(): ImageNode {
        const imageNode = $createImageNode();
        return imageNode;
      }

      setImageFile(image: File) {
        const self = this.getWritable();
        self._imageFile = image;
      }
    
      exportJSON(): SerializedLexicalNode {
        return {
          ...super.exportJSON(),
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
        addClassNamesToElement(span, config.theme.imageContainer);
        return span;
      }
    
      updateDOM(): false {
        return false;
      }

      decorate(): JSX.Element {
        return (
            <Image file={this._imageFile}/>
        );
      }
}

export function $createImageNode(): ImageNode {
    return $applyNodeReplacement( new ImageNode() );
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
    const node = $createImageNode();
    return {node};
  }