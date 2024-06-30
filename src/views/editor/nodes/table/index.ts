export {
  TableBodyNode,
  $createTableBodyNodeWithDimensions,
  $convertTableBodyElement,
  $createTableBodyNode,
  $isTableBodyNode,
} from "./tableBodyNode";

export type { SerializedExtendedTableNode } from "./extendedTableNode";
export {
  ExtendedTableNode,
  $createExtendedTableNodeWithDimensions,
  $getExtendedTableNodeFromLexicalNodeOrThrow,
  $convertColElements,
  $convertExtendedTableElement,
  $createExtendedTableNode,
  $isExtendedTableNode,
} from "./extendedTableNode";
