import { MenuItem, Submenu } from "@/components/menu";
import SubmenuIcon from "@/components/menu/submenuIcon";
import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { TABLE_ROW_ADD_BEFORE_CMD } from "@editor/plugins/tableLayoutPlugin";
import { NumberInputContextMenu } from "./numberInputContextMenu";
import { $callCommand } from "@systems/commandsManager/commandsManager";

export function TableRowAddBeforeContextMenu() {
  const {
    editorTheme: {
      tableLayoutTheme: {
        menuTheme: { RowAddBeforeIcon },
      },
    },
  } = useMainThemeContext();

  const onInputAccepted = (input: HTMLInputElement) => {
    const value = input.valueAsNumber;
    $callCommand(TABLE_ROW_ADD_BEFORE_CMD, value);
    $closeContextMenu();
  };

  return (
    <Submenu className="">
      <MenuItem>
        <RowAddBeforeIcon />
        <div>Insert Row Before</div>
        <SubmenuIcon />
      </MenuItem>
      <NumberInputContextMenu onInputAccepted={onInputAccepted} />
    </Submenu>
  );
}
