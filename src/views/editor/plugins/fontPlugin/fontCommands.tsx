import { LexicalCommand, createCommand } from "lexical";

export const CLEAR_FONT_STYLE_COMMAND: LexicalCommand<void> = createCommand("CLEAR_FONT_STYLE_COMMAND");

export const INCREASE_FONT_SIZE_COMMAND: LexicalCommand<void> = createCommand("INCREASE_FONT_SIZE_COMMAND");
export const DECREASE_FONT_SIZE_COMMAND: LexicalCommand<void> = createCommand("DECREASE_FONT_SIZE_COMMAND");
export const SET_FONT_SIZE_COMMAND: LexicalCommand<string> = createCommand("SET_FONT_SIZE_COMMAND");
export const FONT_SIZE_CHANGED_COMMAND: LexicalCommand<void> = createCommand("FONT_SIZE_CHANGED_COMMAND");

export const SET_FONT_FAMILY_COMMAND: LexicalCommand<string> = createCommand("SET_FONT_FAMILY_COMMAND");
export const FONT_FAMILY_CHANGED_COMMAND: LexicalCommand<string> = createCommand("FONT_FAMILY_CHANGED_COMMAND");
