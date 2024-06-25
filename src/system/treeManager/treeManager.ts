import { $getFileSystem } from "@coreSystems";
import { FileSystemStatus } from "@interfaces/system/fileSystem/fileSystemShared";
import { $callCommand } from "@systems/commandsManager/commandsManager";
import { assert } from "@utils";
import { SimpleTree } from "react-arborist";
import { TREE_DATA_CHANGED_CMD } from "./treeCommands";
import { TREE_FILE, TreeNodeData, createTreeData, loadTreeData, uploadTreeData } from "./treeData";
import { loadTreeStatus, storeTreeStatus } from "./treeStatus";

class TreeManager {
    private __tree: SimpleTree<TreeNodeData> = new SimpleTree<TreeNodeData>([]);
    private __treeStatus: string[] = [];
    private __treeLoaded = false;

    get data() { return this.__tree.data; }

    async loadTreeData() {
        this.loadTreeStatus();
        const downloadResult = await $getFileSystem().downloadFileAsync(TREE_FILE);
        const treeJSON = downloadResult.status !== FileSystemStatus.Success ? '{}' : await downloadResult.file!.content!.text();
        const treeData = await loadTreeData(treeJSON);
        this.__tree = new SimpleTree<TreeNodeData>(treeData.data);
        this.__treeLoaded = true;
    }
    async storeTreeData() {
        assert(this.isTreeReady(), 'Tree isnt ready yet');
        const treeData = createTreeData(this.__tree.data);
        uploadTreeData(treeData);
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

    createNode(parentId: string | null, index: number, id: string, path: string) {
        assert(this.isTreeReady(), 'Tree isnt ready yet');
        const node = { id, path, name: "New File", children: [] } as TreeNodeData;
        this.__tree.create({ parentId, index, data: node });
        $callCommand(TREE_DATA_CHANGED_CMD, undefined);
        this.storeTreeData();
        return node;
    }

    async deleteNode(id: string) {
        assert(this.isTreeReady(), 'Tree isnt ready yet');
        this.__tree.drop({ id });
        $callCommand(TREE_DATA_CHANGED_CMD, undefined);
        this.storeTreeData();
    }

    isTreeReady() {
        return this.__treeLoaded;
    }
}

export const treeManager = new TreeManager();