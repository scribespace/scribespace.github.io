import { MenuItem } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { TABLE_LAYOUT_REMOVE_SELECTED_CMD } from "@editor/plugins/tableLayoutPlugin";
import { $callCommand } from "@systems/commandsManager/commandsManager";

export function DeleteContextMenu() {
  const {
    editorTheme: {
      tableLayoutTheme: {
        menuTheme: { DeleteIcon },
      },
    },
  } = useMainThemeContext();

  const onClick = () => {
    $callCommand(TABLE_LAYOUT_REMOVE_SELECTED_CMD, undefined);
    $closeContextMenu();
  };

  return (
    <MenuItem onClick={onClick}>
      <DeleteIcon />
      <div>Delete</div>
    </MenuItem>
  );
}
