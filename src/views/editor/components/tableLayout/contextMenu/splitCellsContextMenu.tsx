import { MenuItem } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { TABLE_LAYOUT_SPLIT_CELLS_CMD } from "@editor/plugins/tableLayoutPlugin";
import { $callCommand } from "@systems/commandsManager/commandsManager";

export function SplitCellsContextMenu() {
  const {
    editorTheme: {
      tableLayoutTheme: {
        menuTheme: { SplitCellIcon },
      },
    },
  } = useMainThemeContext();

  const onClick = () => {
      $callCommand( TABLE_LAYOUT_SPLIT_CELLS_CMD, undefined);
      $closeContextMenu();
  };

  return (
    <MenuItem onClick={onClick}>
      <SplitCellIcon />
      <div>Split Cells</div>
    </MenuItem>
  );
}
