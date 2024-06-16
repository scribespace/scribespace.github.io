import { KEY_ENTER, SpecialKey } from "@systems/commandsManager/shortcut";
import { $registerEditorActionCommand, $registerEditorCommand } from "../commandsPlugin/editorCommandManager";


export const PAGE_BREAK_INSERT_CMD = $registerEditorActionCommand<void>("PAGE_BREAK_INSERT_CMD", undefined, {key: KEY_ENTER, specialKeys: SpecialKey.Ctrl}, undefined, "Insert new page");
export const PAGE_BREAK_CAN_INSERT_CMD = $registerEditorCommand<boolean>("PAGE_BREAK_CAN_INSERT_CMD");
