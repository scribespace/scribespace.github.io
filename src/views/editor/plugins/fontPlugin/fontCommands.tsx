import { $createAction } from "@systems/shortcutManager/action";
import { Shortcut, SpecialKey } from "@systems/shortcutManager/shortcut";
import { Font } from "@utils";
import { TextFormatType } from "lexical";
import { EDITOR_ACTION_SCOPE } from "../actionsPlugin/editorActions";
import { $createEditorCommand } from "../commandsPlugin/editorCommandManager";
import { FORMAT_TEXT_CMD } from "../commandsPlugin/editorCommands";

export const CLEAR_FONT_STYLE_CMD = $createEditorCommand<void>("CLEAR_FONT_STYLE_CMD");

export const FONT_STYLE_RED_CMD = $createEditorCommand<void>("FONT_STYLE_RED_CMD");
export const FONT_STYLE_GREEN_CMD = $createEditorCommand<void>("FONT_STYLE_GREEN_CMD");
export const FONT_STYLE_BLUE_CMD = $createEditorCommand<void>("FONT_STYLE_BLUE_CMD");

export const INCREASE_FONT_SIZE_CMD = $createEditorCommand<void>("INCREASE_FONT_SIZE_CMD");
export const DECREASE_FONT_SIZE_CMD = $createEditorCommand<void>("DECREASE_FONT_SIZE_CMD");
export const SET_FONT_SIZE_CMD = $createEditorCommand<string>("SET_FONT_SIZE_CMD");
export const FONT_SIZE_CHANGED_CMD = $createEditorCommand<string>("FONT_SIZE_CHANGED_CMD");

export const SET_FONT_FAMILY_CMD = $createEditorCommand<string>("SET_FONT_FAMILY_CMD");
export const FONT_FAMILY_CHANGED_CMD = $createEditorCommand<Font>("FONT_FAMILY_CHANGED_CMD");

export const FONT_STYLE_RED_ACTION = $createAction<void>( "FONT_STYLE_RED_ACTION", EDITOR_ACTION_SCOPE, FONT_STYLE_RED_CMD, undefined, new Shortcut('r', SpecialKey.Alt), "Font Style Red");
export const FONT_STYLE_GREEN_ACTION = $createAction<void>( "FONT_STYLE_GREEN_ACTION", EDITOR_ACTION_SCOPE, FONT_STYLE_GREEN_CMD, undefined, new Shortcut('g', SpecialKey.Alt), "Font Style Green");
export const FONT_STYLE_BLUE_ACTION = $createAction<void>( "FONT_STYLE_BLUE_ACTION", EDITOR_ACTION_SCOPE, FONT_STYLE_BLUE_CMD, undefined, new Shortcut('b', SpecialKey.Alt), "Font Style Blue");

export const INCREASE_FONT_SIZE_ACTION = $createAction<void>( "INCREASE_FONT_SIZE_ACTION", EDITOR_ACTION_SCOPE, INCREASE_FONT_SIZE_CMD, undefined, new Shortcut('>', SpecialKey.Ctrl | SpecialKey.Shift, SpecialKey.Meta | SpecialKey.Shift), "Increase Font Size");
export const DECREASE_FONT_SIZE_ACTION = $createAction<void>( "DECREASE_FONT_SIZE_ACTION", EDITOR_ACTION_SCOPE, DECREASE_FONT_SIZE_CMD, undefined, new Shortcut('<', SpecialKey.Ctrl | SpecialKey.Shift, SpecialKey.Meta | SpecialKey.Shift), "Decrease Font Size");

export const FORMAT_BOLD_ACTION = $createAction<TextFormatType>( "FORMAT_BOLD_ACTION", EDITOR_ACTION_SCOPE, FORMAT_TEXT_CMD, "bold", new Shortcut('b', SpecialKey.Ctrl, SpecialKey.Meta), "Bold");
export const FORMAT_ITALIC_ACTION = $createAction<TextFormatType>( "FORMAT_ITALIC_ACTION", EDITOR_ACTION_SCOPE, FORMAT_TEXT_CMD, "italic", new Shortcut('i', SpecialKey.Ctrl, SpecialKey.Meta), "Italic");
export const FORMAT_UNDERLINE_ACTION = $createAction<TextFormatType>( "FORMAT_UNDERLINE_ACTION", EDITOR_ACTION_SCOPE, FORMAT_TEXT_CMD, "underline", new Shortcut('u', SpecialKey.Ctrl, SpecialKey.Meta), "Underline");
export const FORMAT_STRIKETHROUGH_ACTION = $createAction<TextFormatType>( "FORMAT_STRIKETHROUGH_ACTION", EDITOR_ACTION_SCOPE, FORMAT_TEXT_CMD, "strikethrough", new Shortcut('u', SpecialKey.Shift | SpecialKey.Ctrl, SpecialKey.Shift | SpecialKey.Meta), "Strikethrough");

export const CLEAR_FONT_STYLE_ACTION = $createAction<void>( "CLEAR_FONT_STYLE_ACTION", EDITOR_ACTION_SCOPE,CLEAR_FONT_STYLE_CMD, undefined, new Shortcut('/', SpecialKey.Ctrl, SpecialKey.Meta), "Clear Formatting");
