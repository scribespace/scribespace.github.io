import { SpecialKey } from "@systems/commandsManager/shortcut";
import { $registerEditorActionCommand } from "../commandsPlugin/editorCommandManager";

export const LINK_CONVERT_SELECTED_CMD = $registerEditorActionCommand<void>("LINK_CONVERT_SELECTED_CMD", undefined, {key:'k', specialKeys: SpecialKey.Ctrl }, undefined, "Toggle Link" );
