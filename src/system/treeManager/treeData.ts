import { $getFileSystem } from "@coreSystems";
import { FileUploadMode } from "@interfaces/system/fileSystem/fileSystemShared";
import { assert, variableExists } from "@utils";
import { NodeApi } from "react-arborist";

export const NOTES_PATH = "/notes/";
export const TREE_FILE = "/tree";

interface TreeNodeDataV0 {
  id: string;
  name: string;
  children: TreeNodeDataV0[];
}

export interface TreeNodeData {
  id: string;
  path: string;
  name: string;
  children: TreeNodeDataV0[];
}


export type TreeNodeApi = NodeApi<TreeNodeData>;

const TREE_DATA_VERSION = 0 as const;
export interface TreeData {
    version: number;
    data: TreeNodeData[];
}
export const EMPTY_TREE_DATA: TreeData = {version:-1, data:[]};

export async function uploadTreeData(treeData: TreeData) {
    assert( treeData.version === TREE_DATA_VERSION, 'TreeData wrong version' );

    const treeJSON = JSON.stringify(treeData);
    const treeBlob = new Blob([treeJSON]);
    return $getFileSystem().uploadFileAsync( TREE_FILE, { content: treeBlob }, FileUploadMode.Replace );
}

export async function loadTreeData( treeJSON: string ): Promise<TreeData> {
  let treeData = JSON.parse(treeJSON);

  if ( !variableExists(treeData.version) ) {
    treeData = await convertToV0(treeData);
    uploadTreeData(treeData);
  }

  return treeData;
}

export function createTreeData( treeNodes: TreeNodeData[] ): TreeData {
  return {version: TREE_DATA_VERSION, data: treeNodes};
}

async function convertNodeToV0( oldNode: TreeNodeDataV0 ): Promise<TreeNodeData> {
  const fileInfoPromise = $getFileSystem().getFileInfo(oldNode.id);

  const childrenPromises: Promise<TreeNodeData>[] = [];
  for ( const child of oldNode.children ) {
    childrenPromises.push( convertNodeToV0(child) );
  }

  const fileInfo = await fileInfoPromise;
  const children = await Promise.all(childrenPromises);

  assert( variableExists(fileInfo.fileInfo), "FileInfo undefiend" );

  return {
    ...oldNode,
    path: fileInfo.fileInfo!.path,
    children
  };
}

async function convertToV0( oldTreeData: TreeNodeDataV0[] ): Promise<TreeData> {
  const nodesPromises: Promise<TreeNodeData>[] = [];
  for ( const node of oldTreeData ) {
    nodesPromises.push(convertNodeToV0(node));
  }
  const treeNodes = await Promise.all(nodesPromises);

  return {version: 0, data: treeNodes};
}
