import { $createCommand } from "@systems/commandsManager/commandsManager";

export const NOTES_LOAD_CMD = $createCommand<string>('NOTES_LOAD_CMD');
export const NOTE_CONVERTED_CMD = $createCommand<void>('NOTE_CONVERTED_CMD');

export const NOTES_CREATING_META_CMD = $createCommand<void>('NOTES_CREATING_META_CMD');

export interface NoteConvertingInfo {
    id: number;
    max: number;
}
export const NOTES_CONVERTING_CMD = $createCommand<NoteConvertingInfo>('NOTES_CONVERTING_CMD');
export const NOTES_FINISH_CONVERTING_CMD = $createCommand<void>('NOTES_FINISH_CONVERTING_CMD');