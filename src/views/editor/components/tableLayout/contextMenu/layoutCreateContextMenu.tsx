import { MenuItem, Submenu } from "@/components/menu";
import SubmenuIcon from "@/components/menu/submenuIcon";
import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { LAYOUT_INSERT_CMD } from "@editor/plugins/tableLayoutPlugin";
import { NumberInputContextMenu } from "./numberInputContextMenu";
import { $callCommand } from "@systems/commandsManager/commandsManager";

export function LayoutCreateContextMenu() {
  const {
    editorTheme: {
      tableLayoutTheme: {
        menuTheme: { LayoutAddIcon },
      },
    },
  } = useMainThemeContext();

  const onInputAccepted = (input: HTMLInputElement) => {
    const cols = input.valueAsNumber;
    $callCommand( LAYOUT_INSERT_CMD, cols );
    $closeContextMenu();
  };

  return (
    <Submenu className="">
      <MenuItem>
        <LayoutAddIcon />
        <div>Create Layout</div>
        <SubmenuIcon />
      </MenuItem>
      <NumberInputContextMenu
        value={2}
        min={2}
        onInputAccepted={onInputAccepted}
      />
    </Submenu>
  );
}
