import { MenuItem } from "@/components/menu";
import { $menuItemParent } from "@/components/menu/theme";
import { useMainThemeContext } from "@/mainThemeContext";
import { SELECTION_CHANGE_CMD } from "@editor/plugins/commandsPlugin/commands";
import { LINK_CONVERT_SELECTED_CMD } from "@editor/plugins/linkPlugin/linkCommands";
import { $isLinkNode } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $callCommand, $registerCommandListener } from "@systems/commandsManager/commandsManager";
import {
  $getSelection,
  $isRangeSelection
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
    $callCommand(LINK_CONVERT_SELECTED_CMD, undefined);
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

    return $registerCommandListener(
      SELECTION_CHANGE_CMD,
      () => {
        updateState();
        return false;
      }
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
