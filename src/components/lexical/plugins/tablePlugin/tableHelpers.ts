import { $createTableCellNode, TableCellHeaderStates, TableCellNode } from "@lexical/table";
import { $createParagraphNode } from "lexical";

export function $createTableCellNodeWithParagraph(): TableCellNode {
    const tableCellNode = $createTableCellNode(TableCellHeaderStates.NO_STATUS);
    const paragraphNode = $createParagraphNode();

    tableCellNode.append(paragraphNode)
    return tableCellNode
}