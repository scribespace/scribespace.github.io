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

    useEffect(()=>{
        const cellsElement: ReactElement[] = [];
        let templateColumns: string = ''
        let key: number = 0;
        for ( let c = 0; c < props.columnsCount; ++c ) {
            templateColumns += 'auto ';
            for ( let r = 0; r < props.rowsCount; ++r ) {
                cellsElement.push( <div key={key++} className={themeRef.current.tableCreatorCell}/> );
            }
        }

        templateColumnsRef.current = templateColumns;
        setCells(cellsElement)
    },[props.rowsCount, props.columnsCount])

    useEffect(() => {
        const themeContext = props.composerContext ? props.composerContext?.getTheme() : null;

        themeRef.current = themeContext ? (themeContext.tableCreatorEditor as TableCreatorEditorTheme) : {};
        themeRef.current.tableCreatorContainer      = variableExists(themeRef.current.tableCreatorContainer)        ? themeRef.current.tableCreatorContainer        : 'table-creator-container-default'
        themeRef.current.tableCreatorCellContainer  = variableExists(themeRef.current.tableCreatorCellContainer)    ? themeRef.current.tableCreatorCellContainer    : 'table-creator-cells-container-default'
        themeRef.current.tableCreatorCell           = variableExists(themeRef.current.tableCreatorCell)             ? themeRef.current.tableCreatorCell             : 'table-creator-cell-default'
        themeRef.current.tableCreatorLabel          = variableExists(themeRef.current.tableCreatorLabel)            ? themeRef.current.tableCreatorLabel            : 'table-creator-label-default'
    },[props.composerContext])

    return (
        <div className={themeRef.current.tableCreatorContainer}>
            <div className={themeRef.current.tableCreatorCellContainer} style={{width: props.gridSize, height: props.gridSize, gridTemplateColumns: templateColumnsRef.current}}>
                {cells}
            </div>
            <div className={themeRef.current.tableCreatorLabel}>test</div>
        </div>
    )
}