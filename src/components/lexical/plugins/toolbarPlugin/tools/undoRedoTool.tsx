import { CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_LOW, REDO_COMMAND, UNDO_COMMAND } from "lexical";
import { useEffect, useState } from "react";
import { ImUndo, ImRedo } from "react-icons/im";

import { ToolbarToolProps } from "./toolsProps";

export default function UndoRedoTool({editor} : ToolbarToolProps) {
        const [canUndo, setCanUndo] = useState<boolean>(false)
        const [canRedo, setCanRedo] = useState<boolean>(false)

        useEffect(() => {

            const removeUndoCommand = editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                setCanUndo(payload);
                return false;
                },
                COMMAND_PRIORITY_LOW
            )

            const removeRedoCommand = editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                setCanRedo(payload);
                return false;
                },
                COMMAND_PRIORITY_LOW
            )
            return () => {removeUndoCommand(); removeRedoCommand();}
        }, [])

        const onClickUndo = () => {
            editor.dispatchCommand(UNDO_COMMAND, undefined)
        }

        const onClickRedo = () => {
            editor.dispatchCommand(REDO_COMMAND, undefined)
        }

        return (
            <div>
                <ImUndo className={'item' + (canUndo ? '' : ' disabled')} onClick={onClickUndo}/>
                <ImRedo className={'item' + (canRedo ? '' : ' disabled')} onClick={onClickRedo}/>
            </div>
        )
    }