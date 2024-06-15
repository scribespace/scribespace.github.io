import { $registerCommand } from "@systems/commandsManager/commandsManager";

export type DragDropListener = (files: File[]) => void;

export interface DragDropAddTypesListenerPayload {
  types: string[];
  listener: DragDropListener;
}
export const DRAG_DROP_ADD_TYPES_LISTENER_CMD = $registerCommand<DragDropAddTypesListenerPayload>("DRAG_DROP_ADD_TYPES_LISTENER_CMD");
