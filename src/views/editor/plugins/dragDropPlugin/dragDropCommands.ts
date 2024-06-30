import { $createEditorCommand } from "../commandsPlugin/editorCommandManager";

export type DragDropListener = (files: File[]) => void;

export interface DragDropAddTypesListenerPayload {
  types: string[];
  listener: DragDropListener;
}
export const EDITOR_DRAG_DROP_ADD_TYPES_LISTENER_CMD = $createEditorCommand<DragDropAddTypesListenerPayload>( "EDITOR_DRAG_DROP_ADD_TYPES_LISTENER_CMD");
