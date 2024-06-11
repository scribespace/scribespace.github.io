import { MenuItem } from "@/components/menu";
import { $menuItemParent } from "@/components/menu/theme";
import { useMainThemeContext } from "@/mainThemeContext";
import { LINK_CONVERT_SELECTED_COMMAND } from "@editor/plugins/linkPlugin";
import { $isLinkNode } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND
} from "lexical";
import { useEffect, useState } from "react";
import { useToolbarContext } from "../../plugins/toolbarPlugin/context";

export function LinkToolbar() {
  const [editor] = useLexicalComposerContext();
  const {
    theme: { itemSelected },
  } = useToolbarContext();
  const {
    editorTheme: {
      linkTheme: { LinkIcon },
    },
  } = useMainThemeContext();
  const [isLinkSelected, setIsLinkSelected] = useState<boolean>(false);

  function onClick(e: React.MouseEvent) {
    editor.dispatchCommand(LINK_CONVERT_SELECTED_COMMAND, undefined);
    e.preventDefault();
  }

  useEffect(() => {
    function updateState() {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const nodes = selection.getNodes();

          let allLinkNode = true;
          const nodeParent = nodes[0].getParent();
          const isParentLinkNode = $isLinkNode(nodeParent);
          for (const node of nodes) {
            allLinkNode =
              allLinkNode && isParentLinkNode && node.getParent() == nodeParent;
          }

          setIsLinkSelected(allLinkNode);
        }
      });
    }

    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateState();
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  return (
    <div className={isLinkSelected ? itemSelected : ""} style={$menuItemParent}>
      <MenuItem onClick={onClick}>
        <LinkIcon />
      </MenuItem>
    </div>
  );
}
