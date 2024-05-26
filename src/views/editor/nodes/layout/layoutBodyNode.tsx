import { $createTableCellNode, $createTableRowNode, TableCellHeaderStates } from "@lexical/table";
import { $applyNodeReplacement, $createParagraphNode, $createTextNode, DOMConversionMap, DOMConversionOutput, LexicalEditor, LexicalNode, NodeKey, SerializedElementNode } from "lexical";
import { TableBodyNode } from "../table";

export class LayoutBodyNode extends TableBodyNode {
    constructor(key?: NodeKey) {
        super(key);
    }
  
    static getType(): string {
      return 'layout-body';
    }
  
    static clone(node: LayoutBodyNode): LayoutBodyNode {
      return new LayoutBodyNode( node.__key );
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
    const tableNode = $createLayoutBodyNode();

    const tableRowNode = $createTableRowNode();

    for (let iColumn = 0; iColumn < cols; iColumn++) {
      const headerState = TableCellHeaderStates.NO_STATUS;

      const tableCellNode = $createTableCellNode(headerState);
      const paragraphNode = $createParagraphNode();
      paragraphNode.append($createTextNode());
      tableCellNode.append(paragraphNode);
      tableRowNode.append(tableCellNode);
    }

    tableNode.append(tableRowNode);

  return tableNode;
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