import { MenuItem, Submenu } from "@/components/menu";
import SubmenuIcon from "@/components/menu/submenuIcon";
import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { TABLE_LAYOUT_COLUMN_ADD_AFTER_COMMAND } from "@editor/plugins/tableLayoutPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { NumberInputContextMenu } from "./numberInputContextMenu";

export function ColumnAddAfterContextMenu() {
  const [editor] = useLexicalComposerContext();
  const {
    editorTheme: {
      tableLayoutTheme: {
        menuTheme: { ColumnAddAfterIcon },
      },
    },
  } = useMainThemeContext();

  const onInputAccepted = (input: HTMLInputElement) => {
    const value = input.valueAsNumber;
    editor.dispatchCommand(TABLE_LAYOUT_COLUMN_ADD_AFTER_COMMAND, value);
    $closeContextMenu(editor);
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
