import { $getTableNodeFromLexicalNodeOrThrow } from "@lexical/table";
import { $applyNodeReplacement, DOMConversionMap, DOMConversionOutput, EditorConfig, LexicalNode } from "lexical";
import { $convertColElements, ExtendedTableNode, SerializedExtendedTableNode } from "../table";
import { $createLayoutBodyNodeWithColumns, $isLayoutBodyNode, LayoutBodyNode } from "./layoutBodyNode";

export class LayoutNode extends ExtendedTableNode {
    constructor(node?: LayoutNode) {
      super(node);
    }

  static getType(): string {
    return 'layout';
  }

  static clone(node: LayoutNode): LayoutNode {
    return new LayoutNode( node );
  }

  getTableBodyNode() {
    const tableBody = this.getLatest().getChildAtIndex(0);
    if ( !$isLayoutBodyNode(tableBody) ) throw Error("Expected LayoutBodyNode under child 0");
    return tableBody;
  }
  
  getTableBodyNodeWritable() {
    const tableBody = this.getWritable().getChildAtIndex(0);
    if ( !$isLayoutBodyNode(tableBody) ) throw Error("Expected LayoutBodyNode under child 0");
    return tableBody;
  }
  removeRows() {}

  addRowsBefore() {}

  addRowsAfter() {}

  createDOM(config: EditorConfig): HTMLElement {
    return this.createDOMWithCSS(config.theme.layout);
  }

  static importDOM(): DOMConversionMap | null {
    return {
      table: () => ({
        conversion: $convertLayoutElement,
        priority: 1,
      }),
    };
  }

  static importJSON(serializedNode: SerializedExtendedTableNode): LayoutNode {
    const layoutNode = $createLayoutNode();
    layoutNode.setColumnsWidths(serializedNode.columnsWidths);

    return layoutNode;
  }

  exportJSON(): SerializedExtendedTableNode {
    return {
      ...super.exportJSON(),
      type: 'layout',
      version: 1,
    };
  }
}

export function $createLayoutNodeWithColumns( cols: number ): ExtendedTableNode {
  const layoutNode = $createLayoutNode();
  const layoutBodyNode = $createLayoutBodyNodeWithColumns(cols);

  layoutNode.initColGroup(cols);
  layoutNode.append(layoutBodyNode);

  return layoutNode;
}

export function $getLayoutNodeFromLexicalNodeOrThrow(node: LexicalNode) {
  return ($getTableNodeFromLexicalNodeOrThrow(node) as LayoutBodyNode).getParentOrThrow<LayoutNode>();
}

export function $convertLayoutElement(domNode: Node): DOMConversionOutput {
    const layoutNode = $createLayoutNode();
    if ( !(domNode instanceof Element) ) throw Error("Expected Element");
  
    $convertColElements(layoutNode, domNode);
  
    return {node: layoutNode}; 
  }

export function $createLayoutNode(): LayoutNode {
	return $applyNodeReplacement(new LayoutNode());

}

export function $isLayoutNode(node: LexicalNode | null | undefined): node is LayoutNode {
	return node instanceof LayoutNode;
}