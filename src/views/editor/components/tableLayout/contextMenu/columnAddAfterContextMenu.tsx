import { MenuItem, Submenu } from "@/components/menu";
import SubmenuIcon from "@/components/menu/submenuIcon";
import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { TABLE_LAYOUT_COLUMN_ADD_AFTER_CMD } from "@editor/plugins/tableLayoutPlugin";
import { NumberInputContextMenu } from "./numberInputContextMenu";
import { $callCommand } from "@systems/commandsManager/commandsManager";

export function ColumnAddAfterContextMenu() {
  const {
    editorTheme: {
      tableLayoutTheme: {
        menuTheme: { ColumnAddAfterIcon },
      },
    },
  } = useMainThemeContext();

  const onInputAccepted = (input: HTMLInputElement) => {
    const value = input.valueAsNumber;
    $callCommand(TABLE_LAYOUT_COLUMN_ADD_AFTER_CMD, value);
    $closeContextMenu();
  };

  return (
    <Submenu className="">
      <MenuItem>
        <ColumnAddAfterIcon />
        <div>Insert Column After</div>
        <SubmenuIcon />
      </MenuItem>
      <NumberInputContextMenu onInputAccepted={onInputAccepted} />
    </Submenu>
  );
}
