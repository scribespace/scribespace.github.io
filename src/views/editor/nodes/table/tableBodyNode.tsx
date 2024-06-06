import {
  $createTableCellNodeWithParagraph,
  $getTableColumnIndexFromTableCellNode,
  ResolvedCell,
  ResolvedRow,
} from "@editor/plugins/tablePlugin/utils";
import {
  $createTableCellNode,
  $createTableNodeWithDimensions,
  $createTableRowNode,
  $getTableRowIndexFromTableCellNode,
  $isTableRowNode,
  TableCellHeaderStates,
  TableCellNode,
  TableNode,
  TableRowNode,
} from "@lexical/table";
import {
  $applyNodeReplacement,
  $isParagraphNode,
  DOMConversionMap,
  DOMConversionOutput,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
} from "lexical";

export class TableBodyNode extends TableNode {
  constructor(key?: NodeKey) {
    super(key);
  }

  static getType(): string {
    return "table-body";
  }

  static clone(node: TableBodyNode): TableBodyNode {
    return new TableBodyNode(node.__key);
  }

  static addColumnsGroupBefore(
    columnsWidths: number[],
    columnID: number,
    columnsToAdd: number,
  ) {
    const sizeScale =
      columnsWidths.length / (columnsWidths.length + columnsToAdd);

    for (let c = 0; c < columnsWidths.length; ++c) {
      if (columnsWidths[c] > -1) {
        columnsWidths[c] *= sizeScale;
      }
    }

    const newColumns: number[] = [];
    for (let c = 0; c < columnsToAdd; ++c) newColumns[c] = -1;

    columnsWidths.splice(columnID, 0, ...newColumns);
  }

  static addColumnsGroupAfter(
    columnsWidths: number[],
    columnID: number,
    columnsToAdd: number,
  ) {
    const sizeScale =
      columnsWidths.length / (columnsWidths.length + columnsToAdd);

    for (let c = 0; c < columnsWidths.length; ++c) {
      if (columnsWidths[c] > -1) {
        columnsWidths[c] *= sizeScale;
      }
    }

    const newColumns: number[] = [];
    for (let c = 0; c < columnsToAdd; ++c) newColumns[c] = -1;

    columnsWidths.splice(columnID + 1, 0, ...newColumns);
  }

  static removeColumnsGroup(
    columnsWidths: number[],
    columnID: number,
    columnsToRemove: number,
  ) {
    const sizeScale =
      columnsWidths.length / (columnsWidths.length - columnsToRemove);

    columnsWidths.splice(columnID, columnsToRemove);

    for (let c = 0; c < columnsWidths.length; ++c) {
      if (columnsWidths[c] > -1) {
        columnsWidths[c] *= sizeScale;
      }
    }
  }

  getResolvedTable(): ResolvedRow[] {
    const self = this.getLatest();

    const resolvedTable: ResolvedRow[] = [];

    let row = self.getChildren().find((node) => $isTableRowNode(node)) as
      | TableRowNode
      | undefined
      | null;
    if (!row) throw Error("getResolvedTable: there is no row");

    let rowID = 0;
    do {
      if (resolvedTable[rowID] == undefined)
        resolvedTable[rowID] = new ResolvedRow(row);

      const rowCells = row.getChildren() as TableCellNode[];
      let columnID = 0;
      for (const cell of rowCells) {
        while (resolvedTable[rowID].cells[columnID] != undefined) {
          ++columnID;
        }

        const colSpan = cell.getColSpan();
        const rowSpan = cell.getRowSpan();

        const resolvedCell = new ResolvedCell(cell, rowID, columnID);

        let spanRow = row;
        for (let r = 0; r < rowSpan; ++r) {
          if (resolvedTable[rowID + r] == undefined)
            resolvedTable[rowID + r] = new ResolvedRow(spanRow);
          for (let c = 0; c < colSpan; ++c) {
            resolvedTable[rowID + r].cells[columnID + c] = resolvedCell;
          }
          spanRow = spanRow.getNextSibling() as TableRowNode;
        }

        columnID += colSpan;
      }

      ++rowID;
    } while (
      (row = row.getNextSibling() as TableRowNode | null) &&
      $isTableRowNode(row)
    );

    return resolvedTable;
  }

  mergeCells(
    editor: LexicalEditor,
    startCell: TableCellNode,
    rowsCount: number,
    columnsCount: number,
  ) {
    const self = this.getWritable();

    const resolvedTable = self.getResolvedTable();
    let resolvedCell = resolvedTable[0].cells[0];

    for (let r = 0; r < resolvedTable.length; ++r) {
      for (let c = 0; c < resolvedTable[0].cells.length; ++c) {
        if (resolvedTable[r].cells[c].cellNode == startCell) {
          resolvedCell = resolvedTable[r].cells[c];
          break;
        }
      }
      if (resolvedCell.cellNode == startCell) break;
    }

    let defaultRowHeight = 0;
    let r = 0;
    for (; r < rowsCount; ++r) {
      const rowNode = resolvedTable[resolvedCell.rowID + r].rowNode;
      const rowHeight = rowNode.getHeight();
      if (!rowHeight) {
        const rowElement = editor.getElementByKey(rowNode.getKey());
        if (rowElement) {
          const { height } = rowElement.getBoundingClientRect();
          defaultRowHeight = height;
          break;
        }
      }
    }

    for (; r < rowsCount; ++r) {
      const rowNode = resolvedTable[resolvedCell.rowID + r].rowNode;
      const rowHeight = rowNode.getHeight();
      if (!rowHeight) {
        rowNode.setHeight(defaultRowHeight);
      }
    }

    const cellsToRemove = new Set<TableCellNode>();
    for (let r = 0; r < rowsCount; ++r) {
      for (let c = 0; c < columnsCount; ++c) {
        const cell =
          resolvedTable[resolvedCell.rowID + r].cells[resolvedCell.columnID + c]
            .cellNode;
        if (cell != startCell && !cellsToRemove.has(cell)) {
          cellsToRemove.add(cell);
        }
      }
    }

    for (const cell of cellsToRemove) {
      for (const cellChild of cell.getChildren()) {
        if (
          !$isParagraphNode(cellChild) ||
          cellChild.getTextContentSize() > 0
        ) {
          startCell.append(cellChild);
        }
      }
      cell.remove();
    }

    startCell.setColSpan(columnsCount);
    startCell.setRowSpan(rowsCount);
  }

  splitCell(_editor: LexicalEditor, cell: TableCellNode) {
    const self = this.getWritable();

    const resolvedTable = self.getResolvedTable();
    let resolvedCell = resolvedTable[0].cells[0];
    const columnsCount = resolvedTable[0].cells.length;

    for (let r = 0; r < resolvedTable.length; ++r) {
      for (let c = 0; c < columnsCount; ++c) {
        if (resolvedTable[r].cells[c].cellNode == cell) {
          resolvedCell = resolvedTable[r].cells[c];
          break;
        }
      }
      if (resolvedCell.cellNode == cell) break;
    }

    const rowSpan = cell.getRowSpan();
    const colSpan = cell.getColSpan();

    for (let c = 1; c < colSpan; ++c) {
      cell.insertAfter($createTableCellNodeWithParagraph());
    }

    for (let r = 1; r < rowSpan; ++r) {
      const resolvedRow = resolvedTable[resolvedCell.rowID + r];
      let nextCellColumnID = resolvedCell.columnID + colSpan;
      while (nextCellColumnID < columnsCount) {
        const nextResolvedCell = resolvedRow.cells[nextCellColumnID];
        if (nextResolvedCell.rowID == resolvedCell.rowID + r) break;

        nextCellColumnID += nextResolvedCell.cellNode.getColSpan();
      }

      if (nextCellColumnID == columnsCount) {
        for (let c = 0; c < colSpan; ++c) {
          resolvedRow.rowNode.append($createTableCellNodeWithParagraph());
        }
      } else {
        const nextCellNode = resolvedRow.cells[nextCellColumnID].cellNode;
        for (let c = 0; c < colSpan; ++c) {
          nextCellNode.insertBefore($createTableCellNodeWithParagraph());
        }
      }
    }

    cell.setColSpan(1);
    cell.setRowSpan(1);
  }

  removeRows(cellNode: TableCellNode, rowsCount: number) {
    const self = this.getWritable();
    const resolvedTable = self.getResolvedTable();

    const rowID = $getTableRowIndexFromTableCellNode(cellNode);
    if (rowID > 0) {
      for (let c = 0; c < resolvedTable[0].cells.length; ) {
        const cellNode = resolvedTable[rowID].cells[c].cellNode;
        let rowSpan = 0;
        for (let r = rowID - 1; r >= 0; --r) {
          if (resolvedTable[r].cells[c].cellNode != cellNode) break;
          ++rowSpan;
        }
        cellNode.setRowSpan(rowSpan);

        c += cellNode.getColSpan();
      }
    }

    if (rowID + rowsCount < resolvedTable.length) {
      const lastRowID = rowID + rowsCount - 1;
      for (let c = 0; c < resolvedTable[0].cells.length; ) {
        const cellNode = resolvedTable[lastRowID].cells[c].cellNode;
        const colSpan = cellNode.getColSpan();
        let rowSpan = 0;
        for (let r = lastRowID + 1; r < resolvedTable.length; ++r) {
          if (resolvedTable[r].cells[c].cellNode != cellNode) break;
          ++rowSpan;
        }

        if (rowSpan > 0) {
          if (
            rowID > 0 &&
            resolvedTable[rowID - 1].cells[c].cellNode == cellNode
          ) {
            cellNode.setRowSpan(cellNode.getWritable().getRowSpan() + rowSpan);
          } else {
            cellNode.setRowSpan(rowSpan);
            let nextCellID = c + colSpan;
            while (nextCellID < resolvedTable[0].cells.length) {
              if (
                resolvedTable[lastRowID + 1].cells[nextCellID].rowID ==
                lastRowID + 1
              )
                break;
              nextCellID +=
                resolvedTable[lastRowID + 1].cells[
                  nextCellID
                ].cellNode.getColSpan();
            }

            if (nextCellID == resolvedTable[0].cells.length) {
              resolvedTable[lastRowID + 1].rowNode.append(cellNode);
            } else {
              resolvedTable[lastRowID + 1].cells[
                nextCellID
              ].cellNode.insertBefore(cellNode);
            }
          }
        }

        c += colSpan;
      }
    }

    for (let r = 0; r < rowsCount; ++r) {
      resolvedTable[rowID + r].rowNode.remove();
    }
  }

  addRowsBefore(cellNode: TableCellNode, rowsToAdd: number) {
    const self = this.getWritable();
    const resolvedTable = self.getResolvedTable();

    const rowID = $getTableRowIndexFromTableCellNode(cellNode);
    const resolvedRow = resolvedTable[rowID];
    const columnsCount = resolvedRow.cells.length;

    const cellColSpans: number[] = [];
    for (let c = 0; c < columnsCount; ) {
      const resolvedCell = resolvedRow.cells[c];
      const colSpan = resolvedCell.cellNode.getColSpan();

      if (
        0 < rowID &&
        resolvedTable[rowID - 1].cells[c].cellNode == resolvedCell.cellNode
      ) {
        const rowSpan = resolvedCell.cellNode.getRowSpan();
        resolvedCell.cellNode.setRowSpan(rowSpan + rowsToAdd);
      } else {
        cellColSpans.push(colSpan);
      }

      c += colSpan;
    }

    for (let r = 0; r < rowsToAdd; ++r) {
      const newCellsNodes: TableCellNode[] = [];
      for (const colSpan of cellColSpans) {
        const newCellNode = $createTableCellNodeWithParagraph();
        newCellNode.setColSpan(colSpan);
        newCellsNodes.push(newCellNode);
      }

      const newRowNode = $createTableRowNode();
      newRowNode.append(...newCellsNodes);
      resolvedRow.rowNode.insertBefore(newRowNode);
    }
  }

  addRowsAfter(cellNode: TableCellNode, rowsToAdd: number) {
    const self = this.getWritable();
    const resolvedTable = self.getResolvedTable();

    const rowID =
      $getTableRowIndexFromTableCellNode(cellNode) + cellNode.getRowSpan() - 1;
    const resolvedRow = resolvedTable[rowID];
    const columnsCount = resolvedRow.cells.length;
    const rowsCount = resolvedTable.length;

    const cellColSpans: number[] = [];
    for (let c = 0; c < columnsCount; ) {
      const resolvedCell = resolvedRow.cells[c];
      const colSpan = resolvedCell.cellNode.getColSpan();

      if (
        rowID < rowsCount - 1 &&
        resolvedTable[rowID + 1].cells[c].cellNode == resolvedCell.cellNode
      ) {
        const rowSpan = resolvedCell.cellNode.getRowSpan();
        resolvedCell.cellNode.setRowSpan(rowSpan + rowsToAdd);
      } else {
        cellColSpans.push(colSpan);
      }

      c += colSpan;
    }

    for (let r = 0; r < rowsToAdd; ++r) {
      const newCellsNodes: TableCellNode[] = [];
      for (const colSpan of cellColSpans) {
        const newCellNode = $createTableCellNodeWithParagraph();
        newCellNode.setColSpan(colSpan);
        newCellsNodes.push(newCellNode);
      }

      const newRowNode = $createTableRowNode();
      newRowNode.append(...newCellsNodes);
      resolvedRow.rowNode.insertAfter(newRowNode);
    }
  }

  addColumnsBefore(
    cellNode: TableCellNode,
    columnsToAdd: number,
    columnsWidths: number[],
  ) {
    const self = this.getWritable();
    const resolvedTable = self.getResolvedTable();

    const columnID = $getTableColumnIndexFromTableCellNode(
      cellNode,
      resolvedTable,
    );

    for (let r = 0; r < resolvedTable.length; ) {
      const rowSpan = resolvedTable[r].cells[columnID].cellNode.getRowSpan();
      const resolvedRow = resolvedTable[r];

      const resolvedCell = resolvedRow.cells[columnID];
      if (
        columnID > 0 &&
        resolvedCell.cellNode == resolvedRow.cells[columnID - 1].cellNode
      ) {
        const colSpan = resolvedCell.cellNode.getColSpan();
        resolvedCell.cellNode.setColSpan(colSpan + columnsToAdd);
      } else {
        for (let c = 0; c < columnsToAdd; ++c) {
          const newCell = $createTableCellNodeWithParagraph();
          newCell.setRowSpan(rowSpan);
          resolvedCell.cellNode.insertBefore(newCell);
        }
      }
      r += rowSpan;
    }

    TableBodyNode.addColumnsGroupBefore(columnsWidths, columnID, columnsToAdd);
  }

  addColumnsAfter(
    cellNode: TableCellNode,
    columnsCount: number,
    columnsWidths: number[],
  ) {
    const self = this.getWritable();
    const resolvedTable = self.getResolvedTable();

    const columnID =
      $getTableColumnIndexFromTableCellNode(cellNode, resolvedTable) +
      cellNode.getColSpan() -
      1;

    for (let r = 0; r < resolvedTable.length; ) {
      const resolvedRow = resolvedTable[r];
      const rowSpan = resolvedRow.cells[columnID].cellNode.getRowSpan();
      const resolvedCell = resolvedRow.cells[columnID];

      if (
        columnID < resolvedRow.cells.length - 1 &&
        resolvedCell.cellNode == resolvedRow.cells[columnID + 1].cellNode
      ) {
        const colSpan = resolvedCell.cellNode.getColSpan();
        resolvedCell.cellNode.setColSpan(colSpan + columnsCount);
      } else {
        for (let c = 0; c < columnsCount; ++c) {
          const newCell = $createTableCellNodeWithParagraph();
          newCell.setRowSpan(rowSpan);
          resolvedCell.cellNode.insertAfter(newCell);
        }
      }

      r += rowSpan;
    }

    TableBodyNode.addColumnsGroupAfter(columnsWidths, columnID, columnsCount);
  }

  removeColumns(
    cellNode: TableCellNode,
    columnsToRemove: number,
    columnsWidths: number[],
  ) {
    const self = this.getWritable();
    const resolvedTable = self.getResolvedTable();
    const rowsCount = resolvedTable.length;
    const columnsCount = resolvedTable[0].cells.length;
    const columnID = $getTableColumnIndexFromTableCellNode(
      cellNode,
      resolvedTable,
    );
    const lastColumnID = columnID + columnsToRemove - 1;

    if (columnID < lastColumnID) {
      for (let r = 0; r < rowsCount; ) {
        const resolvedCellNode = resolvedTable[r].cells[columnID];
        const rowSpan = resolvedCellNode.cellNode.getRowSpan();
        const colSpan = resolvedCellNode.cellNode.getColSpan();

        if (
          resolvedCellNode.columnID < columnID &&
          resolvedCellNode.columnID + colSpan - 1 <= lastColumnID
        ) {
          resolvedCellNode.cellNode.setColSpan(
            columnID - resolvedCellNode.columnID,
          );
        }

        if (
          resolvedCellNode.columnID == columnID &&
          resolvedCellNode.rowID == r
        ) {
          resolvedCellNode.cellNode.remove();
        }

        r += rowSpan;
      }
    }

    for (let r = 0; r < rowsCount; ) {
      const resolvedRow = resolvedTable[r];
      const resolvedCell = resolvedRow.cells[lastColumnID];
      const rowSpan = resolvedCell.cellNode.getRowSpan();
      const colSpan = resolvedCell.cellNode.getColSpan();

      if (resolvedCell.columnID + colSpan - 1 > lastColumnID) {
        if (resolvedCell.columnID < columnID)
          resolvedCell.cellNode.setColSpan(
            colSpan - (lastColumnID - columnID + 1),
          );
        else {
          let nextColumnID =
            lastColumnID +
            (colSpan - (lastColumnID - resolvedCell.columnID + 1)) +
            1;
          while (nextColumnID < columnsCount) {
            const nextResolvedCell = resolvedRow.cells[nextColumnID];
            if (nextResolvedCell.rowID == r) break;

            nextColumnID += nextResolvedCell.cellNode.getColSpan();
          }

          const newCell = $createTableCellNode(TableCellHeaderStates.NO_STATUS);
          for (const cellChild of resolvedCell.cellNode.getChildren()) {
            if (
              !$isParagraphNode(cellChild) ||
              cellChild.getTextContentSize() > 0
            )
              newCell.append(cellChild);
          }

          newCell.setRowSpan(rowSpan);
          newCell.setColSpan(
            colSpan - (lastColumnID - resolvedCell.columnID + 1),
          );

          if (nextColumnID == columnsCount) {
            resolvedRow.rowNode.append(newCell);
          } else {
            resolvedRow.cells[nextColumnID].cellNode.insertBefore(newCell);
          }
        }
      }

      if (resolvedCell.columnID == lastColumnID && resolvedCell.rowID == r) {
        resolvedCell.cellNode.remove();
      }

      r += rowSpan;
    }

    for (let c = 1; c < columnsToRemove - 1; ++c) {
      for (let r = 0; r < rowsCount; ) {
        const currentColumnID = columnID + c;
        const resolvedCellNode = resolvedTable[r].cells[currentColumnID];
        const rowSpan = resolvedCellNode.cellNode.getRowSpan();
        if (
          resolvedCellNode.columnID == currentColumnID &&
          resolvedCellNode.rowID == r
        ) {
          resolvedCellNode.cellNode.remove();
        }

        r += rowSpan;
      }
    }

    TableBodyNode.removeColumnsGroup(columnsWidths, columnID, columnsToRemove);
  }

  createDOM(): HTMLElement {
    const tableBodyElement = document.createElement("tbody");
    return tableBodyElement;
  }

  updateDOM() {
    return false;
  }

  exportDOM(editor: LexicalEditor) {
    return { ...super.exportDOM(editor), after: undefined };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      tbody: () => ({
        conversion: $convertTableBodyElement,
        priority: 1,
      }),
    };
  }

  static importJSON(): TableBodyNode {
    const tableNode = $createTableBodyNode();
    return tableNode;
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: "table-body",
      version: 1,
    };
  }

  isShadowRoot(): false {
    return false;
  }
}

export function $createTableBodyNodeWithDimensions(
  rows: number,
  cols: number,
): TableBodyNode {
  const tableNode = $createTableNodeWithDimensions(
    rows,
    cols,
    false,
  ) as TableBodyNode;
  return tableNode;
}

export function $convertTableBodyElement(): DOMConversionOutput {
  return { node: $createTableBodyNode() };
}

export function $createTableBodyNode(): TableBodyNode {
  return $applyNodeReplacement(new TableBodyNode());
}

export function $isTableBodyNode(
  node: LexicalNode | null | undefined,
): node is TableBodyNode {
  return node instanceof TableBodyNode;
}
