import { $callCommand } from "@systems/commandsManager/commandsManager";
import { CONTEXT_MENU_CLOSE_MENU_CMD } from "./contextMenuCommands";

export function $closeContextMenu() {
  $callCommand(CONTEXT_MENU_CLOSE_MENU_CMD, undefined);
}
