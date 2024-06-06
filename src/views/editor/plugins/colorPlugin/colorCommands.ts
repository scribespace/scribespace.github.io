import { LexicalCommand, createCommand } from "lexical";

export const SET_FONT_COLOR_COMMAND: LexicalCommand<string> = createCommand();
export const SET_BACKGROUND_COLOR_COMMAND: LexicalCommand<string> =
  createCommand();
export const FONT_COLOR_CHANGE_COMMAND: LexicalCommand<void> = createCommand();
export const BACKGROUND_COLOR_CHANGE_COMMAND: LexicalCommand<void> =
  createCommand();
