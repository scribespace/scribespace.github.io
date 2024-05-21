import { TableCellNode, $getTableNodeFromLexicalNodeOrThrow } from '@lexical/table'
import { $applyNodeReplacement, DOMConversionMap, DOMConversionOutput, EditorConfig, ElementNode, LexicalEditor, LexicalNode, SerializedElementNode, Spread } from 'lexical';
import {addClassNamesToElement} from '@lexical/utils';
import { $createTableBodyNodeWithDimensions, $isTableBodyNode, TableBodyNode } from './tableBodyNode';

export type SerializedExtendedTableNode = Spread<
  {
    columnsWidths: number[];
  },
  SerializedElementNode
>;

export class ExtendedTableNode extends ElementNode {
    __columnsWidths: number[] = [];

    constructor(node?: ExtendedTableNode) {
      super(node?.__key);
      this.__columnsWidths = node ? structuredClone(node.__columnsWidths) : [];
  }

  static getType(): string {
    return 'extended-table';
  }

  static clone(node: ExtendedTableNode): ExtendedTableNode {
    return new ExtendedTableNode( node );
  }

  getColumnsWidths() {
    return this.getLatest().__columnsWidths
  }
  setColumnsWidths(columns: number[]) {
    this.getWritable().__columnsWidths = columns;
  }

  initColGroup(columnsCount: number) {
    const self = this.getWritable()

    const columnsWidths: number[] = []

    for ( let c = 0; c < columnsCount; ++c ) {
        columnsWidths.push(-1)
    }

    self.__columnsWidths = columnsWidths;
  }

  setColumnWidth(columnID: number, width: number) {
    const self = this.getWritable()
    if ( columnID < 0 || columnID >= self.__columnsWidths.length ) {
        throw Error(`ExtendedTableNode -> setColumnWidth: wrong column ID: ${columnID}. ColCount: ${self.__columnsWidths.length}`)
    }

    self.__columnsWidths[columnID] = width;
  }

  getColumnWidth(columnID: number ): number {
    const self = this.getLatest()
    if ( columnID < 0 || columnID >= self.__columnsWidths.length ) {
        throw Error(`ExtendedTableNode -> getColumnWidth: wrong column ID: ${columnID}. Or columns not updated: ${self.__columnsWidths.length}`)
    }
    
    return self.__columnsWidths[columnID];
  }

  getTableBodyNode() {
    const tableBody = this.getLatest().getChildAtIndex(0)
    if ( !$isTableBodyNode(tableBody) ) throw Error("Expected TableBodyNode under child 0")
    return tableBody;
  }
  
  getTableBodyNodeWritable() {
    const tableBody = this.getWritable().getChildAtIndex(0)
    if ( !$isTableBodyNode(tableBody) ) throw Error("Expected TableBodyNode under child 0")
    return tableBody;
  }

  mergeCells( editor: LexicalEditor, startCell: TableCellNode, rowsCount: number, columnsCount: number ) {
    this.getTableBodyNodeWritable().mergeCells(editor, startCell, rowsCount, columnsCount);
  }

  splitCell( editor: LexicalEditor, cell: TableCellNode ) {
    this.getTableBodyNodeWritable().splitCell( editor, cell);
  }
  
  removeRows(cellNode: TableCellNode, rowsCount: number ) {
    if ( rowsCount == this.getTableBodyNode().getChildrenSize() ) {
      this.remove();
      return;
    }

    this.getTableBodyNodeWritable().removeRows(cellNode, rowsCount)
  }

  addRowsBefore(cellNode: TableCellNode, rowsToAdd: number ) {
    this.getTableBodyNodeWritable().addRowsBefore(cellNode, rowsToAdd)
  }

  addRowsAfter(cellNode: TableCellNode, rowsToAdd: number ) {
    this.getTableBodyNodeWritable().addRowsAfter(cellNode, rowsToAdd)
  }

  addColumnsBefore(cellNode: TableCellNode, columnsToAdd: number ) {
    this.getTableBodyNodeWritable().addColumnsBefore(cellNode, columnsToAdd, this.getWritable().__columnsWidths)
  }

  addColumnsAfter(cellNode: TableCellNode, columnsToAdd: number ) {
    this.getTableBodyNodeWritable().addColumnsAfter(cellNode, columnsToAdd, this.getWritable().__columnsWidths)
  }

  removeColumns(cellNode: TableCellNode, columnsCount: number ) {
    if ( columnsCount == this.getWritable().getColumnsWidths().length ) {
      this.remove();
      return;
    }
    this.getTableBodyNodeWritable().removeColumns(cellNode, columnsCount, this.getWritable().__columnsWidths)
  }

  createDOM(config: EditorConfig): HTMLElement {
    const self = this.getLatest()

    const tableElement = document.createElement('table');
    addClassNamesToElement(tableElement, config.theme.table);

    const colgroup = document.createElement('colgroup')
    for ( const columnWidth of self.__columnsWidths ) {
        const colElement = document.createElement('col')
        if ( columnWidth != -1 )
            colElement.style.cssText = `width: ${columnWidth}px`;
        colgroup.append(colElement);
    }

    tableElement.append(colgroup)

    return tableElement;
  }

  updateDOM(
    _prevNode?: unknown,
    dom?: HTMLElement,
    _config?: EditorConfig,
  ) {
    const self = this.getLatest()
    if ( dom ) {
      if ( !(dom instanceof HTMLTableElement) ) throw Error("expected HTMLTableColElement")
        
        const colgroupElement = dom.getElementsByTagName('colgroup')[0] as HTMLTableColElement;
    if ( !(colgroupElement instanceof HTMLTableColElement) ) throw Error("expected HTMLTableColElement")

      if (colgroupElement.childElementCount != self.__columnsWidths.length) {
        const children = colgroupElement.children
        while ( colgroupElement.childElementCount > 0 ) {
          const child = children.item(0) as Element;
          colgroupElement.removeChild(child);
        }

        for ( let c = 0; c < self.__columnsWidths.length; ++c ) {
          const colElement = document.createElement('col')
          colgroupElement.append(colElement);
        }
      }
      
      const colsElements = colgroupElement.getElementsByTagName('col')
      const colsCount = colsElements.length;
      for ( let c = 0; c < colsCount; ++c ) {
        const colElement = colsElements[c] as HTMLTableColElement;
        const colElementWidthMatch = colElement.style.width.match(/\d+/);
        const colElementWidth = colElementWidthMatch ? Number(colElementWidthMatch[0]) : -1;

        const colNodeWidth = self.__columnsWidths[c];

        if ( colElementWidth != colNodeWidth ) {
          colElement.style.cssText = `width: ${colNodeWidth}px`;
        }
      }
    }

    return false;
  }

  exportDOM(editor: LexicalEditor) {
    return {
      ...super.exportDOM(editor)
    }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      table: (_node: Node) => ({
        conversion: $convertExtendedTableElement,
        priority: 1,
      }),
    };
  }

  static importJSON(serializedNode: SerializedExtendedTableNode): ExtendedTableNode {
    const tableNode = $createExtendedTableNode()
    tableNode.setColumnsWidths(serializedNode.columnsWidths)

    return tableNode
  }

  exportJSON(): SerializedExtendedTableNode {
    return {
      ...super.exportJSON(),
      columnsWidths: this.getColumnsWidths(),
      type: 'extended-table',
      version: 1,
    };
  }

  extractWithChild(): true {
    return true;
  }
}

export function $createExtendedTableNodeWithDimensions( rows: number, cols: number ): ExtendedTableNode {
  const tableNode = $createExtendedTableNode();
  const tableBodyNode = $createTableBodyNodeWithDimensions(rows, cols)

  tableNode.initColGroup(cols)
  tableNode.append(tableBodyNode);

  return tableNode
}

export function $getExtendedTableNodeFromLexicalNodeOrThrow(node: LexicalNode) {
  return ($getTableNodeFromLexicalNodeOrThrow(node) as TableBodyNode).getParentOrThrow<ExtendedTableNode>()
}

export function $convertExtendedTableElement(domNode: Node): DOMConversionOutput {
  const tableNode = $createExtendedTableNode()
  if ( !(domNode instanceof Element) ) throw Error("Expected Element");

  const colElements = domNode.getElementsByTagName('col');

  tableNode.__columnsWidths = [];

  for ( const colElement of colElements ) {
    const colElementWidthMatch = colElement.style.width.match(/\d+/);
    const colElementWidth = colElementWidthMatch ? Number(colElementWidthMatch[0]) : -1;
    tableNode.__columnsWidths.push(colElementWidth);
  }

  return {node: tableNode} 
}

export function $createExtendedTableNode(): ExtendedTableNode {
	return $applyNodeReplacement(new ExtendedTableNode());

}

export function $isExtendedTableNode(node: LexicalNode | null | undefined): node is ExtendedTableNode {
	return node instanceof ExtendedTableNode;
}