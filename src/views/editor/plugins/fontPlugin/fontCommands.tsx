import { Font } from "@utils";
import { $registerEditorCommand } from "../commandsPlugin/commands";

export const CLEAR_FONT_STYLE_CMD = $registerEditorCommand<void>("CLEAR_FONT_STYLE_CMD");

export const INCREASE_FONT_SIZE_CMD = $registerEditorCommand<void>("INCREASE_FONT_SIZE_CMD");
export const DECREASE_FONT_SIZE_CMD = $registerEditorCommand<void>("DECREASE_FONT_SIZE_CMD");
export const SET_FONT_SIZE_CMD = $registerEditorCommand<string>("SET_FONT_SIZE_CMD");
export const FONT_SIZE_CHANGED_CMD = $registerEditorCommand<string>("FONT_SIZE_CHANGED_CMD");

export const SET_FONT_FAMILY_CMD = $registerEditorCommand<string>("SET_FONT_FAMILY_CMD");
export const FONT_FAMILY_CHANGED_CMD = $registerEditorCommand<Font>("FONT_FAMILY_CHANGED_CMD");
