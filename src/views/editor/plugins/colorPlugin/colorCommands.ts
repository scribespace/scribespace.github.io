import { $createEditorCommand } from "../commandsPlugin/editorCommandManager";

export const SET_FONT_COLOR_CMD = $createEditorCommand<string>("SET_FONT_COLOR_CMD");
export const SET_BACKGROUND_COLOR_CMD = $createEditorCommand<string>("SET_BACKGROUND_COLOR_CMD");
export const FONT_COLOR_CHANGE_CMD = $createEditorCommand<void>("FONT_COLOR_CHANGE_CMD");
export const BACKGROUND_COLOR_CHANGE_CMD = $createEditorCommand<void>("BACKGROUND_COLOR_CHANGE_CMD");
