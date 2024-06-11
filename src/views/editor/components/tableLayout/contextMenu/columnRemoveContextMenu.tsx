import { MenuItem } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { TABLE_LAYOUT_COLUMN_REMOVE_COMMAND } from "@editor/plugins/tableLayoutPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export function ColumnRemoveContextMenu() {
  const [editor] = useLexicalComposerContext();
  const {
    editorTheme: {
      tableLayoutTheme: {
        menuTheme: { ColumnRemoveIcon },
      },
    },
  } = useMainThemeContext();

  const onClick = () => {
      editor.dispatchCommand(TABLE_LAYOUT_COLUMN_REMOVE_COMMAND, undefined);
      $closeContextMenu(editor);
  };

  return (
    <MenuItem onClick={onClick}>
      <ColumnRemoveIcon />
      <div>Remove Column</div>
    </MenuItem>
  );
}
