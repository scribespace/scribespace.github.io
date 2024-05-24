import { LexicalCommand, createCommand } from "lexical";

export const CLEAR_FONT_STYLE_COMMAND: LexicalCommand<void> = createCommand();
export const INCREASE_FONT_SIZE_COMMAND: LexicalCommand<void> = createCommand();
export const DECREASE_FONT_SIZE_COMMAND: LexicalCommand<void> = createCommand();
export const SET_FONT_SIZE_COMMAND: LexicalCommand<string> = createCommand();
export const FONT_SIZE_CHANGED_COMMAND: LexicalCommand<void> = createCommand();