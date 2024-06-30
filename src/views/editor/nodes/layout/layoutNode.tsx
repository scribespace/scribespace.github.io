import { $getTableNodeFromLexicalNodeOrThrow } from "@lexical/table";
import {
  $applyNodeReplacement,
  COMMAND_PRIORITY_HIGH,
  DOMConversionMap,
  DOMConversionOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
} from "lexical";
import {
  $convertColElements,
  ExtendedTableNode,
  SerializedExtendedTableNode,
} from "../table";
import {
  $createLayoutBodyNodeWithColumns,
  $isLayoutBodyNode,
  LayoutBodyNode,
} from "./layoutBodyNode";
import { Metric } from "@/utils/types";

export class LayoutNode extends ExtendedTableNode {
  constructor(columnsWidths?: Metric[], key?: NodeKey) {
    super(columnsWidths, key);
  }

  static getType(): string {
    return "layout";
  }

  static clone(node: LayoutNode): LayoutNode {
    return new LayoutNode(node.__columnsWidths, node.__key);
  }

  getTableBodyNode() {
    const tableBody = this.getLatest().getChildAtIndex(0);
    if (!$isLayoutBodyNode(tableBody))
      throw Error("Expected LayoutBodyNode under child 0");
    return tableBody;
  }

  removeRows() {}

  addRowsBefore() {}

  addRowsAfter() {}

  createDOM(config: EditorConfig): HTMLElement {
    const dom = this.createDOMWithCSS(config.theme.layout);
    dom.setAttribute('type', this.getType());
    return dom;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      table: (domNode: HTMLElement) => { 
        const tp = domNode.getAttribute('type');
            if (tp !== this.getType()) {
              return null;
            }

        return {
          conversion: $convertLayoutElement,
          priority: COMMAND_PRIORITY_HIGH,
        };
      },
    };
  }

  static importJSON(serializedNode: SerializedExtendedTableNode): LayoutNode {
    const layoutNode = $createLayoutNode();
    layoutNode.columnsWidthsFromJSON(serializedNode.columnsWidths);

    return layoutNode;
  }

  exportJSON(): SerializedExtendedTableNode {
    return {
      ...super.exportJSON(),
      type: "layout",
      version: 1,
    };
  }
}

export function $createLayoutNodeWithColumns(cols: number): ExtendedTableNode {
  const layoutNode = $createLayoutNode();
  const layoutBodyNode = $createLayoutBodyNodeWithColumns(cols);

  layoutNode.initColGroup(cols);
  layoutNode.append(layoutBodyNode);

  return layoutNode;
}

export function $getLayoutNodeFromLexicalNodeOrThrow(node: LexicalNode) {
  return (
    $getTableNodeFromLexicalNodeOrThrow(node) as LayoutBodyNode
  ).getParentOrThrow<LayoutNode>();
}

export function $convertLayoutElement(domNode: Node): DOMConversionOutput {
  const layoutNode = $createLayoutNode();
  if (!(domNode instanceof Element)) throw Error("Expected Element");

  $convertColElements(layoutNode, domNode);

  return { node: layoutNode };
}

export function $createLayoutNode(): LayoutNode {
  return $applyNodeReplacement(new LayoutNode());
}

export function $isLayoutNode(
  node: LexicalNode | null | undefined,
): node is LayoutNode {
  return node instanceof LayoutNode;
}
