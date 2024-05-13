import { LexicalComposerContextType } from "@lexical/react/LexicalComposerContext";
import { EditorThemeClassName } from "lexical";
import { ReactElement, useCallback, useEffect, useRef, useState } from "react";

import { variableExists } from "../../../../common";

import './css/tableCreatorEditor.css'

interface TableCreatorEditorProps {
    composerContext?: LexicalComposerContextType;

    gridSize: string;
    rowsCount: number;
    columnsCount: number;
    onClick: (rowsCount: number, columnsCount: number)=>void;
}

export type TableCreatorEditorTheme = {
    tableCreatorContainer?: EditorThemeClassName;
    tableCreatorCellContainer?: EditorThemeClassName;
    tableCreatorCell?: EditorThemeClassName;
    tableCreatorLabel?: EditorThemeClassName;
}

export default function TableCreatorEditor(props: TableCreatorEditorProps) {
    const themeRef = useRef<TableCreatorEditorTheme>({})
    const [cells, setCells] = useState<ReactElement[]>()
    const templateColumnsRef = useRef<string>('')
    const [selectedCell, setSelectedCell] = useState<{row: number, column: number}>({row:-1,column:-1})

    function onMouseOver(row: number, column: number) {
        setSelectedCell({row, column})
    }

    function onMouseOut() {
        setSelectedCell({row:-1,column:-1})
    }

    useEffect(()=>{
        const cellsElement: ReactElement[] = [];
        let templateColumns: string = ''
        let key: number = 0;
        for ( let r = 0; r < props.rowsCount; ++r ) {
            const cellsArray: ReactElement[] = []
            for ( let c = 0; c < props.columnsCount; ++c ) {
                const cellClassName = themeRef.current.tableCreatorCell + ((r <= selectedCell.row && c <= selectedCell.column) ? ' selected' : '')
                cellsArray.push( <td key={key++} className={cellClassName} onMouseOver={() => {onMouseOver(r, c)}} onMouseOut={onMouseOut}/> );
            }
            cellsElement.push(
                <tr key={key++}>
                    {cellsArray}
                </tr>
            )
        }

        templateColumnsRef.current = templateColumns;
        setCells(cellsElement)
    },[props.rowsCount, props.columnsCount, selectedCell])

    useEffect(() => {
        const themeContext = props.composerContext ? props.composerContext?.getTheme() : null;

        themeRef.current = themeContext ? (themeContext.tableCreatorEditor as TableCreatorEditorTheme) : {};
        themeRef.current.tableCreatorContainer      = variableExists(themeRef.current.tableCreatorContainer)        ? themeRef.current.tableCreatorContainer        : 'table-creator-container-default'
        themeRef.current.tableCreatorCellContainer  = variableExists(themeRef.current.tableCreatorCellContainer)    ? themeRef.current.tableCreatorCellContainer    : 'table-creator-cells-container-default'
        themeRef.current.tableCreatorCell           = variableExists(themeRef.current.tableCreatorCell)             ? themeRef.current.tableCreatorCell             : 'table-creator-cell-default'
        themeRef.current.tableCreatorLabel          = variableExists(themeRef.current.tableCreatorLabel)            ? themeRef.current.tableCreatorLabel            : 'table-creator-label-default'
    },[props.composerContext])

    function onTableClick() {
        props.onClick(selectedCell.row + 1, selectedCell.column + 1)
    }

    return (
        <div className={themeRef.current.tableCreatorContainer}>
            <table className={themeRef.current.tableCreatorCellContainer} style={{width: props.gridSize, height: props.gridSize}} onClick={onTableClick}>
                <tbody>
                    {cells}
                </tbody>
            </table>
            <div className={themeRef.current.tableCreatorLabel}>{`${selectedCell.column+1} x ${selectedCell.row+1}`}</div>
        </div>
    )
}