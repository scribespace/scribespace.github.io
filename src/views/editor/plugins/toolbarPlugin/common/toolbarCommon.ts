import { $callCommand } from "@systems/commandsManager/commandsManager";
import { TOOLBAR_CLOSE_MENU_CMD } from "./toolbarCommands";

export function $closeToolbarMenu() {
  $callCommand(TOOLBAR_CLOSE_MENU_CMD, undefined);
}
