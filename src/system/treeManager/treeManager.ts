import { $getFileSystem } from "@coreSystems";
import { FileSystemStatus } from "@interfaces/system/fileSystem/fileSystemShared";
import { $callCommand } from "@systems/commandsManager/commandsManager";
import { assert } from "@utils";
import { SimpleTree } from "react-arborist";
import { TREE_DATA_CHANGED_CMD } from "./treeCommands";
import { TREE_FILE, TreeNodeData, createTreeData, loadTreeData, uploadTreeData } from "./treeData";
import { loadTreeStatus, storeTreeStatus } from "./treeStatus";

class TreeManager {
    private tree: SimpleTree<TreeNodeData> = new SimpleTree<TreeNodeData>([]);
    private treeLoaded = false;

    get data() { return this.tree.data; }

    async loadTreeData() {
        const downloadResult = await $getFileSystem().downloadFileAsync(TREE_FILE);
        const treeJSON = downloadResult.status !== FileSystemStatus.Success ? '[]' : await downloadResult.file!.content!.text();
        const treeData = await loadTreeData(treeJSON);
        this.tree = new SimpleTree<TreeNodeData>(treeData.data);
        this.treeLoaded = true;
        $callCommand(TREE_DATA_CHANGED_CMD, undefined);
    }
    async storeTreeData() {
        assert(this.isTreeReady(), 'Tree isnt ready yet');
        const treeData = createTreeData(this.tree.data);
        uploadTreeData(treeData);
    }
    loadTreeStatus() {
        return loadTreeStatus();
    }
    storeTreeStatus(treeStatus: string[]) {
        storeTreeStatus(treeStatus);
    }

    moveNodes(args: { dragIds: string[]; parentId: null | string; index: number; } ) {
        assert(this.isTreeReady(), 'Tree isnt ready yet');
        for (const id of args.dragIds) {
          this.tree.move({ id, parentId: args.parentId, index: args.index });
        }
        if ( args.dragIds.length > 0 ) {
            $callCommand(TREE_DATA_CHANGED_CMD, undefined);
            this.storeTreeData();
        }
    }

    renameNode(id: string, name: string) {
        assert(this.isTreeReady(), 'Tree isnt ready yet');
        this.tree.update({ id, changes: { name } as TreeNodeData });
        $callCommand(TREE_DATA_CHANGED_CMD, undefined);
        this.storeTreeData();
    }

    createNode(parentId: string | null, index: number, id: string, path: string) {
        assert(this.isTreeReady(), 'Tree isnt ready yet');
        const node = { id, path, name: "New File", children: [] } as TreeNodeData;
        this.tree.create({ parentId, index, data: node });
        $callCommand(TREE_DATA_CHANGED_CMD, undefined);
        this.storeTreeData();
        return node;
    }

    async deleteNode(id: string) {
        assert(this.isTreeReady(), 'Tree isnt ready yet');
        this.tree.drop({ id });
        $callCommand(TREE_DATA_CHANGED_CMD, undefined);
        this.storeTreeData();
    }

    isTreeReady() {
        return this.treeLoaded;
    }
}

export const treeManager = new TreeManager();