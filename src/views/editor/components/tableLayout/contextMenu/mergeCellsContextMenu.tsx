import { MenuItem } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { TABLE_LAYOUT_MERGE_CELLS_COMMAND } from "@editor/plugins/tableLayoutPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export function MergeCellsContextMenu() {
  const [editor] = useLexicalComposerContext();
  const {
    editorTheme: {
      tableLayoutTheme: {
        menuTheme: { MergeCellIcon },
      },
    },
  } = useMainThemeContext();

  const onClick = () => {
        editor.dispatchCommand(TABLE_LAYOUT_MERGE_CELLS_COMMAND, undefined);
        $closeContextMenu(editor);
  };

  return (
    <MenuItem onClick={onClick}>
      <MergeCellIcon />
      <div>Merge Cells</div>
    </MenuItem>
  );
}
