import { MenuItem } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { TABLE_LAYOUT_REMOVE_SELECTED_COMMAND } from "@editor/plugins/tableLayoutPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export function DeleteContextMenu() {
  const [editor] = useLexicalComposerContext();
  const {
    editorTheme: {
      tableLayoutTheme: {
        menuTheme: { DeleteIcon },
      },
    },
  } = useMainThemeContext();

  const onClick = () => {
    editor.dispatchCommand(TABLE_LAYOUT_REMOVE_SELECTED_COMMAND, undefined);
    $closeContextMenu(editor);
  };

  return (
    <MenuItem onClick={onClick}>
      <DeleteIcon />
      <div>Delete</div>
    </MenuItem>
  );
}
