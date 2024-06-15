import { $createLayoutNodeWithColumns } from "@editor/nodes/layout";
import { $createExtendedTableNodeWithDimensions, $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode, TableBodyNode } from "@editor/nodes/table";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $findCellNode, $findTableNode, $getTableCellNodeFromLexicalNode, $getTableNodeFromLexicalNodeOrThrow, $getTableRowIndexFromTableCellNode, $isTableCellNode, $isTableNode, $isTableRowNode, $isTableSelection, TableCellNode, TableRowNode } from "@lexical/table";
import { mergeRegister } from "@lexical/utils";
import { $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { $getNodeByKey, $getNodeByKeyOrThrow, $getSelection, $insertNodes, $isRangeSelection, $setSelection } from "lexical";
import { useEffect } from "react";
import { $getTableColumnIndexFromTableCellNode } from "..";
import { InsertTablePayload, LAYOUT_INSERT_CMD, TABLE_INSERT_CMD, TABLE_LAYOUT_COLUMN_ADD_AFTER_CMD, TABLE_LAYOUT_COLUMN_ADD_BEFORE_CMD, TABLE_LAYOUT_COLUMN_REMOVE_CMD, TABLE_LAYOUT_MERGE_CELLS_CMD, TABLE_LAYOUT_REMOVE_SELECTED_CMD, TABLE_LAYOUT_SPLIT_CELLS_CMD, TABLE_ROW_ADD_AFTER_CMD, TABLE_ROW_ADD_BEFORE_CMD, TABLE_ROW_REMOVE_CMD } from "./tableLayoutCommands";

export function TableLayoutCommandsPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(
        () => {
            return mergeRegister(
                $registerCommandListener(
                    TABLE_INSERT_CMD,
                    (payload: InsertTablePayload) => {
                        const tableNode = $createExtendedTableNodeWithDimensions(
                          payload.rows,
                          payload.columns,
                        );
                        $insertNodes([tableNode]);
                        return true;
                    },
                ),
                $registerCommandListener(
                    LAYOUT_INSERT_CMD,
                    (payload: number) => {
                        const layoutNode = $createLayoutNodeWithColumns(payload);
                        $insertNodes([layoutNode]);
                        return true;
                    },
                ),
                $registerCommandListener(
                    TABLE_LAYOUT_REMOVE_SELECTED_CMD,
                    () => {
                        let tableNode: ExtendedTableNode | null = null;

                        const selection = $getSelection();
                        if ($isRangeSelection(selection)) {
                            tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow(
                            selection.anchor.getNode(),
                            );
                        }
                        if ($isTableSelection(selection)) {
                            const tableBodyNode = $getNodeByKeyOrThrow(selection.tableKey);
                            tableNode = tableBodyNode.getParentOrThrow<ExtendedTableNode>();
                        }

                        if (tableNode) {
                            tableNode.remove();
                            return true;
                        }
                        return false;
                    },
                ),
                $registerCommandListener(
                    TABLE_LAYOUT_MERGE_CELLS_CMD,
                    () => {
                            const selection = $getSelection();
                            if ($isTableSelection(selection)) {
                              const selectedNodes = selection.getNodes();
                              const tableNodeID = 0;
                              const firstRowNodeID = 1;
                              const firstCellNodeID = 2;
                              if (
                                !$isTableNode(selectedNodes[0]) ||
                                !$isTableRowNode(selectedNodes[1]) ||
                                !$isTableCellNode(selectedNodes[2])
                              ) {
                                return true;
                              }
                      
                              const tableBodyNode = selectedNodes[tableNodeID] as TableBodyNode;
                      
                              let columnsToMerge = 0;
                              const firstRowNode = selectedNodes[firstRowNodeID];
                              const cellsInFirstRow = new Set<TableCellNode>();
                              for (const node of selectedNodes) {
                                if (node.getParent() == firstRowNode) {
                                  const cellNode = node as TableCellNode;
                                  if (!cellsInFirstRow.has(cellNode)) {
                                    cellsInFirstRow.add(cellNode);
                                    columnsToMerge += cellNode.getColSpan();
                                  }
                                }
                              }
                      
                              let rowsToMerge = 0;
                              const rowsAdded = new Set<TableRowNode>();
                              const cellsInRowsAdded = new Set<TableCellNode>();
                              for (let n = firstRowNodeID; n < selectedNodes.length; ++n) {
                                const node = selectedNodes[n];
                                if ($isTableRowNode(node) && $findTableNode(node) == tableBodyNode) {
                                  if (!rowsAdded.has(node)) {
                                    const cellNode = selectedNodes[n + 1] as TableCellNode;
                                    if (!cellsInRowsAdded.has(cellNode)) {
                                      cellsInRowsAdded.add(cellNode);
                                      const rowsSpan = cellNode.getRowSpan();
                                      rowsToMerge += rowsSpan;
                      
                                      let nextRow: TableRowNode | null = node;
                                      for (let s = 0; s < rowsSpan; ++s) {
                                        if (nextRow == null)
                                          throw Error(
                                            "TableContextMergeCells: Trying to process null sibling",
                                          );
                                        rowsAdded.add(nextRow as TableRowNode);
                                        nextRow = nextRow!.getNextSibling();
                                      }
                                    }
                                  }
                                }
                              }
                      
                              const firstCellNode = selectedNodes[firstCellNodeID] as TableCellNode;
                              tableBodyNode.mergeCells(
                                editor,
                                firstCellNode,
                                rowsToMerge,
                                columnsToMerge,
                              );
                      
                              $setSelection(null);
                              return true;
                            }

                            return false;
                    },
                ),
                $registerCommandListener(
                    TABLE_LAYOUT_SPLIT_CELLS_CMD,
                    () => {
                        const selection = $getSelection();
                        let tableNode: ExtendedTableNode | null = null;
                  
                        const nodesKeys = new Set<string>();
                        if ($isTableSelection(selection)) {
                          const tableBodyNode = $getNodeByKey( selection.tableKey ) as TableBodyNode;
                          tableNode = tableBodyNode?.getParentOrThrow<ExtendedTableNode>();
                          for (const node of selection.getNodes()) {
                            if ($isTableCellNode(node) && !nodesKeys.has(node.getKey())) {
                              nodesKeys.add(node.getKey());
                            }
                          }
                        }
                  
                        if ($isRangeSelection(selection)) {
                          const node = $findCellNode(selection.getNodes()[0]);
                          if (node) {
                            tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow(node);
                            nodesKeys.add(node.getKey());
                          }
                        }
                  
                        for (const nodeKey of nodesKeys) {
                          const node = $getNodeByKey(nodeKey) as TableCellNode;
                          tableNode?.splitCell(editor, node);
                        }
                  
                        if ( nodesKeys.size > 0 ) {
                            $setSelection(null);
                            return true;
                        }

                        return false;
                    },
                ),
                $registerCommandListener(
                    TABLE_ROW_REMOVE_CMD,
                    ()=>{
                        let tableNode: ExtendedTableNode | null = null;
                        let cellNode: TableCellNode | null = null;
                        let rowsCount = 0;

                        const selection = $getSelection();
                        if ($isRangeSelection(selection)) {
                            cellNode = $getTableCellNodeFromLexicalNode( selection.anchor.getNode() );
                            if (!$isTableCellNode(cellNode))
                                return false;
                            tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow(cellNode);
                            rowsCount = 1;
                        }

                        if ($isTableSelection(selection)) {
                            if (selection.anchor.isBefore(selection.focus)) {
                                cellNode = selection.anchor.getNode() as TableCellNode;
                            } else {
                                cellNode = selection.focus.getNode() as TableCellNode;
                            }
                            const tableBodyNode = $getTableNodeFromLexicalNodeOrThrow( cellNode ) as TableBodyNode;
                            tableNode = tableBodyNode.getParentOrThrow<ExtendedTableNode>();

                            const rowID = $getTableRowIndexFromTableCellNode(cellNode);
                            for (const node of selection.getNodes()) {
                                if ($isTableCellNode(node)) {
                                    if (tableBodyNode == $getTableNodeFromLexicalNodeOrThrow(node)) {
                                        const testRowID = $getTableRowIndexFromTableCellNode(node);

                                        rowsCount = Math.max(rowsCount, testRowID - rowID);
                                    }
                                }
                            }
                            ++rowsCount;
                        }

                        if (!cellNode || !tableNode) 
                            return false;

                        tableNode.removeRows(cellNode, rowsCount);
                        $setSelection(null);
                        return true;
                    },
                ),
                $registerCommandListener(
                    TABLE_ROW_ADD_BEFORE_CMD,
                    (rows: number) => {
                        const selection = $getSelection();

                        let tableNode: ExtendedTableNode | null = null;
                        let cellNode: TableCellNode | null = null;
                        if ($isRangeSelection(selection)) {
                            cellNode = $getTableCellNodeFromLexicalNode(selection.getNodes()[0]);

                            if (!cellNode) 
                                return false;

                            tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow(cellNode);
                        }

                        if ($isTableSelection(selection)) {
                            const tableBodyNode = $getNodeByKeyOrThrow<TableBodyNode>( selection.tableKey );
                            tableNode = tableBodyNode.getParentOrThrow<ExtendedTableNode>();
                            if (selection.anchor.isBefore(selection.focus)) {
                                cellNode = selection.anchor.getNode() as TableCellNode;
                            } else {
                                cellNode = selection.focus.getNode() as TableCellNode;
                            }
                        }

                        if (!cellNode) return false;
                        tableNode!.addRowsBefore(cellNode, rows);

                        $setSelection(null);
                        return true;
                    },
                ),
                $registerCommandListener(
                    TABLE_ROW_ADD_AFTER_CMD,
                    (rows: number)=>{
                        const selection = $getSelection();

                        let tableNode: ExtendedTableNode | null = null;
                        let cellNode: TableCellNode | null = null;
                        if ($isRangeSelection(selection)) {
                          cellNode = $getTableCellNodeFromLexicalNode(selection.getNodes()[0]);
                          if (!cellNode) 
                            return false;
                          tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow(cellNode);
                        }
                
                        if ($isTableSelection(selection)) {
                          const tableBodyNode = $getNodeByKeyOrThrow<TableBodyNode>(selection.tableKey);
                          tableNode = tableBodyNode.getParentOrThrow<ExtendedTableNode>();
                          const rowID = -1;
                          for (const node of selection.getNodes()) {
                            if ($isTableCellNode(node)) {
                              const cellsTableNode = $getTableNodeFromLexicalNodeOrThrow(node);
                              if (cellsTableNode == tableBodyNode) {
                                const nodesRowID = $getTableRowIndexFromTableCellNode(node);
                                if (nodesRowID > rowID) {
                                  rowID == nodesRowID;
                                  cellNode = node;
                                }
                              }
                            }
                          }
                        }
                
                        if (!cellNode) 
                            return false;
                        tableNode!.addRowsAfter(cellNode, rows);
                        return true;
                    },
                ),
                $registerCommandListener(
                    TABLE_LAYOUT_COLUMN_REMOVE_CMD,
                    ()=>{
                        let tableNode: ExtendedTableNode | null = null;
                        let cellNode: TableCellNode | null = null;
                        let columnsCount = 0;
                
                        const selection = $getSelection();
                        if ($isRangeSelection(selection)) {
                          cellNode = $getTableCellNodeFromLexicalNode(selection.anchor.getNode());
                          if (!$isTableCellNode(cellNode))
                            return false;
                          tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow(cellNode);
                          columnsCount = 1;
                        }
                
                        if ($isTableSelection(selection)) {
                          if (selection.anchor.isBefore(selection.focus)) {
                            cellNode = selection.anchor.getNode() as TableCellNode;
                          } else {
                            cellNode = selection.focus.getNode() as TableCellNode;
                          }
                          const tableBodyNode = $getTableNodeFromLexicalNodeOrThrow( cellNode ) as TableBodyNode;
                          tableNode = tableBodyNode.getParentOrThrow<ExtendedTableNode>();
                
                          const resolvedTable = tableBodyNode.getResolvedTable();
                          const columnID = $getTableColumnIndexFromTableCellNode( cellNode, resolvedTable );
                
                          for (const node of selection.getNodes()) {
                            if ($isTableCellNode(node)) {
                              if (tableBodyNode == $getTableNodeFromLexicalNodeOrThrow(node)) {
                                const testColumnID = $getTableColumnIndexFromTableCellNode( node, resolvedTable );
                
                                columnsCount = Math.max(columnsCount, testColumnID - columnID);
                              }
                            }
                          }
                          ++columnsCount;
                        }
                
                        if (!cellNode || !tableNode)
                            return false;
                
                        tableNode.removeColumns(cellNode, columnsCount);
                        $setSelection(null);
                        return true;
                    },
                ),
                $registerCommandListener(
                    TABLE_LAYOUT_COLUMN_ADD_BEFORE_CMD,
                    (columns: number)=>{
                        const selection = $getSelection();

                        let tableNode: ExtendedTableNode | null = null;
                        let cellNode: TableCellNode | null = null;
                        if ($isRangeSelection(selection)) {
                            cellNode = $getTableCellNodeFromLexicalNode(selection.getNodes()[0]);
                            if (!cellNode) 
                                return false;
                            tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow(cellNode);
                        }

                        if ($isTableSelection(selection)) {
                            const tableBodyNode = $getNodeByKeyOrThrow<TableBodyNode>( selection.tableKey );
                            tableNode = tableBodyNode.getParentOrThrow<ExtendedTableNode>();
                            const resolvedTable = tableBodyNode.getResolvedTable();
                            const columnID = resolvedTable[0].cells.length;
                            for (const node of selection.getNodes()) {
                                if ($isTableCellNode(node)) {
                                    const cellsTableNode = $getTableNodeFromLexicalNodeOrThrow(node);
                                    if (cellsTableNode == tableBodyNode) {
                                        const nodesColumnID = $getTableColumnIndexFromTableCellNode( node, resolvedTable);
                                        if (nodesColumnID < columnID) {
                                            columnID == columnID;
                                            cellNode = node;
                                        }
                                    }
                                }
                            }
                        }

                        if (!cellNode) 
                            return false;
                        tableNode!.addColumnsBefore(cellNode, columns);
                        return true;
                    },
                ),
                $registerCommandListener(
                    TABLE_LAYOUT_COLUMN_ADD_AFTER_CMD,
                    (columns: number)=>{
                        const selection = $getSelection();

                        let tableNode: ExtendedTableNode | null = null;
                        let cellNode: TableCellNode | null = null;
                        if ($isRangeSelection(selection)) {
                            cellNode = $getTableCellNodeFromLexicalNode(selection.getNodes()[0]);
                            if (!cellNode) 
                                return false;
                            tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow( cellNode ) as ExtendedTableNode;
                        }

                        if ($isTableSelection(selection)) {
                        const tableBodyNode = $getNodeByKeyOrThrow<TableBodyNode>(selection.tableKey);
                        tableNode = tableBodyNode.getParentOrThrow<ExtendedTableNode>();
                        const resolvedTable = tableBodyNode.getResolvedTable();
                        const columnID = -1;
                        for (const node of selection.getNodes()) {
                            if ($isTableCellNode(node)) {
                                const cellsTableNode = $getTableNodeFromLexicalNodeOrThrow(node);
                                if (cellsTableNode == tableBodyNode) {
                                    const nodesColumnID = $getTableColumnIndexFromTableCellNode( node, resolvedTable);
                                    if (nodesColumnID > columnID) {
                                        columnID == columnID;
                                        cellNode = node;
                                    }
                                }
                            }
                        }
                        }

                        if (!cellNode) 
                            return false;
                        tableNode?.addColumnsAfter(cellNode, columns);
                        return true;
                    },
                ),
            );
        },
        [editor]
    );

    return null;
}








