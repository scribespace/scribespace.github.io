import { LexicalCommand, createCommand } from "lexical";

export type DragDropListener = (files: File[]) => void;

export interface DragDropAddTypesListenerPayload {
  types: string[];
  listener: DragDropListener;
}
export const DRAG_DROP_ADD_TYPES_LISTENER_COMMAND: LexicalCommand<DragDropAddTypesListenerPayload> =
  createCommand();
