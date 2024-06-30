import { NodeApi } from "react-arborist";

export const TREE_FILE = "/tree";
export const TREE_DATA_VERSION = 0 as const;

export interface TreeNodeData {
  id: string;
  name: string;
  children: TreeNodeData[];
}
export type TreeNodeApi = NodeApi<TreeNodeData>;

export interface TreeNodeToNote {
  treeNodeID: string;
  noteID: string;
}

type TreeDataPreV = TreeNodeData[];
export interface TreeData {
  version: number;
  treeNodeLastID: number;
  treeNotesMap: TreeNodeToNote[];
  treeData: TreeNodeData[];
}

function convertToV0Children( treeToNoteMap: TreeNodeToNote[], treeNodeID: number, treeData: TreeNodeData[], oldTreeData: TreeDataPreV ) {

  for ( const oldTreeNode of oldTreeData ) {
    const newTreeNode: TreeNodeData = {id: (treeNodeID++).toString(), name: oldTreeNode.name, children: [] };
    treeToNoteMap.push( {treeNodeID: newTreeNode.id, noteID: oldTreeNode.id} );

    if ( oldTreeNode.children.length > 0 ) {
      treeNodeID = convertToV0Children( treeToNoteMap, treeNodeID, newTreeNode.children, oldTreeNode.children );
    }

    treeData.push( newTreeNode );
  }

  return treeNodeID;
}

async function convertToV0( oldTreeData: TreeDataPreV ): Promise<TreeData> {
  const treeData: TreeNodeData[] = [];
  const treeToNoteMap: TreeNodeToNote[] = [];
  const treeNodeID = convertToV0Children( treeToNoteMap, 0, treeData, oldTreeData );

  return {version: 0, treeNodeLastID: treeNodeID, treeNotesMap: treeToNoteMap, treeData};
}

export async function $treeConvertToLatest(oldTreeData: TreeDataPreV): Promise<TreeData> {
  return convertToV0(oldTreeData);
}
