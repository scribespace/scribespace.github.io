import { TablePlugin as LexicalTablePlugin } from '@lexical/react/LexicalTablePlugin'
import { SELECTION_CHANGE_COMMAND, $getSelection, $isRangeSelection, $createTextNode, COMMAND_PRIORITY_LOW, $createParagraphNode, $insertNodes, BaseSelection, LexicalEditor, LexicalNode, ParagraphNode, RangeSelection, $isParagraphNode } from 'lexical';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isTableSelection, $createTableRowNode, TableRowNode, $createTableCellNode, TableCellHeaderStates, $isTableCellNode, TableNode, TableCellNode, $isTableNode, $computeTableMap} from '@lexical/table';
import { $findMatchingParent } from '@lexical/utils';
import { useEffect } from 'react';

export function $getTableEdgeCursorPosition(
    editor: LexicalEditor,
    selection: RangeSelection,
    tableNode: TableNode,
  ) {
    // TODO: Add support for nested tables
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
    
    useEffect(()=>{
        return editor.registerCommand(SELECTION_CHANGE_COMMAND, ()=>{

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
    })

    return <LexicalTablePlugin/>
}