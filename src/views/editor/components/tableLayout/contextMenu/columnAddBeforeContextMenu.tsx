import { MenuItem, Submenu } from "@/components/menu";
import SubmenuIcon from "@/components/menu/submenuIcon";
import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { TABLE_LAYOUT_COLUMN_ADD_BEFORE_COMMAND } from "@editor/plugins/tableLayoutPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { NumberInputContextMenu } from "./numberInputContextMenu";

export function ColumnAddBeforeContextMenu() {
  const [editor] = useLexicalComposerContext();
  const {
    editorTheme: {
      tableLayoutTheme: {
        menuTheme: { ColumnAddBeforeIcon },
      },
    },
  } = useMainThemeContext();

  const onInputAccepted = (input: HTMLInputElement) => {
    const value = input.valueAsNumber;
    editor.dispatchCommand( TABLE_LAYOUT_COLUMN_ADD_BEFORE_COMMAND, value );
    $closeContextMenu(editor);
  };

  return (
    <Submenu className="">
      <MenuItem>
        <ColumnAddBeforeIcon />
        <div>Insert Column Before</div>
        <SubmenuIcon />
      </MenuItem>
      <NumberInputContextMenu onInputAccepted={onInputAccepted} />
    </Submenu>
  );
}
