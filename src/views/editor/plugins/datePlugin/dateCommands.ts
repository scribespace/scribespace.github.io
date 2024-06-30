import { $createAction } from "@systems/shortcutManager/action";
import { Shortcut, SpecialKey } from "@systems/shortcutManager/shortcut";
import { EDITOR_ACTION_SCOPE } from "../actionsPlugin/editorActions";
import { $createEditorCommand } from "../commandsPlugin/editorCommandManager";

export const DATE_INSERT_CMD = $createEditorCommand<void>("DATE_INSERT_CMD");
export const DATE_INSERT_ACTION = $createAction<void>( "DATE_INSERT_ACTION", EDITOR_ACTION_SCOPE, DATE_INSERT_CMD, undefined, new Shortcut('d', SpecialKey.Ctrl, SpecialKey.Meta), "Insert Date");
