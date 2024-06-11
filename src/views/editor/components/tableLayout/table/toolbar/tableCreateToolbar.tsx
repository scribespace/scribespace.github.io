import { MenuItem, Submenu } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import {
  $closeToolbarMenu,
  TOOLBAR_CLOSE_MENU_COMMAND,
} from "@editor/plugins/toolbarPlugin/common";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { COMMAND_PRIORITY_LOW } from "lexical";
import { useEffect, useState } from "react";
import { TableCreator } from "../tableCreator";
import { TABLE_INSERT_COMMAND } from "@editor/plugins/tableLayoutPlugin";

export function TableCreateToolbar() {
  const [editor] = useLexicalComposerContext();
  const {
    editorTheme: {
      tableLayoutTheme: {
        menuTheme: { TableAddIcon },
      },
    },
  } = useMainThemeContext();

  const [showSubmenu, setShowSubmenu] = useState<boolean>(false);

  function onClick(rowsCount: number, columnsCount: number) {
      editor.dispatchCommand( TABLE_INSERT_COMMAND, {rows: rowsCount, columns: columnsCount} );
      $closeToolbarMenu(editor);
  }

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        TOOLBAR_CLOSE_MENU_COMMAND,
        () => {
          setShowSubmenu(false);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, showSubmenu, setShowSubmenu]);

  return (
    <Submenu
      className=""
      showSubmenu={showSubmenu}
      setShowSubmenu={setShowSubmenu}
    >
      <MenuItem>
        <TableAddIcon />
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
