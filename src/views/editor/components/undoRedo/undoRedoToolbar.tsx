import { CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_LOW, REDO_COMMAND, UNDO_COMMAND } from "lexical";
import { useEffect, useMemo, useState } from "react";

import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { useToolbarContext } from "@editor/plugins/toolbarPlugin/context";
import { MenuItem } from "../menu";
import { mergeRegister } from "@lexical/utils";

export default function UndoRedoToolbar() {
    const {editor} = useToolbarContext();
    const {editorTheme}: MainTheme = useMainThemeContext();

    const [canUndo, setCanUndo] = useState<boolean>(false);
    const [canRedo, setCanRedo] = useState<boolean>(false);

    const [UndoIcon, RedoIcon] = useMemo(()=> {
        return [editorTheme.undoRedoTheme.UndoIcon, editorTheme.undoRedoTheme.RedoIcon];
    },[editorTheme.undoRedoTheme.UndoIcon, editorTheme.undoRedoTheme.RedoIcon]);

    useEffect(() => {
        if ( editor ) {
            return mergeRegister(
                editor.registerCommand(
                    CAN_UNDO_COMMAND,
                    (payload) => {
                    setCanUndo(payload);
                    return false;
                    },
                    COMMAND_PRIORITY_LOW
                ),
                editor.registerCommand(
                    CAN_REDO_COMMAND,
                    (payload) => {
                    setCanRedo(payload);
                    return false;
                    },
                    COMMAND_PRIORITY_LOW
            ));
        }
    }, [editor]);

    const onClickUndo = () => {
        editor.dispatchCommand(UNDO_COMMAND, undefined);
    };

    const onClickRedo = () => {
        editor.dispatchCommand(REDO_COMMAND, undefined);
    };

    return (
        <>
            <MenuItem disabled={!canUndo} onClick={onClickUndo}>
                <UndoIcon/>
            </MenuItem>
            <MenuItem disabled={!canRedo} onClick={onClickRedo}>
                <RedoIcon/>
            </MenuItem>
        </>
    );
}