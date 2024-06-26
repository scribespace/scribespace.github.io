import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TablePlugin as LexicalTablePlugin } from "@lexical/react/LexicalTablePlugin";
import {
  $computeTableMap,
  $getTableCellNodeFromLexicalNode,
  $getTableNodeFromLexicalNodeOrThrow,
  $getTableRowIndexFromTableCellNode,
  $isTableCellNode,
  $isTableNode,
  $isTableRowNode,
  $isTableSelection,
  TableCellNode,
  TableDOMCell,
  TableNode,
  TableRowNode,
  getDOMCellFromTarget,
} from "@lexical/table";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import { Property } from "csstype";
import {
  $createParagraphNode,
  $createTextNode,
  $getNearestNodeFromDOMNode,
  $getNodeByKey,
  $getNodeByKeyOrThrow,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  $setSelection,
  LexicalEditor,
  LexicalNode,
  RangeSelection,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { MousePosition, assert } from "@/utils";
import { Metric } from "@/utils/types";
import {
  $getExtendedTableNodeFromLexicalNodeOrThrow,
  ExtendedTableNode,
  TableBodyNode
} from "@editor/nodes/table";
import { $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { SELECTION_CHANGE_CMD } from "@editor/plugins/commandsPlugin/editorCommands";
import { $getExtendedTableNodeFromLexicalNode } from "@editor/nodes/table/extendedTableNode";
import { TABLE_ROW_REMOVE_CMD, TABLE_ROW_ADD_BEFORE_CMD, TABLE_ROW_ADD_AFTER_CMD } from "../tableLayoutCommandsPlugin/tableLayoutCommands";

const DRAG_NONE = 0 as const;
const DRAG_HORIZONTAL = 1 as const;
const DRAG_VERTICAL = 2 as const;
type MouseDraggingDirection =
  | typeof DRAG_NONE
  | typeof DRAG_HORIZONTAL
  | typeof DRAG_VERTICAL;

const CELL_TOP = 0 as const;
const CELL_BOTTOM = 1 as const;
const CELL_LEFT = 2 as const;
const CELL_RIGHT = 3 as const;
type CellClickPart =
  | typeof CELL_TOP
  | typeof CELL_BOTTOM
  | typeof CELL_LEFT
  | typeof CELL_RIGHT;

const INVALID_CELL_NODE = 1 as const;

const COLUMN_MARGIN = 10;

function getTableEdgeCursorPosition(
  editor: LexicalEditor,
  selection: RangeSelection,
  tableNode: TableNode,
) {
  const domSelection = window.getSelection();
  if (
    !domSelection ||
    (domSelection.anchorNode !== editor.getRootElement() &&
      domSelection.anchorNode?.nodeName !== "TD")
  ) {
    return undefined;
  }

  const anchorCellNode = $findMatchingParent(selection.anchor.getNode(), (n) =>
    $isTableCellNode(n),
  ) as TableCellNode | null;
  if (!anchorCellNode) {
    return undefined;
  }

  const parentTable = $findMatchingParent(anchorCellNode, (n) =>
    $isTableNode(n),
  );
  if (!$isTableNode(parentTable) || !parentTable.is(tableNode)) {
    return undefined;
  }

  const [tableMap, cellValue] = $computeTableMap(
    tableNode,
    anchorCellNode,
    anchorCellNode,
  );
  const firstCell = tableMap[0][0];
  const lastCell = tableMap[tableMap.length - 1][tableMap[0].length - 1];
  const { startRow, startColumn } = cellValue;

  const isAtFirstCell =
    startRow === firstCell.startRow && startColumn === firstCell.startColumn;
  const isAtLastCell =
    startRow === lastCell.startRow && startColumn === lastCell.startColumn;

  if (isAtFirstCell) {
    return "first";
  } else if (isAtLastCell) {
    return "last";
  } else {
    return undefined;
  }
}

function insertParagraphAtTableEdge(
  edgePosition: "first" | "last",
  tableBodyNode: TableNode,
  children?: LexicalNode[],
) {
  const tableNode = tableBodyNode.getParentOrThrow<ExtendedTableNode>();
  if (edgePosition === "first") {
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

class ResizerStyle {
  position: Property.Position = "absolute";
  backgroundColor: string = "none";
  cursor?: string;
  height?: string;
  left?: string;
  top?: string;
  width?: string;
}

interface ResizerStyles {
  bottom: ResizerStyle;
  right: ResizerStyle;
  top: ResizerStyle;
  left: ResizerStyle;
  marker: ResizerStyle;
}

export default function TablePlugin() {
  const [editor] = useLexicalComposerContext();
  const { editorTheme }: MainTheme = useMainThemeContext();

  const [activeCell, setActiveCell] = useState<TableDOMCell | null>(null);
  const [dragDirection, setDragDirection] =
    useState<MouseDraggingDirection>(DRAG_NONE);
  const [mousePosition, setMousePosition] = useState<MousePosition | null>(
    null,
  );

  const resizerRef = useRef<HTMLDivElement | null>(null);
  const tableRectRef = useRef<DOMRect | null>(null);
  const mouseStartPosition = useRef<MousePosition | null>(null);
  const cellClickPart = useRef<CellClickPart>(CELL_TOP);
  const columnWidthsRef = useRef<{ low: number; hight: number }>({
    low: -1,
    hight: -1,
  });
  const columnPositionRef = useRef<number>(-1);
  const columnIDRef = useRef<number>(-1);

  function ClearState() {
    setActiveCell(null);
    setDragDirection(DRAG_NONE);
    setMousePosition(null);

    resizerRef.current = null;
    tableRectRef.current = null;
    mouseStartPosition.current = null;
  }

  const updateRowHeight = useCallback(
    (heightOffset: number, cellPart: CellClickPart) => {
      if (!activeCell) {
        throw new Error("updateRowHeight: Expected active cell.");
      }

      editor.update(
        () => {
          const tableCellNode = $getNearestNodeFromDOMNode(activeCell.elem);
          if (!$isTableCellNode(tableCellNode)) {
            throw new Error("updateRowHeight: Table cell node not found.");
          }
          const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);

          let tableRowIndex = $getTableRowIndexFromTableCellNode(tableCellNode);

          if (cellPart == CELL_BOTTOM)
            tableRowIndex += tableCellNode.getRowSpan() - 1;

          const tableRows = tableNode.getChildren();

          if (tableRowIndex >= tableRows.length || tableRowIndex < 0) {
            throw new Error("Expected table cell to be inside of table row.");
          }

          if (cellPart == CELL_TOP) {
            if (tableRowIndex == 0) {
              heightOffset = -heightOffset;
            } else {
              tableRowIndex = Math.max(0, tableRowIndex - 1);
            }
          }

          const tableRow = tableRows[tableRowIndex];

          if (!$isTableRowNode(tableRow)) {
            throw new Error("Expected table row");
          }
          const rowElement = editor.getElementByKey(tableRow.getKey());
          if (!rowElement) {
            throw new Error("updateRowHeight: Row element not found.");
          }

          const rowHeight =
            rowElement?.getBoundingClientRect().height - 1; /*border?*/
          tableRow.setHeight(rowHeight + heightOffset);
        },
        { tag: "table-update-row-height" },
      );
    },
    [activeCell, editor],
  );

  function getColumnWidthWithPosition(
    tableNode: ExtendedTableNode,
    columnID: number,
    cellLUT: (TableCellNode | null)[][],
  ): { width: number; position: number } {
    const columnsCount = cellLUT[0].length;
    const columnWidth = tableNode.getColumnWidth(columnID);

    // Find node if first is a miss
    let cellNode: TableCellNode | null = cellLUT[0][columnID];
    if (cellNode == null) {
      for (; columnID < columnsCount; ++columnID) {
        if (cellLUT[0][columnID] != null) {
          cellNode = cellLUT[0][columnID] as TableCellNode;
          break;
        }
      }
    }

    if (cellNode == null) {
      throw Error("updateColumnWidth couldn't find cellNode in cellLUT");
    }

    const cellElement = editor.getElementByKey(cellNode.getKey());
    if (!cellElement) {
      throw new Error("updateColumnWidth: Cell element not found.");
    }

    const { width: rectWidth, right: rectRight } =
      cellElement.getBoundingClientRect();
    const columnPosition = rectRight;
    if (isNaN(columnWidth.value)) {
      const cellWidth = rectWidth;

      let knownWidth = 0;
      let setColumns = 0;
      const span = cellNode.getColSpan();

      for (let s = 0; s < span; ++s) {
        const columnIDToCheck = columnID - s;
        const checkColumnWidth = tableNode.getColumnWidth(columnIDToCheck);
        if (!isNaN(checkColumnWidth.value)) {
          knownWidth += checkColumnWidth.value;
          setColumns += 1;
        }
      }

      const remainingCell = span - setColumns;
      const remainingWidth = cellWidth - knownWidth;
      columnWidth.setValue( remainingWidth / remainingCell );
    }

    return { width: columnWidth.value, position: columnPosition };
  }

  const updateColumnsWidths = () => {
    const cellPart = cellClickPart.current;
    if (!activeCell) {
      throw new Error("updateColumnWidth: Expected active cell.");
    }

    editor.update(() => {
      const tableCellNode = $getNearestNodeFromDOMNode(activeCell.elem);
      if (!$isTableCellNode(tableCellNode)) {
        throw new Error("updateColumnWidth: Table cell node not found.");
      }

      const tableNode =
        $getExtendedTableNodeFromLexicalNodeOrThrow(tableCellNode);
      const tableBodyNode = tableNode.getTableBodyNode();

      // Create look up table for cells
      const columnsCount = tableNode.getColumnsWidths().length;
      const rowsNodes = tableBodyNode.getChildren() as TableRowNode[];
      const rowsCount = rowsNodes.length;

      // Clean table, we need 3 values. INVALID_CELL_NODE marks untouched cell.
      const cellLUT: (TableCellNode | null | typeof INVALID_CELL_NODE)[][] = [];
      for (let r = 0; r < rowsCount; ++r) {
        cellLUT[r] = [];
        for (let c = 0; c < columnsCount; ++c) {
          cellLUT[r][c] = INVALID_CELL_NODE;
        }
      }

      for (let r = 0; r < rowsCount; ++r) {
        const rowNode = rowsNodes[r];
        const cellsNodes = rowNode.getChildren() as TableCellNode[];
        const cellsNodesCount = cellsNodes.length;
        for (let c = 0; c < cellsNodesCount; ++c) {
          const cellNode = cellsNodes[c];

          let cellIndexInLUT = 0;
          for (let cLUT = 0; cLUT < columnsCount; ++cLUT) {
            if (cellLUT[r][cLUT] == INVALID_CELL_NODE) {
              break;
            }
            ++cellIndexInLUT;
          }

          const colSpan = cellNode.getColSpan();
          const rowSpan = cellNode.getRowSpan();
          for (let rs = 0; rs < rowSpan; ++rs) {
            for (let cs = 0; cs < colSpan; ++cs) {
              cellLUT[r + rs][cellIndexInLUT + cs] = null;
            }
          }

          cellLUT[r][cellIndexInLUT + colSpan - 1] = cellNode;
        }
      }
      const tableRowIndex = $getTableRowIndexFromTableCellNode(tableCellNode);
      let columnID = cellLUT[tableRowIndex].findIndex(
        (node) => node == tableCellNode,
      );

      if (cellPart == CELL_LEFT) {
        columnID -= tableCellNode.getColSpan() - 1;
      }

      if (columnID == -1) {
        throw new Error("updateColumnWidth: Didnt find cellNode in cellLUT");
      }

      if (cellPart == CELL_LEFT) {
        --columnID;
      }

      if (
        columnID == -1 ||
        (columnID == columnsCount - 1 && cellPart == CELL_RIGHT)
      ) {
        throw new Error(
          "updateColumnWidth: cellColumnID outside of table. Probably wanted to resize border of table. Not supported",
        );
      }

      const { width: columnWidth, position: columnPosition } =
        getColumnWidthWithPosition(
          tableNode,
          columnID,
          cellLUT as (TableCellNode | null)[][],
        );
      const nextColumnWidth = getColumnWidthWithPosition(
        tableNode,
        columnID + 1,
        cellLUT as (TableCellNode | null)[][],
      ).width;

      columnIDRef.current = columnID;
      columnPositionRef.current = columnPosition;
      columnWidthsRef.current = { low: columnWidth, hight: nextColumnWidth };
    });
  };

  const updateColumnWidth = useCallback(
    (widthOffset: number) => {
      if (!activeCell) {
        throw new Error("updateColumnWidth: Expected active cell.");
      }

      editor.update(
        () => {
          const tableCellNode = $getNearestNodeFromDOMNode(activeCell.elem);
          if (!$isTableCellNode(tableCellNode)) {
            throw new Error("updateColumnWidth: Table cell node not found.");
          }

          const tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow(tableCellNode);

          const columnWidth = columnWidthsRef.current.low;
          const nextColumnWidth = columnWidthsRef.current.hight;

          widthOffset = Math.min(
            columnWidthsRef.current.hight - COLUMN_MARGIN,
            Math.max(-columnWidthsRef.current.low + COLUMN_MARGIN, widthOffset),
          );

          tableNode.setColumnWidth(
            columnIDRef.current,
            new Metric( columnWidth + widthOffset, "px" ),
          );
          tableNode.setColumnWidth(
            columnIDRef.current + 1,
            new Metric( nextColumnWidth - widthOffset, "px" ),
          );
        },
        { tag: "history-merge" }
      );
    },
    [activeCell, editor],
  );

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const target = event.target;
      const targetElement = target as HTMLElement;

      if (dragDirection != DRAG_NONE) {
        setMousePosition({ x: event.clientX, y: event.clientY });
        return;
      }

      // prevent selecting resizer
      if (resizerRef.current && resizerRef.current.contains(target as Node)) {
        return;
      }

      const cell = getDOMCellFromTarget(targetElement);
      setActiveCell(cell);

      if (cell) {
        editor.update(() => {
          const tableCellNode = $getNearestNodeFromDOMNode(cell.elem);
          if (!tableCellNode) {
            throw new Error("TableCellResizer: Table cell node not found.");
          }

          const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
          const tableElement = editor.getElementByKey(tableNode.getKey());

          if (!tableElement) {
            throw new Error("TableCellResizer: Table element not found.");
          }

          tableRectRef.current = tableElement.getBoundingClientRect();
        });
      }
    };

    const onMouseUp = (event: MouseEvent) => {
      if (!activeCell || dragDirection == DRAG_NONE) return;

      if (dragDirection == DRAG_VERTICAL) {
        const heightOffset = event.clientY - mouseStartPosition.current!.y;
        updateRowHeight(heightOffset, cellClickPart.current);
      }

      if (dragDirection == DRAG_HORIZONTAL) {
        const widthOffset = event.clientX - mouseStartPosition.current!.x;
        updateColumnWidth(widthOffset);
      }

      ClearState();

      event.preventDefault();
      event.stopPropagation();
    };

    const onWheel = (event: WheelEvent) => {
      const rootElement = editor.getRootElement();
      if ( !rootElement ) return;
      const rootParent = rootElement.parentElement;
      if ( !rootParent ) return;

      rootParent.scrollBy(event.deltaX, event.deltaY);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    const resizerElement = resizerRef.current;
    if ( resizerElement ) 
      resizerElement.addEventListener("wheel", onWheel);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      if ( resizerElement ) 
        resizerElement.removeEventListener("wheel", onWheel);
    };
  }, [dragDirection, activeCell, editor, updateColumnWidth, updateRowHeight]);

  useEffect(() => {
    assert(
      editor.hasNodes([ExtendedTableNode, TableBodyNode]),
      "ExtendedTableNode, TableBodyNode not registered in editor",
    );

    return mergeRegister(
      editor.registerNodeTransform(ExtendedTableNode, (node) => {
        if ( node.columnsWidthsValid()) return;
        
        const parentNode = node.getParentOrThrow();
        const parentElement = editor.getElementByKey(parentNode.getKey());
        let width = 0;
        if ( parentElement != null ) {
          const {width: parentWidth} = parentElement.getBoundingClientRect();
          width = parentWidth;
        } else {
          assert( $isTableCellNode(parentNode), "expected table as parent" );
          const tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow(parentNode);
          const columnID = tableNode.getTableBodyNode().getCellColumnID(parentNode as TableCellNode);
          for ( let c = columnID ; c < columnID + (parentNode as TableCellNode).getColSpan(); ++c ) {
            width += tableNode.getColumnWidth(c).value;
          }
        }
        node.fixColumns(width);
      }),
      editor.registerMutationListener(TableRowNode, (keys) => {
        editor.getEditorState().read(() => {
          for (const key of keys) {
            const node = $getNodeByKey(key[0]) as TableRowNode;
            if (node && node.getChildrenSize() == 0) {
              const nodeElement = editor.getElementByKey(key[0]);
              if (nodeElement) {
                //@ts-expect-error: internal field
                const element = nodeElement.__lexicalLineBreak;
                if (element != null) {
                  nodeElement.removeChild(element);
                }
                // @ts-expect-error: internal field
                nodeElement.__lexicalLineBreak = null;

                nodeElement.innerHTML = "";
              }
            }
          }
        });
      }),
      $registerCommandListener(
        SELECTION_CHANGE_CMD,
        () => {
          const selection = $getSelection();
          const nodes = selection?.getNodes();
          let tableNode: TableNode | null = null;
          if (nodes && nodes.length == 1) {
            const parents = nodes[0].getParents();
            for (const parent of parents) {
              if ($isTableNode(parent)) {
                tableNode = parent; 
                break;
              }
            }
          }

          if (tableNode == null) return false;

          if ($isTableSelection(selection)) {
            return false;
          } else if ($isRangeSelection(selection)) {
            const tableCellNode = $findMatchingParent(
              selection.anchor.getNode(),
              (n) => $isTableCellNode(n),
            );

            if (!$isTableCellNode(tableCellNode)) {
              return false;
            }

            const edgePosition = getTableEdgeCursorPosition(
              editor,
              selection,
              tableNode,
            );
            if (edgePosition) {
              insertParagraphAtTableEdge("last", tableNode, [
                $createTextNode(),
              ]);
            }
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
                tableNode = $getExtendedTableNodeFromLexicalNode(cellNode);
                if ( !tableNode )
                  return false;
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

                tableNode = $getExtendedTableNodeFromLexicalNode(cellNode);
                if (!tableNode)
                  return false;
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
              tableNode = $getExtendedTableNodeFromLexicalNode(cellNode);
              if ( !tableNode )
                return false;
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
    );
  }, [editor]);

  const getStyles: () => ResizerStyles = useCallback(() => {
    if (!activeCell) {
      return {
        bottom: new ResizerStyle(),
        right: new ResizerStyle(),
        top: new ResizerStyle(),
        left: new ResizerStyle(),
        marker: new ResizerStyle(),
      };
    }

    const { height, width, top, left } =
      activeCell.elem.getBoundingClientRect();
    const size = 3;

    const isFirstCell = activeCell.elem.previousSibling == null;
    const isLastCell = activeCell.elem.nextSibling == null;

    const styles: ResizerStyles = {
      bottom: {
        ...new ResizerStyle(),
        cursor: "row-resize",
        height: `${size}px`,
        left: `${window.scrollX + left}px`,
        top: `${window.scrollY + top + height - size}px`,
        width: `${width}px`,
      },
      right: isLastCell
        ? new ResizerStyle()
        : {
            ...new ResizerStyle(),
            cursor: "col-resize",
            height: `${height}px`,
            left: `${window.scrollX + left + width - size}px`,
            top: `${window.scrollY + top}px`,
            width: `${size}px`,
          },
      left: isFirstCell
        ? new ResizerStyle()
        : {
            ...new ResizerStyle(),
            cursor: "col-resize",
            height: `${height}px`,
            left: `${window.scrollX + left}px`,
            top: `${window.scrollY + top}px`,
            width: `${size}px`,
          },
      top: {
        ...new ResizerStyle(),
        cursor: "row-resize",
        height: `${size}px`,
        left: `${window.scrollX + left}px`,
        top: `${window.scrollY + top}px`,
        width: `${width}px`,
      },
      marker: new ResizerStyle(),
    };

    if (dragDirection != DRAG_NONE && mousePosition) {
      const dragColor = "#0000FF5F";
      const dragSize = 2;

      const columnRange = [
        columnPositionRef.current - columnWidthsRef.current.low + COLUMN_MARGIN,
        columnPositionRef.current +
          columnWidthsRef.current.hight -
          COLUMN_MARGIN,
      ];

      if (dragDirection == DRAG_HORIZONTAL) {
        styles.marker = {
          ...new ResizerStyle(),
          backgroundColor: dragColor,

          cursor: "col-resize",
          width: `${dragSize}px`,
          top: `${window.scrollY + tableRectRef.current!.top}px`,
          height: `${tableRectRef.current!.height}px`,
          left: `${window.scrollX + Math.min(columnRange[1], Math.max(columnRange[0], mousePosition.x)) - 0.5 * dragSize}px`,
        };
      }

      if (dragDirection == DRAG_VERTICAL) {
        styles.marker = {
          ...new ResizerStyle(),
          backgroundColor: dragColor,

          cursor: "row-resize",
          height: `${dragSize}px`,
          top: `${window.scrollY + mousePosition.y - 0.5 * dragSize}px`,
          width: `${tableRectRef.current!.width}px`,
          left: `${window.scrollX + tableRectRef.current!.left}px`,
        };
      }
    }

    return styles;
  }, [activeCell, dragDirection, mousePosition]);

  const styles = getStyles();

  const onMouseDown =
    (
      direction: MouseDraggingDirection,
      cellPart: CellClickPart,
    ): React.MouseEventHandler<HTMLDivElement> =>
    (event: React.MouseEvent<HTMLDivElement>) => {
      mouseStartPosition.current = { x: event.clientX, y: event.clientY };
      cellClickPart.current = cellPart;
      if (direction == DRAG_HORIZONTAL) updateColumnsWidths();
      setDragDirection(direction);
    };

  return (
    <>
      <LexicalTablePlugin />
      {activeCell &&
        createPortal(
          <div ref={resizerRef}>
            <div
              className={editorTheme.editorPrintDisabled}
              style={styles.right || undefined}
              onMouseDown={onMouseDown(DRAG_HORIZONTAL, CELL_RIGHT)}
            ></div>
            <div
              className={editorTheme.editorPrintDisabled}
              style={styles.left || undefined}
              onMouseDown={onMouseDown(DRAG_HORIZONTAL, CELL_LEFT)}
            ></div>
            <div
              className={editorTheme.editorPrintDisabled}
              style={styles.bottom || undefined}
              onMouseDown={onMouseDown(DRAG_VERTICAL, CELL_BOTTOM)}
            ></div>
            <div
              className={editorTheme.editorPrintDisabled}
              style={styles.top || undefined}
              onMouseDown={onMouseDown(DRAG_VERTICAL, CELL_TOP)}
            ></div>

            <div
              className={editorTheme.editorPrintDisabled}
              style={styles.marker || undefined}
            ></div>
          </div>,
          document.body,
        )}
    </>
  );
}
