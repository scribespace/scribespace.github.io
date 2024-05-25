import { IconType } from "react-icons";
import { ImRedo, ImUndo } from "react-icons/im";
import { Icon } from "@/components/icon";

export interface UndoRedoTheme {
    UndoIcon: IconType;
    RedoIcon: IconType;
}

export const UNDO_REDO_THEME_DEFAULT: UndoRedoTheme = {
    UndoIcon: Icon( ImUndo ),
    RedoIcon: Icon( ImRedo ),
};