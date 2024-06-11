import { MenuItem, Submenu } from "@/components/menu";
import SubmenuIcon from "@/components/menu/submenuIcon";
import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { LAYOUT_INSERT_COMMAND } from "@editor/plugins/tableLayoutPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { NumberInputContextMenu } from "./numberInputContextMenu";

export function LayoutCreateContextMenu() {
  const [editor] = useLexicalComposerContext();
  const {
    editorTheme: {
      tableLayoutTheme: {
        menuTheme: { LayoutAddIcon },
      },
    },
  } = useMainThemeContext();

  const onInputAccepted = (input: HTMLInputElement) => {
    const cols = input.valueAsNumber;
    editor.dispatchCommand( LAYOUT_INSERT_COMMAND, cols );
    $closeContextMenu(editor);
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
