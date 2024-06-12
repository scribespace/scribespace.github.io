import { LexicalCommand, createCommand } from "lexical";

export interface InsertTablePayload {
    columns: number;
    rows: number;
}
export const TABLE_INSERT_COMMAND: LexicalCommand<InsertTablePayload> = createCommand("TABLE_INSERT_COMMAND");
export const TABLE_ROW_REMOVE_COMMAND: LexicalCommand<void> = createCommand("TABLE_ROW_REMOVE_COMMAND");
export const TABLE_ROW_ADD_BEFORE_COMMAND: LexicalCommand<number> = createCommand("TABLE_ROW_ADD_BEFORE_COMMAND");
export const TABLE_ROW_ADD_AFTER_COMMAND: LexicalCommand<number> = createCommand("TABLE_ROW_ADD_AFTER_COMMAND");

export const TABLE_LAYOUT_MERGE_CELLS_COMMAND: LexicalCommand<void> = createCommand("TABLE_LAYOUT_MERGE_CELLS_COMMAND");
export const TABLE_LAYOUT_SPLIT_CELLS_COMMAND: LexicalCommand<void> = createCommand("TABLE_LAYOUT_SPLIT_CELLS_COMMAND");
export const TABLE_LAYOUT_COLUMN_REMOVE_COMMAND: LexicalCommand<void> = createCommand("TABLE_LAYOUT_COLUMN_REMOVE_COMMAND");
export const TABLE_LAYOUT_COLUMN_ADD_BEFORE_COMMAND: LexicalCommand<number> = createCommand("TABLE_LAYOUT_COLUMN_ADD_BEFORE_COMMAND");
export const TABLE_LAYOUT_COLUMN_ADD_AFTER_COMMAND: LexicalCommand<number> = createCommand("TABLE_LAYOUT_COLUMN_ADD_AFTER_COMMAND");
export const TABLE_LAYOUT_REMOVE_SELECTED_COMMAND: LexicalCommand<void> = createCommand("TABLE_LAYOUT_REMOVE_SELECTED_COMMAND");

export const LAYOUT_INSERT_COMMAND: LexicalCommand<number> = createCommand("LAYOUT_INSERT_COMMAND");
