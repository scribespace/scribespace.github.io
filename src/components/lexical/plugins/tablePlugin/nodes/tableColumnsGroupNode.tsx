import { $applyNodeReplacement, DOMConversionMap, DOMConversionOutput, EditorConfig, LexicalNode, SerializedTextNode, Spread, TextNode } from 'lexical';

export type SerializedTableColumnsGroupNode = Spread<
  {
    columnsWidths: number[];
  },
  SerializedTextNode
>;

export class TableColumnsGroupNode extends TextNode {
    __columnsWidths: number[];

  constructor(node?: TableColumnsGroupNode) {
      super("",node?.__key);
      this.__columnsWidths = node ? structuredClone(node.__columnsWidths) : [];
  }

  static getType(): string {
    return 'table-columns-group';
  }

  static clone(node: TableColumnsGroupNode): TableColumnsGroupNode {
    return new TableColumnsGroupNode( node );
  }

  getColumnsWidths() {
    return this.getLatest().__columnsWidths
  }
  setColumnsWidths(columns: number[]) {
    this.getWritable().__columnsWidths = columns;
  }

  initColGroup(columnsCount: number) {
    const self = this.getWritable()

    const columnsWidths: number[] = []

    for ( let c = 0; c < columnsCount; ++c ) {
        columnsWidths.push(-1)
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

  getColumnWidth(columnID: number ): number {
    const self = this.getLatest()
    if ( columnID < 0 || columnID >= self.__columnsWidths.length ) {
        throw Error(`ExtendedTableNode -> getColumnWidth: wrong column ID: ${columnID}. Or columns not updated: ${self.__columnsWidths.length}`)
    }
    
    return self.__columnsWidths[columnID];
  }

  addColumnsBefore(columnID: number, columnsToAdd: number) {
    const self = this.getWritable();
    const columnsWidths = self.getColumnsWidths();
    const sizeScale = columnsWidths.length / (columnsWidths.length + columnsToAdd);

    for ( let c = 0; c < columnsWidths.length; ++c ) {
      if ( columnsWidths[c] > -1 ) {
        columnsWidths[c] *= sizeScale
      }
    }

    const newColumns: number[] = []
    for ( let c = 0; c < columnsToAdd; ++c ) 
      newColumns[c] = -1;

    columnsWidths.splice(columnID, 0, ...newColumns);
  }

  addColumnsAfter(columnID: number, columnsToAdd: number ) {
    const self = this.getWritable();
    const columnsWidths = self.getColumnsWidths();
    const sizeScale = columnsWidths.length / (columnsWidths.length + columnsToAdd);

    for ( let c = 0; c < columnsWidths.length; ++c ) {
      if ( columnsWidths[c] > -1 ) {
        columnsWidths[c] *= sizeScale
      }
    }

    const newColumns: number[] = []
    for ( let c = 0; c < columnsToAdd; ++c ) 
      newColumns[c] = -1;

    columnsWidths.splice(columnID + 1, 0, ...newColumns);
  }


  createDOM(): HTMLElement {
    const self = this.getLatest()
    const colgroup = document.createElement('colgroup')
    for ( const columnWidth of self.__columnsWidths ) {
        const colElement = document.createElement('col')
        if ( columnWidth != -1 )
            colElement.style.cssText = `width: ${columnWidth}px`;
        colgroup.append(colElement);
    }

    return colgroup;
  }
  
  updateDOM(
    _prevNode?: unknown,
    dom?: HTMLElement,
    _config?: EditorConfig,
  ): boolean {
    const self = this.getLatest()
    if ( dom ) {
      if ( !(dom instanceof HTMLTableColElement) ) throw Error("expected HTMLTableColElement")

      if (dom.childElementCount != self.__columnsWidths.length) {
        const children = dom.children
        while ( dom.childElementCount > 0 ) {
          const child = children.item(0) as Element;
          dom.removeChild(child);
        }

        for ( let c = 0; c < self.__columnsWidths.length; ++c ) {
          const colElement = document.createElement('col')
          dom.append(colElement);
        }
      }
      
      const colsElements = dom.getElementsByTagName('col')
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

    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      colgroup: (_node: Node) => ({
        conversion: $convertTableColumnsGroupNode,
        priority: 1,
      }),
    };
  }

  static importJSON(serializedNode: SerializedTableColumnsGroupNode): TableColumnsGroupNode {
    const tableColumnsGroup = $createTableColumnsGroupNode()
    tableColumnsGroup.setColumnsWidths(serializedNode.columnsWidths)

    return tableColumnsGroup
  }

  exportJSON(): SerializedTableColumnsGroupNode {
    return {
      ...super.exportJSON(),
      columnsWidths: this.getColumnsWidths(),
      type: 'table-columns-group',
      version: 1,
    };
  }

  isDirectionless(): true {
    return true;
  }
}

export function $convertTableColumnsGroupNode(domNode: Node): DOMConversionOutput {
  const columnsGroupNode = $createTableColumnsGroupNode();
  if ( !(domNode instanceof Element) ) throw Error("$convertTableColumnsGroupNode expected Element");

  const colElements = domNode.getElementsByTagName('col');

  columnsGroupNode.__columnsWidths = [];

  for ( const colElement of colElements ) {
    const colElementWidthMatch = colElement.style.width.match(/\d+/);
    const colElementWidth = colElementWidthMatch ? Number(colElementWidthMatch[0]) : -1;
    columnsGroupNode.__columnsWidths.push(colElementWidth);
  }

  return {node: columnsGroupNode} 
}

export function $createTableColumnsGroupNode(): TableColumnsGroupNode {
	return $applyNodeReplacement(new TableColumnsGroupNode());

}

export function $isTableColumnsGroupNode(node: LexicalNode | null | undefined): node is TableColumnsGroupNode {
	return node instanceof TableColumnsGroupNode;
}