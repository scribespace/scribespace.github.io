import '../helpers/workerMock';
import { $clearMockedFiles, $getMockedFilesJSON, $setMockedFiles, MockedFile } from "../helpers/fileSystemMock";
import { $getFileManager } from "@systems/fileManager/fileManager";
import { $getTreeManager } from "@systems/treeManager";

import { afterAll, afterEach, beforeEach, describe, expect, test, vi } from "vitest";


afterEach(
    async () => {
        await $getFileManager().flush();
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
                content: new Blob(['{"version": 0,"treeNodeLastID": 8,"treeNotesMap": [ {"treeNodeID":"0","noteID":"id:0" }, {"treeNodeID":"1","noteID":"id:1" }, {"treeNodeID":"2","noteID":"id:2" }, {"treeNodeID":"3","noteID":"id:3" }, {"treeNodeID":"4","noteID":"id:4" }, {"treeNodeID":"5","noteID":"id:5" }, {"treeNodeID":"6","noteID":"id:6" }, {"treeNodeID":"7","noteID":"id:7" } ],"treeNodes": [ {"id":"0","name":"0","children": [ {"id":"1","name":"1","children": [] } ] }, {"id":"2","name":"2","children": [ {"id":"3","name":"3","children": [ {"id":"4","name":"4","children": [ {"id":"5","name":"5","children": [] } ] }, {"id":"6","name":"6","children": [ {"id":"7","name":"7","children": [] } ] } ] } ] } ] }'])
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
                expect(JSON.stringify($getTreeManager().data)).toBe('[{"id":"0","name":"0","children":[{"id":"1","name":"1","children":[]}]},{"id":"2","name":"2","children":[{"id":"3","name":"3","children":[{"id":"4","name":"4","children":[{"id":"5","name":"5","children":[]}]},{"id":"6","name":"6","children":[{"id":"7","name":"7","children":[]}]}]}]}]');
            }
        );

        test('Rename Node', 
            async () => {
                $getTreeManager().renameNode('id:3', 'test');
                expect(JSON.stringify($getTreeManager().data)).toBe('[{"id":"0","name":"0","children":[{"id":"1","name":"1","children":[]}]},{"id":"2","name":"2","children":[{"id":"3","name":"3","children":[{"id":"4","name":"4","children":[{"id":"5","name":"5","children":[]}]},{"id":"6","name":"6","children":[{"id":"7","name":"7","children":[]}]}]}]}]'); 
            }
        );

        test('Move Node',
            async () => {
                $getTreeManager().moveNodes( {dragIds: ['id:4'], parentId: 'id:6', index: 0 } );
                expect(JSON.stringify($getTreeManager().data)).toBe('[{"id":"0","name":"0","children":[{"id":"1","name":"1","children":[]}]},{"id":"2","name":"2","children":[{"id":"3","name":"3","children":[{"id":"4","name":"4","children":[{"id":"5","name":"5","children":[]}]},{"id":"6","name":"6","children":[{"id":"7","name":"7","children":[]}]}]}]}]'); 
            }
        );

        test('Remove Node',
            async () => {
                await $getTreeManager().deleteNode( 'id:3' );
                expect(await $getMockedFilesJSON()).toBe('[{"path":"/tree","hash":"/tree","id":"id:/tree","content":{"data":["{\\"version\\":0,\\"treeNodeLastID\\":8,\\"treeNotesMap\\":[{\\"treeNodeID\\":\\"0\\",\\"noteID\\":\\"id:0\\"},{\\"treeNodeID\\":\\"1\\",\\"noteID\\":\\"id:1\\"},{\\"treeNodeID\\":\\"2\\",\\"noteID\\":\\"id:2\\"},{\\"treeNodeID\\":\\"3\\",\\"noteID\\":\\"id:3\\"},{\\"treeNodeID\\":\\"4\\",\\"noteID\\":\\"id:4\\"},{\\"treeNodeID\\":\\"5\\",\\"noteID\\":\\"id:5\\"},{\\"treeNodeID\\":\\"6\\",\\"noteID\\":\\"id:6\\"},{\\"treeNodeID\\":\\"7\\",\\"noteID\\":\\"id:7\\"}],\\"treeNodes\\":[{\\"id\\":\\"0\\",\\"name\\":\\"0\\",\\"children\\":[{\\"id\\":\\"1\\",\\"name\\":\\"1\\",\\"children\\":[]}]},{\\"id\\":\\"2\\",\\"name\\":\\"2\\",\\"children\\":[{\\"id\\":\\"3\\",\\"name\\":\\"3\\",\\"children\\":[{\\"id\\":\\"4\\",\\"name\\":\\"4\\",\\"children\\":[{\\"id\\":\\"5\\",\\"name\\":\\"5\\",\\"children\\":[]}]},{\\"id\\":\\"6\\",\\"name\\":\\"6\\",\\"children\\":[{\\"id\\":\\"7\\",\\"name\\":\\"7\\",\\"children\\":[]}]}]}]}]}"],"size":626,"type":"text/xml"}},{"path":"/notes/0","id":"id:0","hash":"0","content":{"data":["abc0"],"size":4,"type":"text/xml"}},{"path":"/notes/1","id":"id:1","hash":"1","content":{"data":["abc1"],"size":4,"type":"text/xml"}},{"path":"/notes/2","id":"id:2","hash":"2","content":{"data":["abc2"],"size":4,"type":"text/xml"}},{"path":"/notes/3","id":"id:3","hash":"3","content":{"data":["abc3"],"size":4,"type":"text/xml"}},{"path":"/notes/4","id":"id:4","hash":"4","content":{"data":["abc4"],"size":4,"type":"text/xml"}},{"path":"/notes/5","id":"id:5","hash":"5","content":{"data":["abc5"],"size":4,"type":"text/xml"}},{"path":"/notes/6","id":"id:6","hash":"6","content":{"data":["abc6"],"size":4,"type":"text/xml"}},{"path":"/notes/7","id":"id:7","hash":"7","content":{"data":["abc7"],"size":4,"type":"text/xml"}}]'); 
                expect(JSON.stringify($getTreeManager().data)).toBe('[{"id":"0","name":"0","children":[{"id":"1","name":"1","children":[]}]},{"id":"2","name":"2","children":[{"id":"3","name":"3","children":[{"id":"4","name":"4","children":[{"id":"5","name":"5","children":[]}]},{"id":"6","name":"6","children":[{"id":"7","name":"7","children":[]}]}]}]}]'); 
            }
        );
    }
);