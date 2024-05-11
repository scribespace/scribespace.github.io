import { TableNode, TableRowNode, TableCellNode } from '@lexical/table'
import { $applyNodeReplacement, EditorConfig, LexicalEditor, LexicalNode, NodeKey } from 'lexical';
import {addClassNamesToElement} from '@lexical/utils';

export class ExtendedTableNode extends TableNode {
    __columnsWidths: number[];

  constructor(key?: NodeKey) {
      super(key);
      this.__columnsWidths = []
  }

  static getType(): string {
    return 'extended-table';
  }

  static clone(node: ExtendedTableNode): ExtendedTableNode {
    return new ExtendedTableNode(node.__key);
  }

  updateColGroup() {
    const columnsWidths: number[] = []

    const rowsNodes = this.getChildren() as TableRowNode[]
    const cellsNodes = rowsNodes[0].getChildren() as TableCellNode[]
    for ( const cell of cellsNodes ) {
        for ( let c = 0; c < cell.getColSpan(); ++c ) {
            columnsWidths.push(-1)
        }
    }

    this.getWritable().__columnsWidths = columnsWidths;
  }

  setColumnWidth(columnID: number, width: number) {
    if ( columnID < 0 || columnID >= this.getLatest().__columnsWidths.length ) {
        throw Error(`ExtendedTableNode -> setColumnWidth: wrong column ID: ${columnID}`)
    }

    this.getWritable().__columnsWidths[columnID] = width;
  }

  getRealColumnID( rowID: number, cellID: number ): number {
    const latest = this.getLatest()
    const rowsNodes = latest.getChildren() as TableRowNode[]
    if ( rowID < 0 || rowID >= rowsNodes.length ) {
        throw Error(`ExtendedTableNode -> getRealColumnID: wrong row ID: ${rowID}, rows count: ${rowsNodes.length}`)
    }

    const rowNode = rowsNodes[rowID];
    const cellsNodes = rowNode.getChildren() as TableCellNode[]
    if ( cellID < 0 || cellID >= cellsNodes.length ) {
        throw Error(`ExtendedTableNode -> getRealColumnID: wrong cell ID: ${cellID}, cells count: ${cellsNodes.length}`)
    }

    let columnCount = 0;
    let columnID = 0;
    for ( let c = 0; c < (cellID + 1); ++c ) {
        const cellNode = cellsNodes[c]
        const span = cellNode.getColSpan();
        columnID = columnCount + span - 1;
        columnCount += span
    }

    return columnID;
  }

  getColumnWidth(columnID: number ): number {
    const latest = this.getLatest()
    if ( columnID < 0 || columnID >= latest.__columnsWidths.length ) {
        throw Error(`ExtendedTableNode -> setColumnWidth: wrong column ID: ${columnID}. Or columns not updated: ${latest.__columnsWidths.length}`)
    }
    
    return latest.__columnsWidths[columnID];
  }

  createDOM(config: EditorConfig, editor?: LexicalEditor): HTMLElement {
    const tableElement = document.createElement('table');

    addClassNamesToElement(tableElement, config.theme.table);

    const colgroup = document.createElement('colgroup')
    for ( const columnWidth of this.getWritable().__columnsWidths ) {
        const colElement = document.createElement('col')
        if ( columnWidth != -1 )
            colElement.style.cssText = `width: ${columnWidth}px`;
        colgroup.append(colElement);
    }

    tableElement.appendChild(colgroup)

    return tableElement;
  }
}

export function $createExtendedTableNode(): ExtendedTableNode {
	return $applyNodeReplacement(new ExtendedTableNode());

}

export function $isExtendedTableNode(node: LexicalNode | null | undefined): node is ExtendedTableNode {
	return node instanceof ExtendedTableNode;
}