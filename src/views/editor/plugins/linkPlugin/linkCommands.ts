import { $createAction } from "@systems/shortcutManager/action";
import { Shortcut, SpecialKey } from "@systems/shortcutManager/shortcut";
import { EDITOR_ACTION_SCOPE } from "../actionsPlugin/editorActions";
import { $createEditorCommand } from "../commandsPlugin/editorCommandManager";

export const LINK_CONVERT_SELECTED_CMD = $createEditorCommand<void>("LINK_CONVERT_SELECTED_CMD");

export const LINK_CONVERT_SELECTED_ACTION = $createAction<void>("LINK_CONVERT_SELECTED_ACTION", EDITOR_ACTION_SCOPE, LINK_CONVERT_SELECTED_CMD, undefined, new Shortcut('k', SpecialKey.Ctrl, SpecialKey.Meta), "Toggle Link" );
