import { $clearMockedFiles, $getMockedFilesJSON, $setMockedFiles, MockedFile } from "../helpers/fileSystemMock";

import { afterEach, afterAll, vi, describe, beforeEach, test, expect } from "vitest";
import { ReactTest, reactSetup } from "../helpers/prepareReact";
import { DefaultTestTree } from "./utils/testTree";
import { TREE_FILE } from "@systems/treeManager/treeData";
import { treeManager } from "@systems/treeManager";


afterEach(
    () => {
        $clearMockedFiles();
    }
);

afterAll(
    () => {
        vi.clearAllMocks();
    }
);

beforeEach( 
    async () => {
        const files: MockedFile[] = [
            {
                path:"/tree",
                hash:"/tree",
                id:"id:/tree",
                content: new Blob(['{ "version": 0, "data": [ { "id": "id:0", "name": "0", "children": [ { "id": "id:1", "name": "1", "children": [], "path": "/notes/1" } ], "path": "/notes/0" }, { "id": "id:2", "name": "2", "children": [ { "id": "id:3", "name": "3", "children": [ { "id": "id:4", "name": "4", "children": [ { "id": "id:5", "name": "5", "children": [], "path": "/notes/5" } ], "path": "/notes/4" }, { "id": "id:6", "name": "6", "children": [ { "id": "id:7", "name": "7", "children": [], "path": "/notes/7" } ], "path": "/notes/6" } ], "path": "/notes/3" } ], "path": "/notes/2" } ] }'])
            },
            {
                path: "/notes/0",
                id: "id:0",
                hash: "0",
                content: new Blob(["abc0"])
              },
              {
                "path": "/notes/1",
                id: "id:1",
                hash: "1",
                content: new Blob(["abc1"])
              },
              {
                "path": "/notes/2",
                id: "id:2",
                hash: "2",
                content: new Blob(["abc2"])
              },
              {
                "path": "/notes/3",
                id: "id:3",
                hash: "3",
                content: new Blob(["abc3"])
              },
              {
                "path": "/notes/4",
                id: "id:4",
                hash: "4",
                content: new Blob(["abc4"])
              },
              {
                "path": "/notes/5",
                id: "id:5",
                hash: "5",
                content: new Blob(["abc5"])
              },
              {
                "path": "/notes/6",
                id: "id:6",
                hash: "6",
                content: new Blob(["abc6"])
              },
              {
                "path": "/notes/7",
                id: "id:7",
                hash: "7",
                content: new Blob(["abc7"])
              }
        ];
        $setMockedFiles(files);
        await treeManager.loadTreeData();
    }
);

describe('TreeOperation:',
    async () => {
        test('Load Tree',
            async () => {
                expect(JSON.stringify(treeManager.data)).toBe('[{"id":"id:0","name":"0","children":[{"id":"id:1","name":"1","children":[],"path":"/notes/1"}],"path":"/notes/0"},{"id":"id:2","name":"2","children":[{"id":"id:3","name":"3","children":[{"id":"id:4","name":"4","children":[{"id":"id:5","name":"5","children":[],"path":"/notes/5"}],"path":"/notes/4"},{"id":"id:6","name":"6","children":[{"id":"id:7","name":"7","children":[],"path":"/notes/7"}],"path":"/notes/6"}],"path":"/notes/3"}],"path":"/notes/2"}]');
            }
        );

        test('Rename Node', 
            async () => {
                treeManager.renameNode('id:3', 'test');
                expect(JSON.stringify(treeManager.data)).toBe('[{"id":"id:0","name":"0","children":[{"id":"id:1","name":"1","children":[],"path":"/notes/1"}],"path":"/notes/0"},{"id":"id:2","name":"2","children":[{"id":"id:3","name":"test","children":[{"id":"id:4","name":"4","children":[{"id":"id:5","name":"5","children":[],"path":"/notes/5"}],"path":"/notes/4"},{"id":"id:6","name":"6","children":[{"id":"id:7","name":"7","children":[],"path":"/notes/7"}],"path":"/notes/6"}],"path":"/notes/3"}],"path":"/notes/2"}]'); 
            }
        );

        test('Move Node',
            () => {
                treeManager.moveNodes( {dragIds: ['id:4'], parentId: 'id:6', index: 0 } );
                expect(JSON.stringify(treeManager.data)).toBe('[{"id":"id:0","name":"0","children":[{"id":"id:1","name":"1","children":[],"path":"/notes/1"}],"path":"/notes/0"},{"id":"id:2","name":"2","children":[{"id":"id:3","name":"3","children":[{"id":"id:6","name":"6","children":[{"id":"id:4","name":"4","children":[{"id":"id:5","name":"5","children":[],"path":"/notes/5"}],"path":"/notes/4"},{"id":"id:7","name":"7","children":[],"path":"/notes/7"}],"path":"/notes/6"}],"path":"/notes/3"}],"path":"/notes/2"}]'); 
            }
        );
    }
);