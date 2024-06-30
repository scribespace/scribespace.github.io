import { MenuItem } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { TABLE_LAYOUT_MERGE_CELLS_CMD } from "@editor/plugins/tableLayoutPlugin";
import { $callCommand } from "@systems/commandsManager/commandsManager";

export function MergeCellsContextMenu() {
  const {
    editorTheme: {
      tableLayoutTheme: {
        menuTheme: { MergeCellIcon },
      },
    },
  } = useMainThemeContext();

  const onClick = () => {
        $callCommand(TABLE_LAYOUT_MERGE_CELLS_CMD, undefined);
        $closeContextMenu();
  };

  return (
    <MenuItem onClick={onClick}>
      <MergeCellIcon />
      <div>Merge Cells</div>
    </MenuItem>
  );
}
