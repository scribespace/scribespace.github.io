import { LexicalCommand, createCommand } from "lexical";

export interface InsertTablePayload {
    columns: number;
    rows: number;
}
export const TABLE_INSERT_COMMAND: LexicalCommand<InsertTablePayload> = createCommand();
export const TABLE_ROW_REMOVE_COMMAND: LexicalCommand<void> = createCommand();
export const TABLE_ROW_ADD_BEFORE_COMMAND: LexicalCommand<number> = createCommand();
export const TABLE_ROW_ADD_AFTER_COMMAND: LexicalCommand<number> = createCommand();

export const TABLE_LAYOUT_MERGE_CELLS_COMMAND: LexicalCommand<void> = createCommand();
export const TABLE_LAYOUT_SPLIT_CELLS_COMMAND: LexicalCommand<void> = createCommand();
export const TABLE_LAYOUT_COLUMN_REMOVE_COMMAND: LexicalCommand<void> = createCommand();
export const TABLE_LAYOUT_COLUMN_ADD_BEFORE_COMMAND: LexicalCommand<number> = createCommand();
export const TABLE_LAYOUT_COLUMN_ADD_AFTER_COMMAND: LexicalCommand<number> = createCommand();
export const TABLE_LAYOUT_REMOVE_SELECTED_COMMAND: LexicalCommand<void> = createCommand();

export const LAYOUT_INSERT_COMMAND: LexicalCommand<number> = createCommand();
