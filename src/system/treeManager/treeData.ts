import { $getFileSystem } from "@coreSystems";
import { FileSystemStatus, FileUploadMode } from "@interfaces/system/fileSystem/fileSystemShared";
import { assert, variableExists } from "@utils";
import { NodeApi } from "react-arborist";

export const TREE_FILE = "/tree";

export interface TreeNodeData {
  id: string;
  name: string;
  children: TreeNodeData[];
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
    const infoResult = await $getFileSystem().uploadFileAsync( TREE_FILE, treeBlob, FileUploadMode.Replace );
    assert( infoResult.status === FileSystemStatus.Success, `Tree didn't upload` );
    return infoResult.fileInfo!;
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

async function convertToV0( oldTreeData: TreeNodeData[] ): Promise<TreeData> {
  return {version: 0, data: oldTreeData};
}
