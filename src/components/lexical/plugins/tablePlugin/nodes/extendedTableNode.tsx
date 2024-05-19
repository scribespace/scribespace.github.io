import { TableRowNode, TableCellNode, $getTableNodeFromLexicalNodeOrThrow } from '@lexical/table'
import { $applyNodeReplacement, DOMConversionMap, DOMConversionOutput, EditorConfig, ElementNode, LexicalEditor, LexicalNode, SerializedElementNode } from 'lexical';
import {addClassNamesToElement} from '@lexical/utils';
import { $createTableColumnsGroupNode, $isTableColumnsGroupNode } from './tableColumnsGroupNode';
import { $createTableBodyNodeWithDimensions, $isTableBodyNode, TableBodyNode } from './tableBodyNode';

export class ResolvedCell {
  columnID: number;
  rowID: number;
  cellNode: TableCellNode;
  constructor(cell: TableCellNode, rowIndex: number, columnIndex: number) {
    this.rowID = rowIndex;
    this.columnID = columnIndex;
    this.cellNode = cell;
  }
}

export class ResolvedRow {
  rowNode: TableRowNode;
  cells: ResolvedCell[] = [];
  constructor(row: TableRowNode) {
    this.rowNode = row;
  }
}

export class ExtendedTableNode extends ElementNode {
  constructor(node?: ExtendedTableNode) {
      super(node?.__key);
  }

  static getType(): string {
    return 'extended-table';
  }

  static clone(node: ExtendedTableNode): ExtendedTableNode {
    return new ExtendedTableNode( node );
  }

  getTableColumnsGroupNode() {
    const columnsGroups = this.getLatest().getChildAtIndex(0)
    if ( !$isTableColumnsGroupNode(columnsGroups) ) throw Error("Expected TableColumnsGroupNode under child 0")
    return columnsGroups;
  }

  getTableColumnsGroupNodeWritable() {
    const columnsGroups = this.getWritable().getChildAtIndex(0)
    if ( !$isTableColumnsGroupNode(columnsGroups) ) throw Error("Expected TableColumnsGroupNode under child 0")
    return columnsGroups;
  }

  getTableBodyNode() {
    const tableBody = this.getLatest().getChildAtIndex(1)
    if ( !$isTableBodyNode(tableBody) ) throw Error("Expected TableBodyNode under child 0")
    return tableBody;
  }
  
  getTableBodyNodeWritable() {
    const tableBody = this.getWritable().getChildAtIndex(1)
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
    this.getTableBodyNodeWritable().removeRows(cellNode, rowsCount)
  }

  addRowsBefore(cellNode: TableCellNode, rowsToAdd: number ) {
    this.getTableBodyNodeWritable().addRowsBefore(cellNode, rowsToAdd)
  }

  addRowsAfter(cellNode: TableCellNode, rowsToAdd: number ) {
    this.getTableBodyNodeWritable().addRowsAfter(cellNode, rowsToAdd)
  }

  addColumnsBefore(cellNode: TableCellNode, columnsToAdd: number ) {
    this.getTableBodyNodeWritable().addColumnsBefore(cellNode, columnsToAdd, this.getTableColumnsGroupNodeWritable())
  }

  addColumnsAfter(cellNode: TableCellNode, columnsToAdd: number ) {
    this.getTableBodyNodeWritable().addColumnsAfter(cellNode, columnsToAdd, this.getTableColumnsGroupNodeWritable())
  }

  createDOM(config: EditorConfig): HTMLElement {
    const tableElement = document.createElement('table');

    addClassNamesToElement(tableElement, config.theme.table);

    return tableElement;
  }

  updateDOM() {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      table: (_node: Node) => ({
        conversion: $convertExtendedTableElement,
        priority: 1,
      }),
    };
  }

  static importJSON(_serializedNode: SerializedElementNode): ExtendedTableNode {
    const tableNode = $createExtendedTableNode()
    return tableNode
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: 'extended-table',
      version: 1,
    };
  }

}

export function $createExtendedTableNodeWithDimensions( rows: number, cols: number ): ExtendedTableNode {
  const tableNode = $createExtendedTableNode();
  const tableBodyNode = $createTableBodyNodeWithDimensions(rows, cols)
  const tableColumnsGroupNode = $createTableColumnsGroupNode();

  tableColumnsGroupNode.initColGroup(cols)
  tableNode.append(tableColumnsGroupNode);
  tableNode.append(tableBodyNode);

  return tableNode
}

export function $getExtendedTableNodeFromLexicalNodeOrThrow(node: LexicalNode) {
  return ($getTableNodeFromLexicalNodeOrThrow(node) as TableBodyNode).getParentOrThrow<ExtendedTableNode>()
}

export function $convertExtendedTableElement(_domNode: Node): DOMConversionOutput {
  return {node: $createExtendedTableNode()} 
}

export function $createExtendedTableNode(): ExtendedTableNode {
	return $applyNodeReplacement(new ExtendedTableNode());

}

export function $isExtendedTableNode(node: LexicalNode | null | undefined): node is ExtendedTableNode {
	return node instanceof ExtendedTableNode;
}