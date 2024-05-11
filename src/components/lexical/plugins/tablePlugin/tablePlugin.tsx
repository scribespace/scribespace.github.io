import { TablePlugin as LexicalTablePlugin } from '@lexical/react/LexicalTablePlugin'
import { SELECTION_CHANGE_COMMAND, $getSelection, $isRangeSelection, $createTextNode, COMMAND_PRIORITY_LOW, $createParagraphNode, $insertNodes, BaseSelection, LexicalEditor, LexicalNode, ParagraphNode, RangeSelection, $isParagraphNode, $getNearestNodeFromDOMNode } from 'lexical';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TableDOMCell, $isTableSelection, $getTableNodeFromLexicalNodeOrThrow, $isTableCellNode, TableNode, TableRowNode, TableCellNode, $isTableNode, $computeTableMap, getDOMCellFromTarget, $getTableRowIndexFromTableCellNode, $isTableRowNode, $getTableColumnIndexFromTableCellNode} from '@lexical/table';
import { $findMatchingParent } from '@lexical/utils';
import { act, useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import './css/tablePlugin.css'
import { ExtendedTableNode } from './nodes/extendedTableNode';

const DRAG_NONE = 0 as const
const DRAG_HORIZONTAL = 1 as const
const DRAG_VERTICAL = 2 as const
type MouseDraggingDirection = typeof DRAG_NONE | typeof DRAG_HORIZONTAL | typeof DRAG_VERTICAL;

const CELL_TOP = 0 as const
const CELL_BOTTOM = 1 as const
const CELL_LEFT = 2 as const
const CELL_RIGHT = 3 as const
type CellClickPart = typeof CELL_TOP | typeof CELL_BOTTOM | typeof CELL_LEFT | typeof CELL_RIGHT;

type MousePosition = {
    x: number;
    y: number;
}

export function $getTableEdgeCursorPosition(
    editor: LexicalEditor,
    selection: RangeSelection,
    tableNode: TableNode,
  ) {
     const domSelection = window.getSelection();
    if (!domSelection || (domSelection.anchorNode !== editor.getRootElement() && domSelection.anchorNode?.nodeName !== "TD" )) {
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
    const {startRow, startColumn} = cellValue;
  
    const isAtFirstCell =
      startRow === firstCell.startRow && startColumn === firstCell.startColumn;
    const isAtLastCell =
      startRow === lastCell.startRow && startColumn === lastCell.startColumn;
  
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
    tableNode: TableNode,
    children?: LexicalNode[],
  ) {
      if (edgePosition === 'first') {
          const prevSibiling = tableNode.getPreviousSibling()
        if ( prevSibiling && $isParagraphNode(prevSibiling) ) {
            prevSibiling.selectStart()
        } else {
            const paragraphNode = $createParagraphNode();
            tableNode.insertBefore(paragraphNode);
            paragraphNode.append(...(children || []));
            paragraphNode.selectEnd();
        }
    } else {
        const nextSibling = tableNode.getNextSibling()
        if ( nextSibling && $isParagraphNode(nextSibling)) {
            nextSibling.selectStart()
        } else {
            const paragraphNode = $createParagraphNode();
            tableNode.insertAfter(paragraphNode);
            paragraphNode.append(...(children || []));
            paragraphNode.selectEnd();
        }
    }
  }

export default function TablePlugin() {
    const [editor] = useLexicalComposerContext();
    const [activeCell, setActiveCell] = useState<TableDOMCell | null>(null)
    const [dragDirection, setDragDirection] = useState<MouseDraggingDirection>(DRAG_NONE)
    const [mousePosition, setMousePosition] = useState<MousePosition | null>(null)

    const resizerRef = useRef<HTMLDivElement | null>(null)
    const tableRectRef = useRef<DOMRect | null>(null);
    const mouseStartPosition = useRef<MousePosition | null>(null)
    const cellClickPart = useRef<CellClickPart>(CELL_TOP)

    function ClearState() {
        setActiveCell(null);
        setDragDirection(DRAG_NONE)
        setMousePosition(null)

        resizerRef.current = null;
        tableRectRef.current = null;
        mouseStartPosition.current = null;
    }

    const onMouseMove = (event: MouseEvent) => {
        const target = event.target;
        const targetElement = target as HTMLElement;

        if ( dragDirection != DRAG_NONE ) {
          setMousePosition({x: event.clientX, y: event.clientY})
          return;
        }
        
        // prevent selecting resizer
        if ( resizerRef.current && resizerRef.current.contains(target as Node) ) {
          return;
        }
        
        const cell = getDOMCellFromTarget(targetElement)
        setActiveCell(cell)
        
        if ( cell ) {
            editor.update(()=>{
                const tableCellNode = $getNearestNodeFromDOMNode(cell.elem)
            if (!tableCellNode) {
                throw new Error('TableCellResizer: Table cell node not found.');
              }

              const tableNode =
                $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
              const tableElement = editor.getElementByKey(tableNode.getKey());

              if (!tableElement) {
                throw new Error('TableCellResizer: Table element not found.');
              }

              tableRectRef.current = tableElement.getBoundingClientRect();
            })
        }
    }

    const updateRowHeight = useCallback(
        (heightOffset: number, cellPart: CellClickPart) => {
          if (!activeCell) {
            throw new Error('updateRowHeight: Expected active cell.');
          }
    
          editor.update(
            () => {
              const tableCellNode = $getNearestNodeFromDOMNode(activeCell.elem);
              if (!$isTableCellNode(tableCellNode)) {
                throw new Error('updateRowHeight: Table cell node not found.');
              }
              const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
    
              let tableRowIndex = $getTableRowIndexFromTableCellNode(tableCellNode);

              tableRowIndex += tableCellNode.getRowSpan() - 1
    
              const tableRows = tableNode.getChildren();
    
              if (tableRowIndex >= tableRows.length || tableRowIndex < 0) {
                throw new Error('Expected table cell to be inside of table row.');
              }
              
              if ( cellPart == CELL_TOP ) {
                if ( tableRowIndex == 0 ) {
                    heightOffset = -heightOffset
                } else {
                    tableRowIndex = Math.max(0, tableRowIndex - 1);
                }
              }

              const tableRow = tableRows[tableRowIndex];
    
              if (!$isTableRowNode(tableRow)) {
                throw new Error('Expected table row');
              }
                const rowElement = editor.getElementByKey(tableRow.getKey());
                if (!rowElement) {
                    throw new Error('updateRowHeight: Row element not found.');
                  }
    
                const rowHeight = rowElement?.getBoundingClientRect().height - 1/*border?*/;
                tableRow.setHeight(rowHeight + heightOffset);
            },
            {tag: 'table-update-row-height'},
          );
        },
        [activeCell, editor],
      );

      const updateColumnWidth = useCallback(
        (widthOffset: number, cellPart: CellClickPart) => {
          if (!activeCell) {
            throw new Error('updateColumnWidth: Expected active cell.');
          }
    
          editor.update(
            () => {
              const tableCellNode = $getNearestNodeFromDOMNode(activeCell.elem);
              if (!$isTableCellNode(tableCellNode)) {
                throw new Error('updateColumnWidth: Table cell node not found.');
              }
    
              const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode) as ExtendedTableNode;
    
              // Createc look up table for columns
              let colLUT: {column:number;cell:TableCellNode}[][] = [];
              const tableRows = tableNode.getChildren() as TableRowNode[];
              const tableRowsCount = tableRows.length;
              for ( let r = 0; r < tableRowsCount; ++r ) {
                colLUT[r] = []
                const rowCells = tableRows[r].getChildren() as TableCellNode[];
                const cellsCount = rowCells.length;
                let colID = 0;
                for ( let c = 0; c < cellsCount; ++c) {
                    const span = rowCells[c].getColSpan();
                    colLUT[r][c] = {column: (colID + span - 1), cell: rowCells[c]};
                    colID += span;
                }
              }

              let tableRowIndex = $getTableRowIndexFromTableCellNode(tableCellNode);

              let columnLUID = colLUT[tableRowIndex].findIndex((columnLU) => columnLU.cell == tableCellNode)
              if ( columnLUID == -1 ) {
                throw new Error('updateColumnWidth: Column not in the LUT.');
              }
              if ( cellPart == CELL_LEFT ) {
                columnLUID -= 1;                        
              }

              const realColumnID = colLUT[tableRowIndex][columnLUID].column;
              let columnWidth = tableNode.getColumnWidth(realColumnID);
              {

                if ( columnWidth == -1 ) {
                    const currentCellNode = colLUT[tableRowIndex][columnLUID].cell;
                    const currentCellElement = editor.getElementByKey(currentCellNode.getKey());
                    if (!currentCellElement) {
                        throw new Error('updateColumnWidth: Cell element not found.');
                    }

                    const currentCellWidth = currentCellElement.getBoundingClientRect().width;
                    let knownWidth = 0;
                    let setColumns = 0;
                    const span = currentCellNode.getColSpan();
                    for ( let s = 1; s < span; ++s) {
                        const columnIDToCheck = realColumnID - s;
                        const checkColumnWidth = tableNode.getColumnWidth(columnIDToCheck);
                        if ( checkColumnWidth != -1 ) {
                            knownWidth += checkColumnWidth;
                            setColumns += 1;
                        }
                    }

                    const remainingCell = span - setColumns;
                    const remainingWidth = currentCellWidth - knownWidth;
                    columnWidth = remainingWidth / remainingCell;
                }
            }

            let nextColumnWidth = 0;
            const nextRealColumnID = realColumnID + 1;
              {
                nextColumnWidth = tableNode.getColumnWidth(nextRealColumnID);
                if ( nextColumnWidth == -1 ) {
                    const columnLU = colLUT[tableRowIndex][columnLUID+1]
                    const currentCellNode = columnLU.cell;
                    const currentCellElement = editor.getElementByKey(currentCellNode.getKey());
                    if (!currentCellElement) {
                        throw new Error('updateColumnWidth: Cell element not found.');
                    }

                    const currentCellWidth = currentCellElement.getBoundingClientRect().width;
                    let knownWidth = 0;
                    let setColumns = 0;
                    const span = currentCellNode.getColSpan();
                    for ( let s = 0; s < span; ++s) {
                        const columnIDToCheck = columnLU.column - s;
                        const checkColumnWidth = tableNode.getColumnWidth(columnIDToCheck);
                        if ( checkColumnWidth != -1 ) {
                            knownWidth += checkColumnWidth;
                            setColumns += 1;
                        }
                    }

                    const remainingCell = span - setColumns;
                    const remainingWidth = currentCellWidth - knownWidth;
                    nextColumnWidth = remainingWidth / remainingCell;
                }
            }

              
             tableNode.setColumnWidth(realColumnID, columnWidth + widthOffset)
             tableNode.setColumnWidth(nextRealColumnID, nextColumnWidth - widthOffset)
            },
            {tag: 'table-update-column-width'},
          );
        },
        [activeCell, editor],
      );

    const onMouseUp = (event: MouseEvent) => {
        if ( !activeCell || dragDirection == DRAG_NONE) return;

        if ( dragDirection == DRAG_VERTICAL ) {
            const heightOffset = event.clientY - mouseStartPosition.current!.y
            updateRowHeight(heightOffset, cellClickPart.current)
        }

        if ( dragDirection == DRAG_HORIZONTAL ) {
            const widthOffset = event.clientX - mouseStartPosition.current!.x
            updateColumnWidth(widthOffset, cellClickPart.current)
        }

        ClearState();

        event.preventDefault();
        event.stopPropagation();
    }   

    useEffect(()=>{
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp)

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    },[dragDirection, activeCell, editor])
    
    useEffect(()=>{
      const lexicalRegisterCommands = editor.registerCommand(SELECTION_CHANGE_COMMAND, ()=>{

            const selection = $getSelection();
            const nodes = selection?.getNodes()
            let tableNode: TableNode | null = null;
            if ( nodes && nodes.length == 1) {
                const parents = nodes[0].getParents();
                for ( const parent of parents ) {
                    if ( $isTableNode(parent) ) {
                        tableNode = parent;
                        break;
                    }
                }
            }

            if ( tableNode == null ) return false;
            
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
              
                const edgePosition = $getTableEdgeCursorPosition(
                  editor,
                  selection,
                  tableNode,
                );
                if (edgePosition) {
                    $insertParagraphAtTableEdge('last', tableNode, [
                        $createTextNode(),
                    ]);
                }
            }
            
            return false;
        }, COMMAND_PRIORITY_LOW)

        return () => {
            lexicalRegisterCommands();
        }
    },[])

    class ResizerStyle {
        backgroundColor?: string;
        cursor?: string;
        height?: string;
        left?: string;
        top?: string;
        width?: string;
    }

    const getStyles = useCallback(()=>{
        if ( !activeCell ) {
            return {
                bottom: new ResizerStyle(),
                right: new ResizerStyle(),
                top: new ResizerStyle(),
                left: new ResizerStyle(),
                marker: new ResizerStyle(),
              };
        }

        const {height, width, top, left} = activeCell.elem.getBoundingClientRect();
        const size = 3;
        //const zoom = calculateZoomLevel(activeCell.elem);

        const styles = {
            bottom: {
                backgroundColor: 'none',
                cursor: 'row-resize',
                height: `${size}px`,
                left: `${window.scrollX + left}px`,
                top: `${window.scrollY + top + height - size}px`,
                width: `${width}px`,
            },
            right: {
                backgroundColor: 'none',
                cursor: 'col-resize',
                height: `${height}px`,
                left: `${window.scrollX + left + width - size}px`,
                top: `${window.scrollY + top}px`,
                width: `${size}px`,
            },
            left: {
                backgroundColor: 'none',
                cursor: 'col-resize',
                height: `${height}px`,
                left: `${window.scrollX + left}px`,
                top: `${window.scrollY + top}px`,
                width: `${size}px`,
            },
            top: {
                backgroundColor: 'none',
                cursor: 'row-resize',
                height: `${size}px`,
                left: `${window.scrollX + left}px`,
                top: `${window.scrollY + top}px`,
                width: `${width}px`,
            },
            marker: new ResizerStyle(),
        };

        if ( dragDirection != DRAG_NONE && mousePosition ) {
            const dragColor = '#0000FF5F'
            const dragSize = 2;

            if ( dragDirection == DRAG_HORIZONTAL ) {
                styles.marker = {
                    backgroundColor: dragColor,

                    cursor: 'col-resize',
                    width: `${dragSize}px`,
                    top: `${window.scrollY + tableRectRef.current!.top}px`,
                    height: `${tableRectRef.current!.height}px`,
                    left: `${window.scrollX + mousePosition.x - (0.5 * dragSize)}px`
                }
            }

            if ( dragDirection == DRAG_VERTICAL ) {
                styles.marker = {
                    backgroundColor: dragColor,

                    cursor: 'row-resize',
                    height: `${dragSize}px`,
                    top: `${window.scrollY + mousePosition.y - (0.5 * dragSize)}px`,
                    width: `${tableRectRef.current!.width}px`,
                    left: `${window.scrollX + tableRectRef.current!.left }px`
                }
            }
        }

      return styles;
    },[activeCell, dragDirection, mousePosition])

    const styles = getStyles()

    const onMouseDown = (direction: MouseDraggingDirection, cellPart: CellClickPart): React.MouseEventHandler<HTMLDivElement> => (event: React.MouseEvent<HTMLDivElement>) => {
        mouseStartPosition.current = { x: event.clientX, y: event.clientY }
        cellClickPart.current = cellPart;
        setDragDirection(direction)
    }

    return (
        <div>
            <LexicalTablePlugin/>
            {activeCell && createPortal(
                <div ref={resizerRef}>
                    <div className='table-resizer' style={styles.right || undefined} onMouseDown={onMouseDown(DRAG_HORIZONTAL, CELL_RIGHT)}></div>
                    <div className='table-resizer' style={styles.left || undefined} onMouseDown={onMouseDown(DRAG_HORIZONTAL, CELL_LEFT)}></div>
                    <div className='table-resizer' style={styles.bottom || undefined} onMouseDown={onMouseDown(DRAG_VERTICAL, CELL_BOTTOM)}></div>
                    <div className='table-resizer' style={styles.top || undefined} onMouseDown={onMouseDown(DRAG_VERTICAL, CELL_TOP)}></div>

                    <div className='table-resizer' style={ styles.marker || undefined }></div>
                </div>    
            , document.body)}
        </div>
    )
}