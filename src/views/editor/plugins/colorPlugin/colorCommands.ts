import { LexicalCommand, createCommand } from "lexical";

export const SET_FONT_COLOR_COMMAND: LexicalCommand<string> = createCommand("SET_FONT_COLOR_COMMAND");
export const SET_BACKGROUND_COLOR_COMMAND: LexicalCommand<string> = createCommand("SET_BACKGROUND_COLOR_COMMAND");
export const FONT_COLOR_CHANGE_COMMAND: LexicalCommand<void> = createCommand("FONT_COLOR_CHANGE_COMMAND");
export const BACKGROUND_COLOR_CHANGE_COMMAND: LexicalCommand<void> = createCommand("BACKGROUND_COLOR_CHANGE_COMMAND");
