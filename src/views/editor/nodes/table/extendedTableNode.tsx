import { assert } from "@/utils";
import { Metric } from "@/utils/types";
import {
  $getTableNodeFromLexicalNodeOrThrow,
  TableCellNode,
} from "@lexical/table";
import { addClassNamesToElement } from "@lexical/utils";
import {
  $applyNodeReplacement,
  DOMConversionMap,
  DOMConversionOutput,
  EditorConfig,
  EditorThemeClassName,
  ElementNode,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
  Spread,
} from "lexical";
import { isCurrentlyReadOnlyMode } from "lexical";
import {
  $createTableBodyNodeWithDimensions,
  $isTableBodyNode,
  TableBodyNode,
} from "./tableBodyNode";

export type SerializedExtendedTableNode = Spread<
  {
    columnsWidths: Metric[];
  },
  SerializedElementNode
>;

export class ExtendedTableNode extends ElementNode {
  __columnsWidths: Metric[] = [];

  constructor(columnsWidths?: Metric[], key?: NodeKey) {
    super(key);
    if ( columnsWidths ) {
      for ( const width of columnsWidths ) {
        this.__columnsWidths.push( width.clone() );
      }
    }
  }

  static getType(): string {
    return "extended-table";
  }

  static clone(node: ExtendedTableNode): ExtendedTableNode {
    return new ExtendedTableNode(node.__columnsWidths, node.__key);
  }

  getColumnsWidths() {
    return this.getLatest().__columnsWidths;
  }
  setColumnsWidths(columns: Metric[]) {
    const self = this.getWritable();
    self.__columnsWidths.length = 0;
    for ( const width of columns ) {
      self.__columnsWidths.push( width.clone() );
      }
  }

  initColGroup(columnsCount: number) {
    const self = this.getWritable();

    const columnsWidths: Metric[] = [];

    for (let c = 0; c < columnsCount; ++c) {
      columnsWidths.push(new Metric());
    }

    self.__columnsWidths = columnsWidths;
  }

  setColumnWidth(columnID: number, value: Metric) {
    const self = this.getWritable();
    if (columnID < 0 || columnID >= self.__columnsWidths.length) {
      throw Error(
        `ExtendedTableNode -> setColumnWidth: wrong column ID: ${columnID}. ColCount: ${self.__columnsWidths.length}`,
      );
    }

    self.__columnsWidths[columnID] = value;
  }

  getColumnWidth(columnID: number): Metric {
    const self = this.getLatest();
    if (columnID < 0 || columnID >= self.__columnsWidths.length) {
      throw Error(
        `ExtendedTableNode -> getColumnWidth: wrong column ID: ${columnID}. Or columns not updated: ${self.__columnsWidths.length}`,
      );
    }

    return self.__columnsWidths[columnID];
  }

  getTableBodyNode() {
    const tableBody = this.getLatest().getChildAtIndex(0);
    if (!$isTableBodyNode(tableBody))
      throw Error("Expected TableBodyNode under child 0");
    return tableBody;
  }

  mergeCells(
    editor: LexicalEditor,
    startCell: TableCellNode,
    rowsCount: number,
    columnsCount: number,
  ) {
    this.getTableBodyNode().mergeCells(
      editor,
      startCell,
      rowsCount,
      columnsCount,
    );
  }

  splitCell(editor: LexicalEditor, cell: TableCellNode) {
    this.getTableBodyNode().splitCell(editor, cell);
  }

  removeRows(cellNode: TableCellNode, rowsCount: number) {
    if (rowsCount == this.getTableBodyNode().getChildrenSize()) {
      this.remove();
      return;
    }

    this.getTableBodyNode().removeRows(cellNode, rowsCount);
  }

  addRowsBefore(cellNode: TableCellNode, rowsToAdd: number) {
    this.getTableBodyNode().addRowsBefore(cellNode, rowsToAdd);
  }

  addRowsAfter(cellNode: TableCellNode, rowsToAdd: number) {
    this.getTableBodyNode().addRowsAfter(cellNode, rowsToAdd);
  }

  addColumnsBefore(cellNode: TableCellNode, columnsToAdd: number) {
    this.getTableBodyNode().addColumnsBefore(
      cellNode,
      columnsToAdd,
      this.getWritable().__columnsWidths,
    );
  }

  addColumnsAfter(cellNode: TableCellNode, columnsToAdd: number) {
    this.getTableBodyNode().addColumnsAfter(
      cellNode,
      columnsToAdd,
      this.getWritable().__columnsWidths,
    );
  }

  removeColumns(cellNode: TableCellNode, columnsCount: number) {
    if (columnsCount == this.getWritable().getColumnsWidths().length) {
      this.remove();
      return;
    }
    this.getTableBodyNode().removeColumns(
      cellNode,
      columnsCount,
      this.getWritable().__columnsWidths,
    );
  }

  createDOMWithCSS(css: EditorThemeClassName | undefined): HTMLElement {
    const self = this.getLatest();

    const tableElement = document.createElement("table");
    addClassNamesToElement(tableElement, css);

    const colgroup = document.createElement("colgroup");
    for (const columnWidth of self.__columnsWidths) {
      const colElement = document.createElement("col");
      if (columnWidth.isValid())
        colElement.style.cssText = `width: ${columnWidth}px`;
      colgroup.append(colElement);
    }

    tableElement.append(colgroup);

    return tableElement;
  }

  createDOM(config: EditorConfig): HTMLElement {
    return this.createDOMWithCSS(config.theme.table);
  }

  fixColumns( dom: HTMLTableElement ) {
    const self = this.getWritable();
    const {width} = dom.getBoundingClientRect();
    for ( const column of self.__columnsWidths ) {
      if ( column.unit == "%" ) {
        column.setUnit( "px" );
        column.setValue( width * column.value / 100 );
      }
    }
  }

  updateDOM(_prevNode?: unknown, dom?: HTMLElement) {
    const isReadOnly = isCurrentlyReadOnlyMode();
    const self = isReadOnly ? this.getLatest() : this.getWritable();
    if (dom) {
      if (!(dom instanceof HTMLTableElement))
        throw Error("expected HTMLTableColElement");

      if ( !isReadOnly )
        this.fixColumns(dom);

      const colgroupElement = dom.getElementsByTagName( "colgroup" )[0] as HTMLTableColElement;
      if (!(colgroupElement instanceof HTMLTableColElement))
        throw Error("expected HTMLTableColElement");

      if (colgroupElement.childElementCount != self.__columnsWidths.length) {
        const children = colgroupElement.children;
        while (colgroupElement.childElementCount > 0) {
          const child = children.item(0) as Element;
          assert(child instanceof HTMLTableColElement, `wrong child for colgroup: ${child.tagName}` );
          colgroupElement.removeChild(child);
        }

        for (let c = 0; c < self.__columnsWidths.length; ++c) {
          const colElement = document.createElement("col");
          colgroupElement.append(colElement);
        }
      }

      const colsElements = colgroupElement.children;
      const colsCount = colsElements.length;

      for (let c = 0; c < colsCount; ++c) {
        const colElement = colsElements[c] as HTMLTableColElement;
        const colElementWidth = Metric.fromString(colElement.style.width);
        const colNodeWidth = self.__columnsWidths[c];
        if (!colElementWidth.cmp( colNodeWidth )) {
          colElement.style.cssText = `width: ${colNodeWidth}`;
        }
      }
    }

    return false;
  }

  exportDOM(editor: LexicalEditor) {
    return {
      ...super.exportDOM(editor),
    };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      table: () => ({
        conversion: $convertExtendedTableElement,
        priority: 1,
      }),
    };
  }

  static importJSON(
    serializedNode: SerializedExtendedTableNode,
  ): ExtendedTableNode {
    const tableNode = $createExtendedTableNode();
    tableNode.setColumnsWidths(serializedNode.columnsWidths);

    return tableNode;
  }

  exportJSON(): SerializedExtendedTableNode {
    return {
      ...super.exportJSON(),
      columnsWidths: this.getColumnsWidths(),
      type: "extended-table",
      version: 1,
    };
  }

  extractWithChild(): true {
    return true;
  }
}

export function $createExtendedTableNodeWithDimensions(
  rows: number,
  cols: number,
): ExtendedTableNode {
  const tableNode = $createExtendedTableNode();
  const tableBodyNode = $createTableBodyNodeWithDimensions(rows, cols);

  tableNode.initColGroup(cols);
  tableNode.append(tableBodyNode);

  return tableNode;
}

export function $getExtendedTableNodeFromLexicalNodeOrThrow(node: LexicalNode) {
  return (
    $getTableNodeFromLexicalNodeOrThrow(node) as TableBodyNode
  ).getParentOrThrow<ExtendedTableNode>();
}

export function $convertColElements( tableNode: ExtendedTableNode, domNode: Element ) {
      const colgroupElement = domNode.getElementsByTagName( "colgroup" )[0] as HTMLTableColElement;
      const colElements = colgroupElement.children;

    tableNode.__columnsWidths = [];

    for (const element of colElements) {
      assert( element instanceof HTMLTableColElement, `wrong child for colgroup: ${element.tagName}` );
      const colElement = element as HTMLTableColElement;

      let colMetric = Metric.fromString(colElement.style.width);
      if (!colMetric.isValid()) {
        colMetric = Metric.fromString(colElement.width);
      }
      tableNode.__columnsWidths.push(colMetric);
    }
}

export function $convertExtendedTableElement(
  domNode: Node,
): DOMConversionOutput {
  const tableNode = $createExtendedTableNode();
  if (!(domNode instanceof Element)) throw Error("Expected Element");

  $convertColElements(tableNode.getWritable(), domNode);

  return { node: tableNode };
}

export function $createExtendedTableNode(): ExtendedTableNode {
  const tableNode: ExtendedTableNode = $applyNodeReplacement(
    new ExtendedTableNode(),
  );

  return tableNode;
}

export function $isExtendedTableNode(
  node: LexicalNode | null | undefined,
): node is ExtendedTableNode {
  return node instanceof ExtendedTableNode;
}
