import { TableNode, TableRowNode, TableCellNode } from '@lexical/table'
import { $applyNodeReplacement, EditorConfig, LexicalEditor, LexicalNode, NodeKey } from 'lexical';
import {addClassNamesToElement} from '@lexical/utils';

export class ExtendedTableNode extends TableNode {
    __columnsWidths: number[];

  constructor(node?: ExtendedTableNode) {
      super(node?.__key);
      this.__columnsWidths = node ? node.__columnsWidths : [];
  }

  static getType(): string {
    return 'extended-table';
  }

  static clone(node: ExtendedTableNode): ExtendedTableNode {
    return new ExtendedTableNode( node );
  }

  getColumnsWidths() {
    return this.getLatest().__columnsWidths
  }
  setColumnsWidths(columns: number[]) {
    this.getWritable().__columnsWidths = columns;
  }

  updateColGroup() {
    const self = this.getWritable()

    const columnsWidths: number[] = []

    const rowsNodes = self.getChildren() as TableRowNode[]
    const cellsNodes = rowsNodes[0].getChildren() as TableCellNode[]
    for ( const cell of cellsNodes ) {
        for ( let c = 0; c < cell.getColSpan(); ++c ) {
            columnsWidths.push(-1)
        }
    }

    self.__columnsWidths = columnsWidths;
  }

  setColumnWidth(columnID: number, width: number) {
    const self = this.getWritable()
    if ( columnID < 0 || columnID >= self.__columnsWidths.length ) {
        throw Error(`ExtendedTableNode -> setColumnWidth: wrong column ID: ${columnID}. ColCount: ${self.__columnsWidths.length}`)
    }

    self.__columnsWidths[columnID] = width;
  }

  getRealColumnID( rowID: number, cellID: number ): number {
    const self = this.getLatest()
    const rowsNodes = self.getChildren() as TableRowNode[]
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
    const self = this.getLatest()
    if ( columnID < 0 || columnID >= self.__columnsWidths.length ) {
        throw Error(`ExtendedTableNode -> getColumnWidth: wrong column ID: ${columnID}. Or columns not updated: ${self.__columnsWidths.length}`)
    }
    
    return self.__columnsWidths[columnID];
  }

  createDOM(config: EditorConfig, editor?: LexicalEditor): HTMLElement {
    const self = this.getLatest()
    const tableElement = document.createElement('table');

    addClassNamesToElement(tableElement, config.theme.table);

    const colgroup = document.createElement('colgroup')
    for ( const columnWidth of self.__columnsWidths ) {
        const colElement = document.createElement('col')
        if ( columnWidth != -1 )
            colElement.style.cssText = `width: ${columnWidth}px`;
        colgroup.append(colElement);
    }

    tableElement.appendChild(colgroup)

    return tableElement;
  }

  
  updateDOM(
    _prevNode?: unknown,
    dom?: HTMLElement,
    _config?: EditorConfig,
  ): boolean {
    const self = this.getLatest()

    if ( dom ) {
      const colgroup = dom.firstElementChild;
      if ( colgroup ) {
        const colsElements = colgroup.getElementsByTagName('col')

        if (colsElements.length != self.__columnsWidths.length) {
          throw new Error('ExtendedTableNode -> updateDOM: Mismatch between colsElements count and columns widths. Did you run tableNode.updateColGroup()?');
        }

        const colsCount = colsElements.length;
        for ( let c = 0; c < colsCount; ++c ) {
          const colElement = colsElements[c] as HTMLTableColElement;
          const colElementWidthMatch = colElement.style.width.match(/\d+/);
          const colElementWidth = colElementWidthMatch ? Number(colElementWidthMatch[0]) : -1;

          const colNodeWidth = self.__columnsWidths[c];

          if ( colElementWidth != colNodeWidth ) {
            colElement.style.cssText = `width: ${colNodeWidth}px`;
          }
        }
      }
    }

    return false;
  }
}


export function $createExtendedTableNode(): ExtendedTableNode {
	return $applyNodeReplacement(new ExtendedTableNode());

}

export function $isExtendedTableNode(node: LexicalNode | null | undefined): node is ExtendedTableNode {
	return node instanceof ExtendedTableNode;
}