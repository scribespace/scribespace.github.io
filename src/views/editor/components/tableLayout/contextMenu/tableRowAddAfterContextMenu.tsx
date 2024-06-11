import { MenuItem, Submenu } from "@/components/menu";
import SubmenuIcon from "@/components/menu/submenuIcon";
import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { TABLE_ROW_ADD_AFTER_COMMAND } from "@editor/plugins/tableLayoutPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { NumberInputContextMenu } from "./numberInputContextMenu";

export function TableRowAddAfterContextMenu() {
  const [editor] = useLexicalComposerContext();
  const {
    editorTheme: {
      tableLayoutTheme: {
        menuTheme: { RowAddAfterIcon },
      },
    },
  } = useMainThemeContext();

  const onInputAccepted = (input: HTMLInputElement) => {
    const value = input.valueAsNumber;
    editor.dispatchCommand(TABLE_ROW_ADD_AFTER_COMMAND, value);
    $closeContextMenu(editor);
  };

  return (
    <Submenu className="">
      <MenuItem>
        <RowAddAfterIcon />
        <div>Insert Row After</div>
        <SubmenuIcon />
      </MenuItem>
      <NumberInputContextMenu onInputAccepted={onInputAccepted} />
    </Submenu>
  );
}
