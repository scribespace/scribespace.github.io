import { $registerCommand } from "@systems/commandsManager/commandsManager";
import { NO_SHORTCUT } from "@systems/commandsManager/shortcut";

export type DragDropListener = (files: File[]) => void;

export interface DragDropAddTypesListenerPayload {
  types: string[];
  listener: DragDropListener;
}
export const DRAG_DROP_ADD_TYPES_LISTENER_CMD = $registerCommand<DragDropAddTypesListenerPayload>( NO_SHORTCUT, undefined, "DRAG_DROP_ADD_TYPES_LISTENER_CMD");
