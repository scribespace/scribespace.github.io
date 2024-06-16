import { $registerEditorCommand } from "@editor/plugins/commandsPlugin/editorCommandManager";

export interface InsertTablePayload {
    columns: number;
    rows: number;
}
export const TABLE_INSERT_CMD = $registerEditorCommand<InsertTablePayload>("TABLE_INSERT_CMD");
export const TABLE_ROW_REMOVE_CMD = $registerEditorCommand<void>("TABLE_ROW_REMOVE_CMD");
export const TABLE_ROW_ADD_BEFORE_CMD = $registerEditorCommand<number>("TABLE_ROW_ADD_BEFORE_CMD");
export const TABLE_ROW_ADD_AFTER_CMD = $registerEditorCommand<number>("TABLE_ROW_ADD_AFTER_CMD");
export const TABLE_LAYOUT_MERGE_CELLS_CMD = $registerEditorCommand<void>("TABLE_LAYOUT_MERGE_CELLS_CMD");
export const TABLE_LAYOUT_SPLIT_CELLS_CMD = $registerEditorCommand<void>("TABLE_LAYOUT_SPLIT_CELLS_CMD");
export const TABLE_LAYOUT_COLUMN_REMOVE_CMD = $registerEditorCommand<void>("TABLE_LAYOUT_COLUMN_REMOVE_CMD");
export const TABLE_LAYOUT_COLUMN_ADD_BEFORE_CMD = $registerEditorCommand<number>("TABLE_LAYOUT_COLUMN_ADD_BEFORE_CMD");
export const TABLE_LAYOUT_COLUMN_ADD_AFTER_CMD = $registerEditorCommand<number>("TABLE_LAYOUT_COLUMN_ADD_AFTER_CMD");
export const TABLE_LAYOUT_REMOVE_SELECTED_CMD = $registerEditorCommand<void>("TABLE_LAYOUT_REMOVE_SELECTED_CMD");
export const LAYOUT_INSERT_CMD = $registerEditorCommand<number>("LAYOUT_INSERT_CMD");
