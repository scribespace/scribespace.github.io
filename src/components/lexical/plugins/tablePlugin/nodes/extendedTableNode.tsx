import { TableNode, TableRowNode, TableCellNode, $createTableNodeWithDimensions, $isTableRowNode } from '@lexical/table'
import { $applyNodeReplacement, $isParagraphNode, DOMConversionMap, DOMConversionOutput, EditorConfig, LexicalEditor, LexicalNode, SerializedElementNode, Spread } from 'lexical';
import {addClassNamesToElement} from '@lexical/utils';

export type SerializedExtendedTableNode = Spread<
  {
    columnsWidths: number[];
  },
  SerializedElementNode
>;


export class ExtendedTableNode extends TableNode {
    __columnsWidths: number[];

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

  updateColGroup() {
    const self = this.getWritable()

    const columnsWidths: number[] = []

    const rowsNodes = self.getChildren() as TableRowNode[]
    const cellsNodes = rowsNodes[0].getChildren() as TableCellNode[]
    for ( const cell of cellsNodes ) {
        for ( let c = 0; c < cell.getColSpan(); ++c ) {
            columnsWidths.push(-1)
        }
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

  getRealColumnID( rowID: number, cellID: number ): number {
    const self = this.getLatest()
    const rowsNodes = self.getChildren() as TableRowNode[]
    if ( rowID < 0 || rowID >= rowsNodes.length ) {
        throw Error(`ExtendedTableNode -> getRealColumnID: wrong row ID: ${rowID}, rows count: ${rowsNodes.length}`)
    }

    const rowNode = rowsNodes[rowID];
    const cellsNodes = rowNode.getChildren() as TableCellNode[]
    if ( cellID < 0 || cellID >= cellsNodes.length ) {
        throw Error(`ExtendedTableNode -> getRealColumnID: wrong cell ID: ${cellID}, cells count: ${cellsNodes.length}`)
    }

    let columnCount = 0;
    let columnID = 0;
    for ( let c = 0; c < (cellID + 1); ++c ) {
        const cellNode = cellsNodes[c]
        const span = cellNode.getColSpan();
        columnID = columnCount + span - 1;
        columnCount += span
    }

    return columnID;
  }

  getColumnWidth(columnID: number ): number {
    const self = this.getLatest()
    if ( columnID < 0 || columnID >= self.__columnsWidths.length ) {
        throw Error(`ExtendedTableNode -> getColumnWidth: wrong column ID: ${columnID}. Or columns not updated: ${self.__columnsWidths.length}`)
    }
    
    return self.__columnsWidths[columnID];
  }

  getResolvedTable(): TableCellNode[][] {
    const self = this.getLatest()

    const resolvedTable: TableCellNode[][] = [];

    let row = self.getChildren().find((node) => $isTableRowNode(node)) as TableRowNode | undefined | null
    if ( !row ) throw Error("getResolvedTable: there is no row")

    let rowID = 0;
    do {
      if ( resolvedTable[rowID] == undefined ) resolvedTable[rowID] = [];

      const rowCells = row.getChildren() as TableCellNode[];
      let columnID = 0;
      for ( const cell of rowCells ) {
        while ( resolvedTable[rowID][columnID] != undefined ) {
          ++columnID;
        }

        const colSpan = cell.getColSpan();
        const rowSpan = cell.getRowSpan();

        for ( let r = 0; r < rowSpan; ++r ) {
          if ( resolvedTable[rowID + r] == undefined ) resolvedTable[rowID + r] = []
          for ( let c = 0; c < colSpan; ++c ) {
            resolvedTable[rowID + r][columnID + c] = cell;
          }
        }

        columnID += colSpan;
      }
      
      ++rowID;
    } while ( (row = row.getNextSibling() as TableRowNode | null) && $isTableRowNode(row) )

    return resolvedTable;
  }

  mergeCells( editor: LexicalEditor, startCell: TableCellNode, rowsCount: number, columnsCount: number ) {
    const self = this.getWritable()

    const resolvedTable = self.getResolvedTable();
    let columnID = -1;
    let rowID = -1;
    for ( let r = 0; r < resolvedTable.length; ++r ) {
      for ( let c = 0; c < resolvedTable[0].length; ++c ) {
        if ( resolvedTable[r][c] == startCell ) {
          columnID = c;
          rowID = r;
          break;
        }
      }
      if ( columnID != -1 ) break;
    }

    if (columnsCount == resolvedTable[0].length ) {
      let mergedRowHeight = 0;
      const mergedRowHeightProcessed = new Set<TableCellNode>()
      for ( let r= 0; r < rowsCount; ++r ) {
        const cell = resolvedTable[r][0];
        if ( !mergedRowHeightProcessed.has(cell) ) {
          mergedRowHeightProcessed.add(cell);
          const rowElement = editor.getElementByKey(cell.getKey())
          if ( rowElement ) {
            const {height} = rowElement?.getBoundingClientRect();
            mergedRowHeight += height
          }
        }
      }
      (startCell.getParentOrThrow() as TableRowNode).setHeight(mergedRowHeight);
    }

    const cellsToRemove = new Set<TableCellNode>()
    for ( let r = 0; r < rowsCount; ++r ) {
      let cellsToRemoveCount = 0;
      for ( let c = 0; c < columnsCount; ++c ) {
        const cell = resolvedTable[rowID + r][columnID + c];
        if ( cell != startCell && !cellsToRemove.has(cell) ) {
          cellsToRemove.add(cell)
          ++cellsToRemoveCount;
        }
      }
    }

    for ( const cell of cellsToRemove ) {
      for ( const cellChild of cell.getChildren() ) {
        if ( !$isParagraphNode(cellChild) || cellChild.getTextContentSize() > 0 )
          startCell.append(cellChild)
      }
      cell.remove();
    }

    startCell.setColSpan(columnsCount);
    startCell.setRowSpan(rowsCount);

  }

  createDOM(config: EditorConfig): HTMLElement {
    const self = this.getLatest()
    const tableElement = document.createElement('table');

    const colgroup = document.createElement('colgroup')
    for ( const columnWidth of self.__columnsWidths ) {
        const colElement = document.createElement('col')
        if ( columnWidth != -1 )
            colElement.style.cssText = `width: ${columnWidth}px`;
        colgroup.append(colElement);
    }

    tableElement.appendChild(colgroup)

    addClassNamesToElement(tableElement, config.theme.table);

    return tableElement;
  }
  
  updateDOM(
    _prevNode?: unknown,
    dom?: HTMLElement,
    _config?: EditorConfig,
  ): boolean {
    const self = this.getLatest()
    if ( dom ) {
      const colgroup = dom.firstElementChild;
      if ( colgroup ) {
        const colsElements = colgroup.getElementsByTagName('col')

        if (colsElements.length != self.__columnsWidths.length) {
          throw new Error('ExtendedTableNode -> updateDOM: Mismatch between colsElements count and columns widths. Did you run tableNode.updateColGroup()?');
        }

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
    }

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

}

export function $createExtendedTableNodeWithDimensions( rows: number, cols: number ): ExtendedTableNode {
  const tableNode = $createTableNodeWithDimensions(rows, cols, false) as ExtendedTableNode;
  tableNode.updateColGroup()

  return tableNode
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