import { MenuItem } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { TABLE_LAYOUT_COLUMN_REMOVE_CMD } from "@editor/plugins/tableLayoutPlugin";
import { $callCommand } from "@systems/commandsManager/commandsManager";

export function ColumnRemoveContextMenu() {
  const {
    editorTheme: {
      tableLayoutTheme: {
        menuTheme: { ColumnRemoveIcon },
      },
    },
  } = useMainThemeContext();

  const onClick = () => {
      $callCommand(TABLE_LAYOUT_COLUMN_REMOVE_CMD, undefined);
      $closeContextMenu();
  };

  return (
    <MenuItem onClick={onClick}>
      <ColumnRemoveIcon />
      <div>Remove Column</div>
    </MenuItem>
  );
}
