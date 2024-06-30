import { MenuItem } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { TABLE_ROW_REMOVE_CMD } from "@editor/plugins/tableLayoutPlugin";
import { $callCommand } from "@systems/commandsManager/commandsManager";

export function TableRowRemoveContextMenu() {
  const {
    editorTheme: {
      tableLayoutTheme: {
        menuTheme: { RowRemoveIcon },
      },
    },
  } = useMainThemeContext();

  const onClick = () => {
      $callCommand( TABLE_ROW_REMOVE_CMD, undefined );
      $closeContextMenu();
  };

  return (
    <MenuItem onClick={onClick}>
      <RowRemoveIcon />
      <div>Remove Row</div>
    </MenuItem>
  );
}
