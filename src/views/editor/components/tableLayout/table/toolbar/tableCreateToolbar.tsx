import { MenuItem, Submenu } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { TABLE_INSERT_CMD } from "@editor/plugins/tableLayoutPlugin";
import {
  $closeToolbarMenu,
  TOOLBAR_CLOSE_MENU_CMD,
} from "@editor/plugins/toolbarPlugin/common";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $callCommand, $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { useEffect, useState } from "react";
import { TableCreator } from "../tableCreator";

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
      $callCommand( TABLE_INSERT_CMD, {rows: rowsCount, columns: columnsCount} );
      $closeToolbarMenu();
  }

  useEffect(() => {
    return mergeRegister(
      $registerCommandListener(
        TOOLBAR_CLOSE_MENU_CMD,
        () => {
          setShowSubmenu(false);
          return false;
        }
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
