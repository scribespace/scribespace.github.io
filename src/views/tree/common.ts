import { NodeApi } from "react-arborist";

export const NOTES_PATH = '/notes/';
export const TREE_FILE = '/tree';
export const TREE_STATUS_FILE = '/tree_status';

export interface NodeData {
    id: string;
    name: string;
    children: NodeData[];
}

export type TreeNodeApi = NodeApi<NodeData>;
