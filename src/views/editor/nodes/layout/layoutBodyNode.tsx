import { $applyNodeReplacement, DOMConversionMap, DOMConversionOutput, LexicalEditor, LexicalNode, SerializedElementNode } from "lexical";
import { TableBodyNode } from "../table";
import { $createTableNodeWithDimensions } from "@lexical/table";

export class LayoutBodyNode extends TableBodyNode {
    constructor(node?: LayoutBodyNode) {
        super(node);
    }
  
    static getType(): string {
      return 'layout-body';
    }
  
    static clone(node: LayoutBodyNode): LayoutBodyNode {
      return new LayoutBodyNode( node );
    }
         
    removeRows() { }
      
    addRowsBefore() { }
  
    addRowsAfter() { }   
   
    createDOM(): HTMLElement {
      const tableBodyElement = document.createElement('tbody');
      return tableBodyElement;
    }
  
    updateDOM() {
      return false;
    }
  
    exportDOM(editor: LexicalEditor) {
      return {...super.exportDOM(editor), after: undefined};
    }
  
    static importDOM(): DOMConversionMap | null {
      return {
        tbody: () => ({
          conversion: $convertLayoutBodyElement,
          priority: 1,
        }),
      };
    }
  
    static importJSON(): LayoutBodyNode {
      const tableNode = $createLayoutBodyNode();
      return tableNode;
    }
    
    exportJSON(): SerializedElementNode {
      return {
        ...super.exportJSON(),
        type: 'layout-body',
        version: 1,
      };
    }  
  }
  
  export function $createLayoutBodyNodeWithColumns( cols: number ): LayoutBodyNode {
    const layoutNode = $createTableNodeWithDimensions(1, cols, false) as LayoutBodyNode;
     return layoutNode;
  }
  
  export function $convertLayoutBodyElement(): DOMConversionOutput {
    return {node: $createLayoutBodyNode()}; 
  }
  
  export function $createLayoutBodyNode(): LayoutBodyNode {
      return $applyNodeReplacement(new LayoutBodyNode());
  
  }
  
  export function $isLayoutBodyNode(node: LexicalNode | null | undefined): node is LayoutBodyNode {
      return node instanceof LayoutBodyNode;
  }