import { $createCommand } from "./commandsManager/commandsManager";

export const BLOCK_EDITING_CMD = $createCommand<void>('BLOCK_EDITING_CMD');
export const APP_GET_FOCUS = $createCommand<void>('APP_GET_FOCUS');