import { MenuItem } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { TABLE_ROW_REMOVE_COMMAND } from "@editor/plugins/tableLayoutPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export function TableRowRemoveContextMenu() {
  const [editor] = useLexicalComposerContext();
  const {
    editorTheme: {
      tableLayoutTheme: {
        menuTheme: { RowRemoveIcon },
      },
    },
  } = useMainThemeContext();

  const onClick = () => {
      editor.dispatchCommand( TABLE_ROW_REMOVE_COMMAND, undefined );
      $closeContextMenu(editor);
  };

  return (
    <MenuItem onClick={onClick}>
      <RowRemoveIcon />
      <div>Remove Row</div>
    </MenuItem>
  );
}
