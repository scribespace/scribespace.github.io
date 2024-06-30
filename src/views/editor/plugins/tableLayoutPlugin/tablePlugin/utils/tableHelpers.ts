import {
  $createTableCellNode,
  $getTableRowIndexFromTableCellNode,
  TableCellHeaderStates,
  TableCellNode,
  TableRowNode,
} from "@lexical/table";
import { $createParagraphNode } from "lexical";

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

export function $createTableCellNodeWithParagraph(): TableCellNode {
  const tableCellNode = $createTableCellNode(TableCellHeaderStates.NO_STATUS);
  const paragraphNode = $createParagraphNode();

  tableCellNode.append(paragraphNode);
  return tableCellNode;
}

export function $getTableColumnIndexFromTableCellNode(
  tableCellNode: TableCellNode,
  resolvedTable: ResolvedRow[],
): number {
  const tableRowID = $getTableRowIndexFromTableCellNode(tableCellNode);
  for (let c = 0; c < resolvedTable[0].cells.length; ) {
    const node = resolvedTable[tableRowID].cells[c].cellNode;
    if (node == tableCellNode) return c;
    c += (node as TableCellNode).getColSpan();
  }
  throw Error("Couldn't find TableCellNode in TableRowNode");
}
