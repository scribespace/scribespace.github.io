import { $clearMockedFiles, $getMockedFilesJSON, $setMockedFiles, MockedFile } from "../helpers/fileSystemMock";
import { $getStreamManager } from "@systems/streamManager/streamManager";
import { $getTreeManager } from "@systems/treeManager";

import { afterAll, afterEach, beforeEach, describe, expect, test, vi } from "vitest";


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
        await $getStreamManager().flush();
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
        await $getTreeManager().loadTreeData();
    }
);

describe('TreeOperation:',
    async () => {
        test('Load Tree',
            async () => {
                expect(JSON.stringify($getTreeManager().data)).toBe('[{"id":"id:0","name":"0","children":[{"id":"id:1","name":"1","children":[],"path":"/notes/1"}],"path":"/notes/0"},{"id":"id:2","name":"2","children":[{"id":"id:3","name":"3","children":[{"id":"id:4","name":"4","children":[{"id":"id:5","name":"5","children":[],"path":"/notes/5"}],"path":"/notes/4"},{"id":"id:6","name":"6","children":[{"id":"id:7","name":"7","children":[],"path":"/notes/7"}],"path":"/notes/6"}],"path":"/notes/3"}],"path":"/notes/2"}]');
            }
        );

        test('Rename Node', 
            async () => {
                $getTreeManager().renameNode('id:3', 'test');
                expect(JSON.stringify($getTreeManager().data)).toBe('[{"id":"id:0","name":"0","children":[{"id":"id:1","name":"1","children":[],"path":"/notes/1"}],"path":"/notes/0"},{"id":"id:2","name":"2","children":[{"id":"id:3","name":"test","children":[{"id":"id:4","name":"4","children":[{"id":"id:5","name":"5","children":[],"path":"/notes/5"}],"path":"/notes/4"},{"id":"id:6","name":"6","children":[{"id":"id:7","name":"7","children":[],"path":"/notes/7"}],"path":"/notes/6"}],"path":"/notes/3"}],"path":"/notes/2"}]'); 
            }
        );

        test('Move Node',
            async () => {
                $getTreeManager().moveNodes( {dragIds: ['id:4'], parentId: 'id:6', index: 0 } );
                expect(JSON.stringify($getTreeManager().data)).toBe('[{"id":"id:0","name":"0","children":[{"id":"id:1","name":"1","children":[],"path":"/notes/1"}],"path":"/notes/0"},{"id":"id:2","name":"2","children":[{"id":"id:3","name":"3","children":[{"id":"id:6","name":"6","children":[{"id":"id:4","name":"4","children":[{"id":"id:5","name":"5","children":[],"path":"/notes/5"}],"path":"/notes/4"},{"id":"id:7","name":"7","children":[],"path":"/notes/7"}],"path":"/notes/6"}],"path":"/notes/3"}],"path":"/notes/2"}]'); 
            }
        );

        test('Remove Node',
            async () => {
                await $getTreeManager().deleteNode( 'id:3' );
                expect(await $getMockedFilesJSON()).toBe('[{"path":"/tree","hash":"/tree","id":"id:/tree","content":{"data":["{\\"version\\":0,\\"data\\":[{\\"id\\":\\"id:0\\",\\"name\\":\\"0\\",\\"children\\":[{\\"id\\":\\"id:1\\",\\"name\\":\\"1\\",\\"children\\":[],\\"path\\":\\"/notes/1\\"}],\\"path\\":\\"/notes/0\\"},{\\"id\\":\\"id:2\\",\\"name\\":\\"2\\",\\"children\\":[],\\"path\\":\\"/notes/2\\"}]}"],"size":192,"type":"text/xml"}},{"path":"/notes/0","id":"id:0","hash":"0","content":{"data":["abc0"],"size":4,"type":"text/xml"}},{"path":"/notes/1","id":"id:1","hash":"1","content":{"data":["abc1"],"size":4,"type":"text/xml"}},{"path":"/notes/2","id":"id:2","hash":"2","content":{"data":["abc2"],"size":4,"type":"text/xml"}},{"path":"/notes/3","id":"id:3","hash":"3","content":{"data":["abc3"],"size":4,"type":"text/xml"}},{"path":"/notes/4","id":"id:4","hash":"4","content":{"data":["abc4"],"size":4,"type":"text/xml"}},{"path":"/notes/5","id":"id:5","hash":"5","content":{"data":["abc5"],"size":4,"type":"text/xml"}},{"path":"/notes/6","id":"id:6","hash":"6","content":{"data":["abc6"],"size":4,"type":"text/xml"}},{"path":"/notes/7","id":"id:7","hash":"7","content":{"data":["abc7"],"size":4,"type":"text/xml"}}]'); 
                expect(JSON.stringify($getTreeManager().data)).toBe('[{"id":"id:0","name":"0","children":[{"id":"id:1","name":"1","children":[],"path":"/notes/1"}],"path":"/notes/0"},{"id":"id:2","name":"2","children":[],"path":"/notes/2"}]'); 
            }
        );
    }
);