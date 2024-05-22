import { NodeApi } from "react-arborist";

export const NOTES_PATH = '/notes/';
export const TREE_FILE = '/tree';
export const TREE_STATUS_FILE = '/tree_status';

export interface TreeNodeData {
    id: string;
    name: string;
    children: TreeNodeData[];
}

export type TreeNodeApi = NodeApi<TreeNodeData>;
