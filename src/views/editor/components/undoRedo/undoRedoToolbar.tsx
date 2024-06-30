import { useEffect, useMemo, useState } from "react";

import { MenuItem } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { CAN_REDO_CMD, CAN_UNDO_CMD, REDO_CMD, UNDO_CMD } from "@editor/plugins/commandsPlugin/editorCommands";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $callCommand, $registerCommandListener } from "@systems/commandsManager/commandsManager";

export default function UndoRedoToolbar() {
  const [editor] = useLexicalComposerContext();
  const { editorTheme }: MainTheme = useMainThemeContext();

  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  const [UndoIcon, RedoIcon] = useMemo(() => {
    return [
      editorTheme.undoRedoTheme.UndoIcon,
      editorTheme.undoRedoTheme.RedoIcon,
    ];
  }, [editorTheme.undoRedoTheme.UndoIcon, editorTheme.undoRedoTheme.RedoIcon]);

  useEffect(() => {
    if (editor) {
      return mergeRegister(
        $registerCommandListener(
          CAN_UNDO_CMD,
          (payload) => {
            setCanUndo(payload);
            return false;
          }
        ),
        $registerCommandListener(
          CAN_REDO_CMD,
          (payload) => {
            setCanRedo(payload);
            return false;
          }
        ),
      );
    }
  }, [editor]);

  const onClickUndo = () => {
    $callCommand(UNDO_CMD, undefined);
  };

  const onClickRedo = () => {
    $callCommand(REDO_CMD, undefined);
  };

  return (
    <>
      <MenuItem disabled={!canUndo} onClick={onClickUndo}>
        <UndoIcon />
      </MenuItem>
      <MenuItem disabled={!canRedo} onClick={onClickRedo}>
        <RedoIcon />
      </MenuItem>
    </>
  );
}
