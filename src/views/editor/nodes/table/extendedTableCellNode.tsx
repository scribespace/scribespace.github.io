import { SerializedTableCellNode, TableCellHeaderStates, TableCellNode } from "@lexical/table";
import { $applyNodeReplacement, DOMExportOutput, LexicalEditor, LexicalNode, NodeKey } from "lexical";

export class ExtendedTableCellNode extends TableCellNode {
    static getType(): string {
    return "extended-table-cell";
    }

    constructor(
    colSpan = 1,
    width?: number,
    key?: NodeKey,
    ) {
      super(TableCellHeaderStates.NO_STATUS, colSpan, width, key);
    }

    static clone(node: ExtendedTableCellNode): ExtendedTableCellNode {
      const cellNode = new ExtendedTableCellNode(
        node.__colSpan,
        node.__width,
        node.__key,
      );
      cellNode.__rowSpan = node.__rowSpan;
      cellNode.__backgroundColor = node.__backgroundColor;
      return cellNode;
    }

    exportDOM(editor: LexicalEditor): DOMExportOutput {
      const {element} = super.exportDOM(editor);
      if (element) {
          const element_ = element as HTMLTableCellElement;
          element_.style.width = this.getWidth()  ? `${this.getWidth()}px` : "";
      }

      return {
          element,
      };
    }

    exportJSON() {
    return {
        ...super.exportJSON(),
        type: ExtendedTableCellNode.getType(),
    };
    }

    static importJSON(serializedNode: SerializedTableCellNode): TableCellNode {
      return TableCellNode.importJSON(serializedNode);
    }
}

export function $createExtendedTableCellNode(
    colSpan = 1,
    width?: number,
  ): ExtendedTableCellNode {
    return $applyNodeReplacement(new ExtendedTableCellNode(colSpan, width));
  }
  
  export function $isExtendedTableCellNode(
    node: LexicalNode | null | undefined,
  ): node is ExtendedTableCellNode {
    return node instanceof ExtendedTableCellNode;
  }
  