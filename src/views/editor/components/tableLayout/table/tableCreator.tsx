import { ReactElement, useEffect, useMemo, useRef, useState } from "react";

import "./css/tableCreator.css";
import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";

interface TableCreatorProps {
  gridSize: string;
  rowsCount: number;
  columnsCount: number;
  onClick: (rowsCount: number, columnsCount: number) => void;
}

export function TableCreator(props: TableCreatorProps) {
  const { editorTheme }: MainTheme = useMainThemeContext();

  const theme = useMemo(() => {
    return editorTheme.tableLayoutTheme.tableTheme.creatorTheme;
  }, [editorTheme.tableLayoutTheme.tableTheme.creatorTheme]);

  const [cells, setCells] = useState<ReactElement[]>();
  const templateColumnsRef = useRef<string>("");
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    column: number;
  }>({ row: -1, column: -1 });

  function onMouseOver(row: number, column: number) {
    setSelectedCell({ row, column });
  }

  function onMouseOut() {
    setSelectedCell({ row: -1, column: -1 });
  }

  useEffect(() => {
    const cellsElement: ReactElement[] = [];
    const templateColumns: string = "";
    let key: number = 0;
    for (let r = 0; r < props.rowsCount; ++r) {
      const cellsArray: ReactElement[] = [];
      for (let c = 0; c < props.columnsCount; ++c) {
        const cellClassName =
          theme.cell +
          (r <= selectedCell.row && c <= selectedCell.column
            ? " selected"
            : "");
        cellsArray.push(
          <td
            key={key++}
            className={cellClassName}
            onMouseOver={() => {
              onMouseOver(r, c);
            }}
            onMouseOut={onMouseOut}
          />,
        );
      }
      cellsElement.push(<tr key={key++}>{cellsArray}</tr>);
    }

    templateColumnsRef.current = templateColumns;
    setCells(cellsElement);
  }, [props.rowsCount, props.columnsCount, selectedCell, theme]);

  function onTableClick() {
    props.onClick(selectedCell.row + 1, selectedCell.column + 1);
  }

  return (
    <div className={theme.container}>
      <table
        className={theme.cellContainer}
        style={{ width: props.gridSize, height: props.gridSize }}
        onClick={onTableClick}
      >
        <tbody>{cells}</tbody>
      </table>
      <div
        className={theme.label}
      >{`${selectedCell.column + 1} x ${selectedCell.row + 1}`}</div>
    </div>
  );
}
