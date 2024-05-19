import { TableNode, TableRowNode, TableCellNode, $createTableNodeWithDimensions, $isTableRowNode, $getTableRowIndexFromTableCellNode, $createTableRowNode, $getTableRowNodeFromTableCellNodeOrThrow } from '@lexical/table'
import { $applyNodeReplacement, $isParagraphNode, DOMConversionMap, DOMConversionOutput, EditorConfig, LexicalEditor, LexicalNode, SerializedElementNode, Spread } from 'lexical';
import {addClassNamesToElement} from '@lexical/utils';
import { edit } from 'react-arborist/dist/module/state/edit-slice';
import { $createTableCellNodeWithParagraph, $getTableColumnIndexFromTableCellNode } from '../tableHelpers';

export type SerializedExtendedTableNode = Spread<
  {
    columnsWidths: number[];
  },
  SerializedElementNode
>;

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

  initColGroup() {
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

  getResolvedTable(): ResolvedRow[] {
    const self = this.getLatest()

    const resolvedTable: ResolvedRow[] = [];

    let row = self.getChildren().find((node) => $isTableRowNode(node)) as TableRowNode | undefined | null
    if ( !row ) throw Error("getResolvedTable: there is no row")

    let rowID = 0;
    do {
      if ( resolvedTable[rowID] == undefined ) resolvedTable[rowID] = new ResolvedRow(row);

      const rowCells = row.getChildren() as TableCellNode[];
      let columnID = 0;
      for ( const cell of rowCells ) {
        while ( resolvedTable[rowID].cells[columnID] != undefined ) {
          ++columnID;
        }

        const colSpan = cell.getColSpan();
        const rowSpan = cell.getRowSpan();

        const resolvedCell = new ResolvedCell(cell, rowID, columnID);

        let spanRow = row;
        for ( let r = 0; r < rowSpan; ++r ) {
          if ( resolvedTable[rowID + r] == undefined ) resolvedTable[rowID + r] = new ResolvedRow(spanRow)
          for ( let c = 0; c < colSpan; ++c ) {
            resolvedTable[rowID + r].cells[columnID + c] = resolvedCell;
          }
          spanRow = spanRow.getNextSibling() as TableRowNode;
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
    let resolvedCell = resolvedTable[0].cells[0];

    for ( let r = 0; r < resolvedTable.length; ++r ) {
      for ( let c = 0; c < resolvedTable[0].cells.length; ++c ) {
        if ( resolvedTable[r].cells[c].cellNode == startCell ) {
          resolvedCell = resolvedTable[r].cells[c]
          break;
        }
      }
      if ( resolvedCell.cellNode == startCell ) break;
    }

    let defaultRowHeight = 0;
    let r = 0;
    for ( ; r < rowsCount; ++r ) {
      const rowNode = resolvedTable[resolvedCell.rowID + r].rowNode;
      const rowHeight = rowNode.getHeight()
      if ( !rowHeight ) {
        const rowElement = editor.getElementByKey(rowNode.getKey());
        if ( rowElement ) {
          const { height } = rowElement?.getBoundingClientRect();
          defaultRowHeight = height;
          break;
        }
      }
    }

    for ( ; r < rowsCount; ++r ) {
      const rowNode = resolvedTable[resolvedCell.rowID + r].rowNode;
      const rowHeight = rowNode.getHeight()
      if ( !rowHeight ) {
        rowNode.setHeight(defaultRowHeight);
      }
    }

    const cellsToRemove = new Set<TableCellNode>()
    for ( let r = 0; r < rowsCount; ++r ) {
      let cellsToRemoveCount = 0;
      for ( let c = 0; c < columnsCount; ++c ) {
        const cell = resolvedTable[resolvedCell.rowID + r].cells[resolvedCell.columnID + c].cellNode;
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

  splitCell( editor: LexicalEditor, cell: TableCellNode ) {
    const self = this.getWritable()

    const resolvedTable = self.getResolvedTable();
    let resolvedCell = resolvedTable[0].cells[0];
    const columnsCount = resolvedTable[0].cells.length

    for ( let r = 0; r < resolvedTable.length; ++r ) {
      for ( let c = 0; c < columnsCount; ++c ) {
        if ( resolvedTable[r].cells[c].cellNode == cell ) {
          resolvedCell = resolvedTable[r].cells[c]
          break;
        }
      }
      if ( resolvedCell.cellNode == cell ) break;
    }

    const rowSpan = cell.getRowSpan()
    const colSpan = cell.getColSpan()

    for ( let c = 1; c < colSpan; ++c ) {
      cell.insertAfter($createTableCellNodeWithParagraph())
    }

    for ( let r = 1; r < rowSpan; ++r ) {
      const resolvedRow = resolvedTable[resolvedCell.rowID + r];
      let nextCellColumnID = resolvedCell.columnID + colSpan;
      while ( nextCellColumnID < columnsCount ) {
        const nextResolvedCell = resolvedRow.cells[nextCellColumnID];
        if ( nextResolvedCell.rowID == resolvedCell.rowID + r )
          break;

        nextCellColumnID += nextResolvedCell.cellNode.getColSpan();
      }

      if ( nextCellColumnID == columnsCount ) {
        for ( let c = 0; c < colSpan; ++c ) {
          resolvedRow.rowNode.append($createTableCellNodeWithParagraph())
        }
      } else {
        const nextCellNode = resolvedRow.cells[nextCellColumnID].cellNode;
        for ( let c = 0; c < colSpan; ++c ) {
          nextCellNode.insertBefore($createTableCellNodeWithParagraph())
        }
      }
    } 

    cell.setColSpan(1)
    cell.setRowSpan(1)
  }
  
  removeRows(cellNode: TableCellNode, rowsCount: number ) {
    const self = this.getWritable()
    const resolvedTable = self.getResolvedTable();

    const rowID = $getTableRowIndexFromTableCellNode(cellNode);

    if ( rowsCount == resolvedTable.length ) {
      self.remove()
      return;
    }

    if ( rowID > 0 ) {
      for ( let c = 0; c < resolvedTable[0].cells.length; ) {
        const cellNode = resolvedTable[rowID].cells[c].cellNode;
        let rowSpan = 0;
        for ( let r = rowID - 1; r >= 0; --r ) {
          if ( resolvedTable[r].cells[c].cellNode != cellNode ) break;
          ++rowSpan;
        }
        cellNode.setRowSpan(rowSpan);

        c += cellNode.getColSpan();
      }
    }

    if ( (rowID + rowsCount) < resolvedTable.length ) {
      const lastRowID = rowID + rowsCount - 1;
      for ( let c = 0; c < resolvedTable[0].cells.length; ) {
        const cellNode = resolvedTable[lastRowID].cells[c].cellNode;
        const colSpan = cellNode.getColSpan();
        let rowSpan = 0;
        for ( let r = lastRowID + 1; r < resolvedTable.length; ++r ) {
          if ( resolvedTable[r].cells[c].cellNode != cellNode ) break;
          ++rowSpan;
        }

        if ( rowSpan > 0 ) {
          if ( rowID > 0 && resolvedTable[rowID - 1].cells[c].cellNode == cellNode ) {
            cellNode.setRowSpan(cellNode.getWritable().getRowSpan() + rowSpan);
          } else {
            cellNode.setRowSpan(rowSpan);
            const nextCellID = c + colSpan;
            if ( nextCellID == resolvedTable[0].cells.length ) {
              resolvedTable[lastRowID+1].rowNode.append(cellNode);
            } else {
              resolvedTable[lastRowID+1].cells[nextCellID].cellNode.insertBefore(cellNode);
            }
          }
        }

        c += colSpan;
      }
    }

    for ( let r = 0; r < rowsCount; ++r ) {
      resolvedTable[rowID + r].rowNode.remove()
    }
  }

  addRowsBefore(cellNode: TableCellNode, rowsToAdd: number ) {
    const self = this.getWritable()
    const resolvedTable = self.getResolvedTable();

    const rowID = $getTableRowIndexFromTableCellNode(cellNode);
    const resolvedRow = resolvedTable[rowID];
    const columnsCount = resolvedRow.cells.length;

    const cellColSpans: number[] = [];
    for ( let c = 0; c < columnsCount; ) {
      const resolvedCell = resolvedRow.cells[c];
      const colSpan = resolvedCell.cellNode.getColSpan();

      if ( 0 < rowID && resolvedTable[rowID-1].cells[c].cellNode == resolvedCell.cellNode ) {
        const rowSpan = resolvedCell.cellNode.getRowSpan();
        resolvedCell.cellNode.setRowSpan(rowSpan + rowsToAdd);
      } else {
        cellColSpans.push(colSpan);
      }

      c += colSpan;
    }

    for ( let r = 0; r < rowsToAdd; ++r ) {
      const newCellsNodes: TableCellNode[] = [];
      for ( const colSpan of cellColSpans ) {
        const newCellNode = $createTableCellNodeWithParagraph();
        newCellNode.setColSpan(colSpan);
        newCellsNodes.push(newCellNode);
      }

      const newRowNode = $createTableRowNode();
      newRowNode.append(...newCellsNodes);
      resolvedRow.rowNode.insertBefore(newRowNode);
    }
  }

  addRowsAfter(cellNode: TableCellNode, rowsToAdd: number ) {
    const self = this.getWritable()
    const resolvedTable = self.getResolvedTable();

    const rowID = $getTableRowIndexFromTableCellNode(cellNode) + cellNode.getRowSpan() - 1;
    const resolvedRow = resolvedTable[rowID];
    const columnsCount = resolvedRow.cells.length;
    const rowsCount = resolvedTable.length;

    const cellColSpans: number[] = [];
    for ( let c = 0; c < columnsCount; ) {
      const resolvedCell = resolvedRow.cells[c];
      const colSpan = resolvedCell.cellNode.getColSpan();

      if ( rowID < rowsCount - 1 && resolvedTable[rowID+1].cells[c].cellNode == resolvedCell.cellNode ) {
        const rowSpan = resolvedCell.cellNode.getRowSpan();
        resolvedCell.cellNode.setRowSpan(rowSpan + rowsToAdd);
      } else {
        cellColSpans.push(colSpan);
      }

      c += colSpan;
    }

    for ( let r = 0; r < rowsToAdd; ++r ) {
      const newCellsNodes: TableCellNode[] = [];
      for ( const colSpan of cellColSpans ) {
        const newCellNode = $createTableCellNodeWithParagraph();
        newCellNode.setColSpan(colSpan);
        newCellsNodes.push(newCellNode);
      }

      const newRowNode = $createTableRowNode();
      newRowNode.append(...newCellsNodes);
      resolvedRow.rowNode.insertAfter(newRowNode);
    }
  }

  addColumnsBefore(cellNode: TableCellNode, columnsToAdd: number ) {
    const self = this.getWritable()
    const resolvedTable = self.getResolvedTable();

    const columnID = $getTableColumnIndexFromTableCellNode(cellNode, resolvedTable);
    
    for ( let r = 0; r < resolvedTable.length; ) {
      const rowSpan = resolvedTable[r].cells[columnID].cellNode.getRowSpan();
      const resolvedRow = resolvedTable[r];

      const resolvedCell = resolvedRow.cells[columnID];
      if ( columnID > 0 && resolvedCell.cellNode == resolvedRow.cells[columnID - 1].cellNode ) {
        const colSpan = resolvedCell.cellNode.getColSpan();
        resolvedCell.cellNode.setColSpan(colSpan + columnsToAdd);
      } else {
        for ( let c = 0; c < columnsToAdd; ++c ) {
          const newCell = $createTableCellNodeWithParagraph();
          newCell.setRowSpan(rowSpan);
          resolvedCell.cellNode.insertBefore(newCell);
        }
      }
      r += rowSpan;
    }

    const columnsWidths = self.getWritable().__columnsWidths;
    const sizeScale = columnsWidths.length / (columnsWidths.length + columnsToAdd);

    for ( let c = 0; c < columnsWidths.length; ++c ) {
      if ( columnsWidths[c] > -1 ) {
        columnsWidths[c] *= sizeScale
      }
    }

    const newColumns: number[] = []
    for ( let c = 0; c < columnsToAdd; ++c ) 
      newColumns[c] = -1;

    columnsWidths.splice(columnID, 0, ...newColumns);
  }

  addColumnsAfter(cellNode: TableCellNode, columnsCount: number ) {
    const self = this.getWritable()
    const resolvedTable = self.getResolvedTable();

    const columnID = $getTableColumnIndexFromTableCellNode(cellNode, resolvedTable) + cellNode.getColSpan() - 1;
   
    for ( let r = 0; r < resolvedTable.length; ) {
      const resolvedRow = resolvedTable[r];
      const rowSpan = resolvedRow.cells[columnID].cellNode.getRowSpan();
      const resolvedCell = resolvedRow.cells[columnID];

      if ( columnID < resolvedRow.cells.length - 1 && resolvedCell.cellNode == resolvedRow.cells[columnID + 1].cellNode ) {
        const colSpan = resolvedCell.cellNode.getColSpan();
        resolvedCell.cellNode.setColSpan(colSpan + columnsCount);
      } else {
        for ( let c = 0; c < columnsCount; ++c ) {
          const newCell = $createTableCellNodeWithParagraph();
          newCell.setRowSpan(rowSpan);
          resolvedCell.cellNode.insertAfter(newCell);
        }
      }

      r += rowSpan;
    }

    const columnsWidths = self.getWritable().__columnsWidths;
    const sizeScale = columnsWidths.length / (columnsWidths.length + columnsCount);

    for ( let c = 0; c < columnsWidths.length; ++c ) {
      if ( columnsWidths[c] > -1 ) {
        columnsWidths[c] *= sizeScale
      }
    }

    const newColumns: number[] = []
    for ( let c = 0; c < columnsCount; ++c ) 
      newColumns[c] = -1;

    columnsWidths.splice(columnID + 1, 0, ...newColumns);
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
        
        if (colgroup.childElementCount != self.__columnsWidths.length) {
          const children = colgroup.children
          while ( colgroup.childElementCount > 0 ) {
            const child = children.item(0) as Element;
            colgroup.removeChild(child);
          }

          for ( let c = 0; c < self.__columnsWidths.length; ++c ) {
            const colElement = document.createElement('col')
            colgroup.append(colElement);
          }
        }
        
        const colsElements = colgroup.getElementsByTagName('col')
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
  tableNode.initColGroup()

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