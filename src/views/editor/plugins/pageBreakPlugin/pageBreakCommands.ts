import { $registerEditorCommand } from "../commandsPlugin/editorCommandManager";


export const PAGE_BREAK_INSERT_CMD = $registerEditorCommand<void>("PAGE_BREAK_INSERT_CMD");
export const PAGE_BREAK_CAN_INSERT_CMD = $registerEditorCommand<boolean>("PAGE_BREAK_CAN_INSERT_CMD");
