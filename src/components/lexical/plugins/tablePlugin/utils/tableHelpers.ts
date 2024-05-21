import { $computeTableMap, $createTableCellNode, $getTableRowIndexFromTableCellNode, $isTableCellNode, $isTableNode, TableCellHeaderStates, TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { $findMatchingParent } from "@lexical/utils";
import { $createParagraphNode, $isParagraphNode, ElementNode, LexicalEditor, LexicalNode, RangeSelection } from "lexical";

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

    tableCellNode.append(paragraphNode)
    return tableCellNode
}

export function $getTableColumnIndexFromTableCellNode(
    tableCellNode: TableCellNode,
    resolvedTable: ResolvedRow[],
  ): number {
    const tableRowID = $getTableRowIndexFromTableCellNode(tableCellNode);
    for ( let c = 0; c < resolvedTable[0].cells.length; ) {
        const node = resolvedTable[tableRowID].cells[c].cellNode
        if ( node == tableCellNode ) return c;
        c += (node as TableCellNode).getColSpan();
    }
    throw Error("Couldn't find TableCellNode in TableRowNode");
  }
export function $getTableEdgeCursorPosition(
  editor: LexicalEditor,
  selection: RangeSelection,
  tableNode: TableNode
) {
  const domSelection = window.getSelection();
  if (!domSelection || (domSelection.anchorNode !== editor.getRootElement() && domSelection.anchorNode?.nodeName !== "TD")) {
    return undefined;
  }

  const anchorCellNode = $findMatchingParent(selection.anchor.getNode(), (n) => $isTableCellNode(n)
  ) as TableCellNode | null;
  if (!anchorCellNode) {
    return undefined;
  }

  const parentTable = $findMatchingParent(anchorCellNode, (n) => $isTableNode(n)
  );
  if (!$isTableNode(parentTable) || !parentTable.is(tableNode)) {
    return undefined;
  }

  const [tableMap, cellValue] = $computeTableMap(
    tableNode,
    anchorCellNode,
    anchorCellNode
  );
  const firstCell = tableMap[0][0];
  const lastCell = tableMap[tableMap.length - 1][tableMap[0].length - 1];
  const { startRow, startColumn } = cellValue;

  const isAtFirstCell = startRow === firstCell.startRow && startColumn === firstCell.startColumn;
  const isAtLastCell = startRow === lastCell.startRow && startColumn === lastCell.startColumn;

  if (isAtFirstCell) {
    return 'first';
  } else if (isAtLastCell) {
    return 'last';
  } else {
    return undefined;
  }
}

export function $insertParagraphAtTableEdge(
  edgePosition: 'first' | 'last',
  tableBodyNode: TableNode,
  children?: LexicalNode[]
) {
  const tableNode = tableBodyNode.getParentOrThrow<ElementNode>();
  if (edgePosition === 'first') {
    const prevSibiling = tableNode.getPreviousSibling();
    if (prevSibiling && $isParagraphNode(prevSibiling)) {
      prevSibiling.selectStart();
    } else {
      const paragraphNode = $createParagraphNode();
      tableNode.insertBefore(paragraphNode);
      paragraphNode.append(...(children || []));
      paragraphNode.selectEnd();
    }
  } else {
    const nextSibling = tableNode.getNextSibling();
    if (nextSibling && $isParagraphNode(nextSibling)) {
      nextSibling.selectStart();
    } else {
      const paragraphNode = $createParagraphNode();
      tableNode.insertAfter(paragraphNode);
      paragraphNode.append(...(children || []));
      paragraphNode.selectEnd();
    }
  }
}
  
  