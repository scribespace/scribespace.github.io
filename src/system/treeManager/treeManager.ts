import { FileInfo, FileSystemStatus } from "@interfaces/system/fileSystem/fileSystemShared";
import { $callCommand } from "@systems/commandsManager/commandsManager";
import { $getFileManager, FileHandle, FileUploadReplaceResolve } from "@systems/fileManager/fileManager";
import { $getNotesManager } from "@systems/notesManager";
import { NOTES_LOAD_CMD } from "@systems/notesManager/notesCommands";
import { assert, variableExistsOrThrow } from "@utils";
import { TREE_DATA_CHANGED_CMD, TREE_RELOAD_CMD } from "./treeCommands";
import { SerializedTreeData, TreeData } from "./treeData";
import { TreeStatus } from "./treeStatus";
import { BLOCK_EDITING_CMD } from "@systems/systemCommands";


const TREE_STATUS_PATH = "tree_status" as const;
export const TREE_FILE = "/tree" as const;
const EMPTY_NOTE_ID = 'empty_note' as const;
class TreeManager {
    private __tree: TreeData = new TreeData();
    private __treeIDToPromise: Map<string, Promise<FileInfo>> = new Map();

    private __treeStatus: TreeStatus = new TreeStatus();

    private __treeLoaded = false;
    private __treeHandle: FileHandle = {fileID: TREE_FILE, version: -1};

    private __validTree = false;

    get data() { return this.__tree.data; }

    private async uploadTreeData(treeData: SerializedTreeData) {
        const treeJSON = JSON.stringify(treeData);
        const treeBlob = new Blob([treeJSON]);

        let fileInfo: FileInfo;
        if ( this.__treeHandle.version === -1 ) {
            const infoResult = await $getFileManager().createFile( this.__treeHandle.fileID, treeBlob );
            assert( infoResult.status === FileSystemStatus.Success, `Tree didn't upload` );
            this.__treeHandle = infoResult.handle;
            fileInfo = infoResult.file.fileInfo;
        } else {
            const infoResult = await $getFileManager().uploadFile( this.__treeHandle, treeBlob, 
                (_id: string, _path: string, _version:number, oldResolve: FileUploadReplaceResolve) => {
                    this.__validTree = false;
                    $callCommand(BLOCK_EDITING_CMD, undefined);
                    this.loadTreeData().then( 
                        () => {
                            $callCommand(TREE_RELOAD_CMD, undefined);
                            return $getFileManager().getFileInfo(this.__treeHandle);                            
                        } ).then(
                            (fileInfo) => {
                                oldResolve( fileInfo );
                            }
                        );
                } );
            assert( infoResult.status === FileSystemStatus.Success, `Tree didn't upload` );
            fileInfo = infoResult.fileInfo;
        }

        return fileInfo;
    }

    async loadTreeData() {
        this.__treeLoaded = false;

        this.loadTreeStatus();

        const downloadResult = await $getFileManager().downloadFile(this.__treeHandle.fileID);
        if ( downloadResult.status === FileSystemStatus.Success ) {
            this.__treeHandle = downloadResult.handle;

            const treeJSON = await downloadResult.file.content.text();
            const needSaving = await this.__tree.import(treeJSON);
            if ( needSaving ) {
                await this.uploadTreeData(this.__tree.export());
            }
        } else if ( downloadResult.status === FileSystemStatus.NotFound) {
            await this.uploadTreeData(this.__tree.export());
        }
       
        this.__validTree = true;
        this.__treeLoaded = true;
    }

    private async storeTreeData() {
        if ( this.__validTree ) {
            assert(this.isTreeReady(), 'Tree isnt ready yet');
            await this.uploadTreeData(this.__tree.export());
        }
    }

    private loadTreeStatus() {
        const treeStatusJSON = window.localStorage.getItem(TREE_STATUS_PATH);
        if ( treeStatusJSON ) {
            this.__treeStatus.import(treeStatusJSON);
        }
    }

    private storeTreeStatus() {
        const serilizedStatus = this.__treeStatus.export();
        window.localStorage.setItem(TREE_STATUS_PATH, JSON.stringify(serilizedStatus));
    }

    openTreeNode( id: string ) {
        this.__treeStatus.open(id);
        this.storeTreeStatus();
    }

    closeTreeNode( id: string ) {
        this.__treeStatus.close(id);
        this.storeTreeStatus();
    }
    
    toggleTreeNode( id: string ) {
        this.__treeStatus.toggle(id);
        this.storeTreeStatus();
    }

    getClosedNodes() {
        return this.__treeStatus.getClosedNodes();
    }

    moveNodes(args: { dragIds: string[]; parentId: null | string; index: number; } ) {
        assert(this.isTreeReady(), 'Tree isnt ready yet');
        this.__tree.moveNodes(args.dragIds, args.parentId, args.index);

        if ( args.dragIds.length > 0 ) {
            $callCommand(TREE_DATA_CHANGED_CMD, undefined);
            this.storeTreeData();
        }
    }

    renameNode(id: string, name: string) {
        assert(this.isTreeReady(), 'Tree isnt ready yet');
        this.__tree.renameNode( id, name );

        $callCommand(TREE_DATA_CHANGED_CMD, undefined);
        this.storeTreeData();
    }

    createNode(parentId: string | null, index: number) {
        assert(this.isTreeReady(), 'Tree isnt ready yet');
        const node = this.__tree.createNode(parentId, index, EMPTY_NOTE_ID);

        const notePromise = this.storeTreeData().then(
            () => {
                return $getNotesManager().createNote();
                }).then(
                    (result) => {
                        this.__tree.updateNoteID( node.id, result.id );
                        this.storeTreeData();

                        return result;
                    }
                );
        this.__treeIDToPromise.set(node.id, notePromise);

        $callCommand(TREE_DATA_CHANGED_CMD, undefined);
        return node;
    }

    deleteNode(id: string) {
        assert(this.isTreeReady(), 'Tree isnt ready yet');
        this.__tree.deleteNode( id );
        $callCommand(TREE_DATA_CHANGED_CMD, undefined);
        this.storeTreeData();
    }

    selectTreeNode(id: string) {
        const noteID = this.__tree.treeIDToNoteID(id);
        if ( noteID === EMPTY_NOTE_ID ) {
            this.__treeIDToPromise.get(id)?.then(
                (result) => {
                    $callCommand(NOTES_LOAD_CMD, {id:result.id});
                }
            );

            return;
        }

        variableExistsOrThrow(noteID, `Tree Node doesn't have Note ID`);
        $callCommand(NOTES_LOAD_CMD, {id: noteID});
    }

    isTreeReady() {
        return this.__treeLoaded;
    }
}

const __treeManager = new TreeManager();

export function $getTreeManager() {
    return __treeManager;
}