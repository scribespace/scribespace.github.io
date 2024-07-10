import { $throwError, ErrorObject } from "@/utils/error/error";
import { ErrorCode } from "@/utils/error/errorCodes";
import { $appReload } from "@systems/environment/environmentEvents";
import { $deserialize, $serialize } from "@systems/serializer/serializer";
import { assert, variableExists, variableExistsOrThrow } from "@utils";
import { NodeApi, SimpleTree } from "react-arborist";

export const TREE_DATA_VERSION = 1 as const;

export interface TreeNodeData {
  id: string;
  name: string;
  children: TreeNodeData[];
}
export type TreeNodeApi = NodeApi<TreeNodeData>;

export interface SerializedTreeNodeToNote {
  treeNodeID: string;
  noteID: string;
}

type SerializedTreeDataPreV = TreeNodeData[];
export interface SerializedTreeData {
  version: number;
  treeNodeLastID: number;
  treeNotesMap: SerializedTreeNodeToNote[];
  treeNodes: TreeNodeData[];
}

export class TreeData {
  private __tree: SimpleTree<TreeNodeData> = new SimpleTree<TreeNodeData>([]);
  private __nodeToNote: Map<string, string> = new Map();
  private __lastID: number = 0;

  private clear() {
    this.__tree = new SimpleTree<TreeNodeData>([]);
    this.__nodeToNote = new Map();
    this.__lastID = 0;
  }

  serialize(): SerializedTreeData {
    const nodeToNoteArray = Array.from(this.__nodeToNote);
    const serializedMap: SerializedTreeNodeToNote[] = [];
    for ( const entry of nodeToNoteArray ) {
      serializedMap.push( {treeNodeID: entry[0], noteID: entry[1]} );
    }

    const serializedTree: SerializedTreeData = { 
      version: TREE_DATA_VERSION, 
      treeNodeLastID: this.__lastID, 
      treeNotesMap: serializedMap, 
      treeNodes: this.__tree.data
    };

    return serializedTree;
  }

  export(): Uint8Array {
    const serializedTree = this.serialize();

    return $serialize( serializedTree );
  }

  private convertToV0Children( treeToNoteMap: SerializedTreeNodeToNote[], treeNodeID: number, treeData: TreeNodeData[], oldTreeData: SerializedTreeDataPreV ) {

    for ( const oldTreeNode of oldTreeData ) {
      const newTreeNode: TreeNodeData = {id: (treeNodeID++).toString(), name: oldTreeNode.name, children: [] };
      treeToNoteMap.push( {treeNodeID: newTreeNode.id, noteID: oldTreeNode.id} );
  
      if ( oldTreeNode.children.length > 0 ) {
        treeNodeID = this.convertToV0Children( treeToNoteMap, treeNodeID, newTreeNode.children, oldTreeNode.children );
      }
  
      treeData.push( newTreeNode );
    }
  
    return treeNodeID;
  }
  
  private async convertToV0( oldTreeData: SerializedTreeDataPreV ): Promise<SerializedTreeData> {
    const treeNodes: TreeNodeData[] = [];
    const treeToNoteMap: SerializedTreeNodeToNote[] = [];
    const treeNodeID = this.convertToV0Children( treeToNoteMap, 0, treeNodes, oldTreeData );
  
    return {version: 0, treeNodeLastID: treeNodeID, treeNotesMap: treeToNoteMap, treeNodes};
  }

  private async convertToV1(treeV0: SerializedTreeData): Promise<SerializedTreeData> {
    return {...treeV0, version: TREE_DATA_VERSION};
  }
  
  private async treeConvertToLatest(treeBuffer: ArrayBuffer): Promise<SerializedTreeData> {
    let treeData = JSON.parse( new TextDecoder().decode(treeBuffer) );

    if ( !variableExists(treeData.version) ) {
      treeData = await this.convertToV0(treeData);
    }

    return this.convertToV1(treeData);
  }

  async import(treeBytes: ArrayBuffer): Promise<boolean> {
    this.clear();

    let needsSaving = false;

    let treeData: SerializedTreeData;
    try {
      treeData = $deserialize( new Uint8Array(treeBytes) ) as SerializedTreeData;
    } catch (error) {
      const errorObject = error as ErrorObject;
      if ( errorObject.errorCode === ErrorCode.Deserializer_MissingType ) {
        treeData = await this.treeConvertToLatest(treeBytes);  
        needsSaving = true;
      } else {
        $throwError( ErrorCode.Deserializer_UnknownError );
      }
    }

    if ( variableExists(treeData.version) && TREE_DATA_VERSION < treeData.version ) {
      $appReload();
      return false;
    }

    const serializedTreeData = treeData as SerializedTreeData;
    assert( serializedTreeData.version === TREE_DATA_VERSION, 'Wrong tree version' );

    this.__lastID = serializedTreeData.treeNodeLastID;
    this.__tree = new SimpleTree<TreeNodeData>(serializedTreeData.treeNodes);
    for ( const entry of serializedTreeData.treeNotesMap ) {
      this.__nodeToNote.set( entry.treeNodeID, entry.noteID );
    }

    return needsSaving;
  }

  moveNodes(dragIds: string[], parentId: null | string, index: number ) {
    for (const id of dragIds) {
      this.__tree.move({ id, parentId: parentId, index: index });
    }
  }

  renameNode(id: string, name: string) {
      this.__tree.update({ id, changes: { name } as TreeNodeData });
  }

  createNode(parentId: string | null, index: number, noteID: string) {
      const node = { id: (this.__lastID++).toString(), name: "New File", children: [] } as TreeNodeData;
      this.__nodeToNote.set(node.id, noteID);
      this.__tree.create({ parentId, index, data: node });
      return node;
  }

  deleteNode(id: string) {
      this.__tree.drop({ id });
      this.__nodeToNote.delete(id);
  }

  treeIDToNoteID(treeID: string): string {
    const noteID = this.__nodeToNote.get(treeID);
    variableExistsOrThrow(noteID, 'TreeID without NoteID');
    return noteID;
  }

  updateNoteID( treeID: string, newNoteID: string ) {
    this.__nodeToNote.set(treeID, newNoteID);
  }

  get data() { return this.__tree.data; }
}
