import { $createAction } from "@systems/shortcutManager/action";
import { KEY_ENTER, SpecialKey } from "@systems/shortcutManager/shortcut";
import { EDITOR_ACTION_SCOPE } from "../actionsPlugin/editorActions";
import {$createEditorCommand } from "../commandsPlugin/editorCommandManager";

export const PAGE_BREAK_INSERT_CMD = $createEditorCommand<void>("PAGE_BREAK_INSERT_CMD");
export const PAGE_BREAK_CAN_INSERT_CMD = $createEditorCommand<boolean>("PAGE_BREAK_CAN_INSERT_CMD");

export const PAGE_BREAK_INSERT_ACTION = $createAction<void>("PAGE_BREAK_INSERT_ACTION", EDITOR_ACTION_SCOPE, PAGE_BREAK_INSERT_CMD, undefined, {key: KEY_ENTER, specialKeys: SpecialKey.Ctrl}, "Insert new page");
