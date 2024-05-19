import { $createTableCellNode, $getTableRowIndexFromTableCellNode, TableCellHeaderStates, TableCellNode } from "@lexical/table";
import { $createParagraphNode } from "lexical";
import { ResolvedRow } from "./nodes/extendedTableNode";

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
  