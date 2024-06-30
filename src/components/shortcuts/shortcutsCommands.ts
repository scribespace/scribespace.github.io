import { UNDO_CMD, REDO_CMD } from "@editor/plugins/commandsPlugin/editorCommands";
import { $createCommand } from "@systems/commandsManager/commandsManager";
import { $createAction, GLOBAL_ACTION_SCOPE } from "@systems/shortcutManager/action";
import { KEY_ESCAPE, Shortcut, SpecialKey } from "@systems/shortcutManager/shortcut";

export const SHORTCUTS_OPEN_DIALOG_CMD = $createCommand<void>("SHORTCUTS_OPEN_DIALOG_CMD");
export const CLOSE_ALL_WINDOWS_CMD = $createCommand<void>("CLOSE_ALL_WINDOWS_CMD");

export const SHORTCUTS_OPEN_DIALOG_ACTION = $createAction<void>("SHORTCUTS_OPEN_DIALOG_ACTION", GLOBAL_ACTION_SCOPE, SHORTCUTS_OPEN_DIALOG_CMD, undefined, {key:'h', specialKeys: SpecialKey.Alt}, "Shortcuts" );
export const CLOSE_ALL_WINDOWS_ACTION = $createAction<void>("CLOSE_ALL_WINDOWS_ACTION", GLOBAL_ACTION_SCOPE, CLOSE_ALL_WINDOWS_CMD, undefined, {key:KEY_ESCAPE, specialKeys: SpecialKey.None}, "Close All Windows" );
export const UNDO_ACTION = $createAction<void>("UNDO_ACTION", GLOBAL_ACTION_SCOPE, UNDO_CMD, undefined, new Shortcut('z', SpecialKey.Ctrl, SpecialKey.Meta), "Undo" );
export const REDO_ACTION = $createAction<void>("REDO_ACTION", GLOBAL_ACTION_SCOPE, REDO_CMD, undefined, new Shortcut('z', SpecialKey.Shift | SpecialKey.Ctrl, SpecialKey.Shift | SpecialKey.Meta), "Redo" );
