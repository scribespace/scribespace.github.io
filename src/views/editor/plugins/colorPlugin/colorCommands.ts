import { $registerEditorCommand } from "../commandsPlugin/editorCommandManager";

export const SET_FONT_COLOR_CMD = $registerEditorCommand<string>("SET_FONT_COLOR_CMD");
export const SET_BACKGROUND_COLOR_CMD = $registerEditorCommand<string>("SET_BACKGROUND_COLOR_CMD");
export const FONT_COLOR_CHANGE_CMD = $registerEditorCommand<void>("FONT_COLOR_CHANGE_CMD");
export const BACKGROUND_COLOR_CHANGE_CMD = $registerEditorCommand<void>("BACKGROUND_COLOR_CHANGE_CMD");
