import { $registerEditorActionCommand, $registerEditorCommand } from "@editor/plugins/commandsPlugin/editorCommandManager";
import { KEY_DELETE, SpecialKey } from "@systems/commandsManager/shortcut";

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
export const TABLE_LAYOUT_COLUMN_ADD_BEFORE_CMD = $registerEditorActionCommand<number>("TABLE_LAYOUT_COLUMN_ADD_BEFORE_CMD", undefined, {key:'c', specialKeys: SpecialKey.Alt | SpecialKey.Shift}, 1, "Add columne before");
export const TABLE_LAYOUT_COLUMN_ADD_AFTER_CMD = $registerEditorActionCommand<number>("TABLE_LAYOUT_COLUMN_ADD_AFTER_CMD", undefined, {key:'c', specialKeys: SpecialKey.Alt}, 1, "Add columne after");
export const TABLE_LAYOUT_REMOVE_SELECTED_CMD = $registerEditorActionCommand<void>("TABLE_LAYOUT_REMOVE_SELECTED_CMD", undefined, {key:KEY_DELETE, specialKeys: SpecialKey.Shift}, undefined, "Remove table/layout");
export const LAYOUT_INSERT_CMD = $registerEditorActionCommand<number>("LAYOUT_INSERT_CMD", undefined, {key:'l', specialKeys: SpecialKey.Shift | SpecialKey.Ctrl}, 2, "Insert layout");
