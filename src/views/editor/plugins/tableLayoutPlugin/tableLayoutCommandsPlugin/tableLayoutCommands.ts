import { EDITOR_ACTION_SCOPE } from "@editor/plugins/actionsPlugin/editorActions";
import { $createEditorCommand } from "@editor/plugins/commandsPlugin/editorCommandManager";
import { $createAction } from "@systems/shortcutManager/action";
import { SpecialKey, KEY_DELETE } from "@systems/shortcutManager/shortcut";

export interface InsertTablePayload {
    columns: number;
    rows: number;
}
export const TABLE_INSERT_CMD = $createEditorCommand<InsertTablePayload>("TABLE_INSERT_CMD");
export const TABLE_ROW_REMOVE_CMD = $createEditorCommand<void>("TABLE_ROW_REMOVE_CMD");
export const TABLE_ROW_ADD_BEFORE_CMD = $createEditorCommand<number>("TABLE_ROW_ADD_BEFORE_CMD");
export const TABLE_ROW_ADD_AFTER_CMD = $createEditorCommand<number>("TABLE_ROW_ADD_AFTER_CMD");
export const TABLE_LAYOUT_MERGE_CELLS_CMD = $createEditorCommand<void>("TABLE_LAYOUT_MERGE_CELLS_CMD");
export const TABLE_LAYOUT_SPLIT_CELLS_CMD = $createEditorCommand<void>("TABLE_LAYOUT_SPLIT_CELLS_CMD");
export const TABLE_LAYOUT_COLUMN_REMOVE_CMD = $createEditorCommand<void>("TABLE_LAYOUT_COLUMN_REMOVE_CMD");
export const TABLE_LAYOUT_COLUMN_ADD_BEFORE_CMD = $createEditorCommand<number>("TABLE_LAYOUT_COLUMN_ADD_BEFORE_CMD");
export const TABLE_LAYOUT_COLUMN_ADD_AFTER_CMD = $createEditorCommand<number>("TABLE_LAYOUT_COLUMN_ADD_AFTER_CMD");
export const TABLE_LAYOUT_REMOVE_SELECTED_CMD = $createEditorCommand<void>("TABLE_LAYOUT_REMOVE_SELECTED_CMD");
export const LAYOUT_INSERT_CMD = $createEditorCommand<number>("LAYOUT_INSERT_CMD");

export const TABLE_LAYOUT_COLUMN_ADD_BEFORE_ACTION = $createAction<number>("TABLE_LAYOUT_COLUMN_ADD_BEFORE_ACTION", EDITOR_ACTION_SCOPE, TABLE_LAYOUT_COLUMN_ADD_BEFORE_CMD, 1, { key: 'c', specialKeys: SpecialKey.Alt | SpecialKey.Shift }, "Add Columne Before");
export const TABLE_LAYOUT_COLUMN_ADD_AFTER_ACTION = $createAction<number>("TABLE_LAYOUT_COLUMN_ADD_AFTER_ACTION", EDITOR_ACTION_SCOPE, TABLE_LAYOUT_COLUMN_ADD_AFTER_CMD, 1, { key: 'c', specialKeys: SpecialKey.Alt }, "Add Columne After");
export const TABLE_LAYOUT_REMOVE_SELECTED_ACTION = $createAction<void>("TABLE_LAYOUT_REMOVE_SELECTED_ACTION", EDITOR_ACTION_SCOPE, TABLE_LAYOUT_REMOVE_SELECTED_CMD, undefined, { key: KEY_DELETE, specialKeys: SpecialKey.Shift }, "Remove Table/Layout");
export const LAYOUT_INSERT_ACTION = $createAction<number>("LAYOUT_INSERT_ACTION", EDITOR_ACTION_SCOPE, LAYOUT_INSERT_CMD, 2, { key: 'l', specialKeys: SpecialKey.Shift | SpecialKey.Ctrl }, "Insert Layout");
