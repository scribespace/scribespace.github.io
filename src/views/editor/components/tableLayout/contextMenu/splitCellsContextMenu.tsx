import { MenuItem } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { TABLE_LAYOUT_SPLIT_CELLS_COMMAND } from "@editor/plugins/tableLayoutPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export function SplitCellsContextMenu() {
  const [editor] = useLexicalComposerContext();
  const {
    editorTheme: {
      tableLayoutTheme: {
        menuTheme: { SplitCellIcon },
      },
    },
  } = useMainThemeContext();

  const onClick = () => {
      editor.dispatchCommand( TABLE_LAYOUT_SPLIT_CELLS_COMMAND, undefined);
      $closeContextMenu(editor);
  };

  return (
    <MenuItem onClick={onClick}>
      <SplitCellIcon />
      <div>Split Cells</div>
    </MenuItem>
  );
}
