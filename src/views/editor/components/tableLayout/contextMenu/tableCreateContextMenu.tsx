import { MenuItem, Submenu } from "@/components/menu";
import SubmenuIcon from "@/components/menu/submenuIcon";
import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { TableCreator } from "../table/tableCreator";
import { TABLE_INSERT_CMD } from "@editor/plugins/tableLayoutPlugin";
import { $callCommand } from "@systems/commandsManager/commandsManager";

export function TableCreateContextMenu() {
  const {
    editorTheme: {
      tableLayoutTheme: {
        menuTheme: { TableAddIcon },
      },
    },
  } = useMainThemeContext();

  function onClick(rowsCount: number, columnsCount: number) {
    $callCommand( TABLE_INSERT_CMD, {rows: rowsCount, columns: columnsCount} );
    $closeContextMenu();
  }

  return (
    <Submenu className="">
      <MenuItem>
        <TableAddIcon />
        <div>Create Table</div>
        <SubmenuIcon />
      </MenuItem>
      <TableCreator
        gridSize="100px"
        rowsCount={10}
        columnsCount={10}
        onClick={onClick}
      />
    </Submenu>
  );
}
