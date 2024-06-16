import { SpecialKey } from "@systems/commandsManager/shortcut";
import { $registerEditorCommand } from "../commandsPlugin/commands";

export const LINK_CONVERT_SELECTED_CMD = $registerEditorCommand<void>("LINK_CONVERT_SELECTED_CMD", undefined, {key:'k', specialKeys: SpecialKey.Ctrl});
