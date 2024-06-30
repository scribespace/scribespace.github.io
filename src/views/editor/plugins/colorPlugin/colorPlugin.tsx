import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $patchStyleText } from "@lexical/selection";
import { $isTableCellNode, $isTableSelection } from "@lexical/table";
import { mergeRegister } from "@lexical/utils";
import { $callCommand, $registerCommandListener } from "@systems/commandsManager/commandsManager";
import {
  $getSelection,
  $isRangeSelection
} from "lexical";
import { useEffect } from "react";
import {
  BACKGROUND_COLOR_CHANGE_CMD,
  FONT_COLOR_CHANGE_CMD,
  SET_BACKGROUND_COLOR_CMD,
  SET_FONT_COLOR_CMD,
} from "./colorCommands";

export function ColorPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      $registerCommandListener(
        SET_FONT_COLOR_CMD,
        (color: string) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, { color: color });
            $callCommand(FONT_COLOR_CHANGE_CMD, undefined);
          }
        },
      ),
      $registerCommandListener(
        SET_BACKGROUND_COLOR_CMD,
        (color: string) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, { "background-color": color });
            $callCommand(BACKGROUND_COLOR_CHANGE_CMD, undefined);
          } else if ($isTableSelection(selection)) {
            selection.getNodes().forEach((cellNode) => {
              if ($isTableCellNode(cellNode)) {
                cellNode.setBackgroundColor(color);
              }
            });
          }
        },
      ),
    );
  }, [editor]);

  return null;
}
