import { FileSystemStatus, FileUploadMode } from "@interfaces/system/fileSystem/fileSystemShared";
import { $callCommand } from "@systems/commandsManager/commandsManager";
import { NOTES_LOAD_CMD } from "@systems/notesManager/notesCommands";
import { $getStreamManager } from "@systems/streamManager/streamManager";
import { assert, notNullOrThrow, notNullOrThrowDev, variableExists, variableExistsOrThrow } from "@utils";
import { SimpleTree } from "react-arborist";
import { TREE_DATA_CHANGED_CMD } from "./treeCommands";
import { $treeConvertToLatest, TREE_DATA_VERSION, TREE_FILE, TreeData, TreeNodeData, TreeNodeToNote } from "./treeData";
import { loadTreeStatus, storeTreeStatus } from "./treeStatus";

class TreeManager {
    private __tree: SimpleTree<TreeNodeData> = new SimpleTree<TreeNodeData>([]);
    private __treeIDToNoteIDMap: Map<string, string> = new Map();
    private __treeIDLatest: number = 0;

    private __treeStatus: string[] = [];
    private __treeLoaded = false;

    get data() { return this.__tree.data; }

    private exportTreeToNoteMap(): TreeNodeToNote[] {
        const mapToArray = Array.from(this.__treeIDToNoteIDMap);
        const serializedMap: TreeNodeToNote[] = [];

        for ( const entry of mapToArray ) {
            serializedMap.push( {treeNodeID: entry[0], noteID: entry[1]} );
        }

        return serializedMap;
    }

    private importTreeToNoteMap(treeToNoteArray: TreeNodeToNote[]): Map<string, string> {
        const map: Map<string, string> = new Map();

        for ( const entry of treeToNoteArray ) {
            map.set( entry.treeNodeID, entry.noteID );
        }

        return map;
    }

    private exportTreeData(): TreeData {
        return {
            version: TREE_DATA_VERSION, 
            treeNodeLastID: this.__treeIDLatest,
            treeNotesMap: this.exportTreeToNoteMap(),
            treeData: this.__tree.data
        };
    }

    private createEmptyTreeData(): TreeData {
        const emptyTree: TreeData = {version: TREE_DATA_VERSION, treeNodeLastID: 0, treeNotesMap: [], treeData: []};
        return emptyTree;
      }

    private async uploadTreeData(treeData: TreeData) {
        assert( treeData.version === TREE_DATA_VERSION, 'TreeData wrong version' );
    
        const treeJSON = JSON.stringify(treeData);
        const treeBlob = new Blob([treeJSON]);
        const infoResult = await $getStreamManager().uploadFile( TREE_FILE, treeBlob, FileUploadMode.Replace );
        assert( infoResult.status === FileSystemStatus.Success, `Tree didn't upload` );
        return infoResult.fileInfo!;
    }

    async loadTreeData() {
        this.loadTreeStatus();
        const downloadResult = await $getStreamManager().downloadFile(TREE_FILE);
        let treeData: TreeData | null = null;
        if ( downloadResult.status === FileSystemStatus.Success ) {
            const treeJSON = downloadResult.status !== FileSystemStatus.Success ? '{}' : await downloadResult.file!.content!.text();
            
            let treeCandidate = JSON.parse(treeJSON);
            if ( !variableExists(treeCandidate.version) || treeCandidate.version !== TREE_DATA_VERSION ) {
                treeCandidate = await $treeConvertToLatest(treeCandidate);
                await this.uploadTreeData(treeCandidate);
            }

            treeData = treeCandidate;

        } else if ( downloadResult.status === FileSystemStatus.NotFound) {
            treeData = this.createEmptyTreeData();
            await this.uploadTreeData(treeData);
        }
        notNullOrThrow(treeData);

        this.__tree = new SimpleTree<TreeNodeData>(treeData.treeData);
        this.__treeIDLatest = treeData.treeNodeLastID;
        this.__treeIDToNoteIDMap = this.importTreeToNoteMap(treeData.treeNotesMap);
        this.__treeLoaded = true;
    }

    async storeTreeData() {
        assert(this.isTreeReady(), 'Tree isnt ready yet');
        const treeData = this.exportTreeData();
        this.uploadTreeData(treeData);
    }

    loadTreeStatus() {
        this.__treeStatus = loadTreeStatus();
    }

    getTreeStatus() {
        return this.__treeStatus;
    }

    storeTreeStatus(treeStatus: string[]) {
        this.__treeStatus = treeStatus;
        storeTreeStatus(treeStatus);
    }

    moveNodes(args: { dragIds: string[]; parentId: null | string; index: number; } ) {
        assert(this.isTreeReady(), 'Tree isnt ready yet');
        for (const id of args.dragIds) {
          this.__tree.move({ id, parentId: args.parentId, index: args.index });
        }
        if ( args.dragIds.length > 0 ) {
            $callCommand(TREE_DATA_CHANGED_CMD, undefined);
            this.storeTreeData();
        }
    }

    renameNode(id: string, name: string) {
        assert(this.isTreeReady(), 'Tree isnt ready yet');
        this.__tree.update({ id, changes: { name } as TreeNodeData });
        $callCommand(TREE_DATA_CHANGED_CMD, undefined);
        this.storeTreeData();
    }

    createNode(parentId: string | null, index: number, noteID: string, path: string) {
        assert(this.isTreeReady(), 'Tree isnt ready yet');
        const node = { id: (this.__treeIDLatest++).toString(), path, name: "New File", children: [] } as TreeNodeData;
        this.__treeIDToNoteIDMap.set(node.id, noteID);
        this.__tree.create({ parentId, index, data: node });
        $callCommand(TREE_DATA_CHANGED_CMD, undefined);
        this.storeTreeData();
        return node;
    }

    async deleteNode(id: string) {
        assert(this.isTreeReady(), 'Tree isnt ready yet');
        this.__tree.drop({ id });
        this.__treeIDToNoteIDMap.delete(id);
        $callCommand(TREE_DATA_CHANGED_CMD, undefined);
        this.storeTreeData();
    }

    selectTreeNode(id: string) {
        const noteID = this.__treeIDToNoteIDMap.get(id);
        variableExistsOrThrow(noteID, `Tree Node doesn't have Note ID`);
        $callCommand(NOTES_LOAD_CMD, noteID);
    }

    isTreeReady() {
        return this.__treeLoaded;
    }
}

const __treeManager = new TreeManager();

export function $getTreeManager() {
    return __treeManager;
}