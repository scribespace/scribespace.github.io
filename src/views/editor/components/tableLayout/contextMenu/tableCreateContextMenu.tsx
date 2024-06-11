import { MenuItem, Submenu } from "@/components/menu";
import SubmenuIcon from "@/components/menu/submenuIcon";
import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TableCreator } from "../table/tableCreator";
import { TABLE_INSERT_COMMAND } from "@editor/plugins/tableLayoutPlugin";

export function TableCreateContextMenu() {
  const [editor] = useLexicalComposerContext();
  const {
    editorTheme: {
      tableLayoutTheme: {
        menuTheme: { TableAddIcon },
      },
    },
  } = useMainThemeContext();

  function onClick(rowsCount: number, columnsCount: number) {
    editor.dispatchCommand( TABLE_INSERT_COMMAND, {rows: rowsCount, columns: columnsCount} );
    $closeContextMenu(editor);
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
