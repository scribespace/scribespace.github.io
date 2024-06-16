import { $callCommand } from "@systems/commandsManager/commandsManager";
import { EDITOR_CONTEXT_MENU_CLOSE_MENU_CMD } from "./contextMenuCommands";

export function $closeContextMenu() {
  $callCommand(EDITOR_CONTEXT_MENU_CLOSE_MENU_CMD, undefined);
}
