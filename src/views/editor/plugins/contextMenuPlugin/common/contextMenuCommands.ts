import { $registerCommand } from "@systems/commandsManager/commandsManager";
import { NO_SHORTCUT } from "@systems/commandsManager/shortcut";

export const CONTEXT_MENU_CLOSE_MENU_CMD = $registerCommand<void>( NO_SHORTCUT, undefined, "CONTEXT_MENU_CLOSE_MENU_CMD");
