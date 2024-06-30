import { $createCommand } from "@systems/commandsManager/commandsManager";

export const TREE_DATA_CHANGED_CMD = $createCommand("TREE_DATA_CHANGED_CMD");

export type TreeSelectionSrc = 'user' | 'history' | 'pageload';
export interface TreeSelectPayload {
    treeNodeID: string;
    commandSrc: TreeSelectionSrc;
}
export const TREE_SELECT_NOTE_CMD = $createCommand<TreeSelectPayload>('TREE_SELECT_NOTE_CMD');
export const TREE_PROCESS_START_NOTE_CMD = $createCommand<void>('TREE_PROCESS_START_NOTE_CMD');
