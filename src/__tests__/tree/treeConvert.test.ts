import '../helpers/workerMock';
import { $clearMockedFiles, $getMockedFilesJSON, $setMockedFiles, MockedFile } from "../helpers/fileSystemMock";

import { afterAll, afterEach, describe, expect, test, vi } from "vitest";
import { reactSetup } from "../helpers/prepareReact";
import { $getTreeManager } from "@systems/treeManager";

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


describe('Tree Convert:',
    async () => {
        reactSetup();

        test('V0', 
        async () => {
            const files: MockedFile[] = [
                {
                    path: '/tree',
                    id: `id:${'/tree'}`,
                    hash: '/tree',
                    content: new Blob(['[ { "id": "id:0", "name": "0", "children": [ { "id": "id:1", "name": "1", "children": [] } ] }, { "id": "id:2", "name": "2", "children": [ { "id": "id:3", "name": "3", "children": [ { "id": "id:4", "name": "4", "children": [ { "id": "id:5", "name": "5", "children": [] } ] }, { "id": "id:6", "name": "6", "children": [ { "id": "id:7", "name": "7", "children": [] } ] } ] } ] } ]'])
                },
                {
                    path: '0',
                    id: 'id:0',
                    hash: '0',
                    content: new Blob(['abc1'])
                },
                {
                    path: '1',
                    id: 'id:1',
                    hash: '1',
                    content: new Blob(['abc2'])
                },
                {
                    path: '2',
                    id: 'id:2',
                    hash: '2',
                    content: new Blob(['abc3'])
                },
                {
                    path: '3',
                    id: 'id:3',
                    hash: '3',
                    content: new Blob(['abc4'])
                },
                {
                    path: '4',
                    id: 'id:4',
                    hash: '4',
                    content: new Blob(['abc5'])
                },
                {
                    path: '5',
                    id: 'id:5',
                    hash: '5',
                    content: new Blob(['abc6'])
                },
                {
                    path: '6',
                    id: 'id:6',
                    hash: '6',
                    content: new Blob(['abc7'])
                },
                {
                    path: '7',
                    id: 'id:7',
                    hash: '7',
                    content: new Blob(['abc8'])
                }
            ];

            $setMockedFiles(files);

            expect( await $getMockedFilesJSON()).toBe('[{"path":"/tree","id":"id:/tree","hash":"/tree","content":{"data":["[ { \\"id\\": \\"id:0\\", \\"name\\": \\"0\\", \\"children\\": [ { \\"id\\": \\"id:1\\", \\"name\\": \\"1\\", \\"children\\": [] } ] }, { \\"id\\": \\"id:2\\", \\"name\\": \\"2\\", \\"children\\": [ { \\"id\\": \\"id:3\\", \\"name\\": \\"3\\", \\"children\\": [ { \\"id\\": \\"id:4\\", \\"name\\": \\"4\\", \\"children\\": [ { \\"id\\": \\"id:5\\", \\"name\\": \\"5\\", \\"children\\": [] } ] }, { \\"id\\": \\"id:6\\", \\"name\\": \\"6\\", \\"children\\": [ { \\"id\\": \\"id:7\\", \\"name\\": \\"7\\", \\"children\\": [] } ] } ] } ] } ]"],"size":378,"type":"text/xml"}},{"path":"0","id":"id:0","hash":"0","content":{"data":["abc1"],"size":4,"type":"text/xml"}},{"path":"1","id":"id:1","hash":"1","content":{"data":["abc2"],"size":4,"type":"text/xml"}},{"path":"2","id":"id:2","hash":"2","content":{"data":["abc3"],"size":4,"type":"text/xml"}},{"path":"3","id":"id:3","hash":"3","content":{"data":["abc4"],"size":4,"type":"text/xml"}},{"path":"4","id":"id:4","hash":"4","content":{"data":["abc5"],"size":4,"type":"text/xml"}},{"path":"5","id":"id:5","hash":"5","content":{"data":["abc6"],"size":4,"type":"text/xml"}},{"path":"6","id":"id:6","hash":"6","content":{"data":["abc7"],"size":4,"type":"text/xml"}},{"path":"7","id":"id:7","hash":"7","content":{"data":["abc8"],"size":4,"type":"text/xml"}}]');
            
            await $getTreeManager().loadTreeData();
            
            expect( await $getMockedFilesJSON()).toBe('[{"path":"/tree","id":"id:/tree","hash":"/tree1","content":{"data":["{\\"version\\":0,\\"treeNodeLastID\\":8,\\"treeNotesMap\\":[{\\"treeNodeID\\":\\"0\\",\\"noteID\\":\\"id:0\\"},{\\"treeNodeID\\":\\"1\\",\\"noteID\\":\\"id:1\\"},{\\"treeNodeID\\":\\"2\\",\\"noteID\\":\\"id:2\\"},{\\"treeNodeID\\":\\"3\\",\\"noteID\\":\\"id:3\\"},{\\"treeNodeID\\":\\"4\\",\\"noteID\\":\\"id:4\\"},{\\"treeNodeID\\":\\"5\\",\\"noteID\\":\\"id:5\\"},{\\"treeNodeID\\":\\"6\\",\\"noteID\\":\\"id:6\\"},{\\"treeNodeID\\":\\"7\\",\\"noteID\\":\\"id:7\\"}],\\"treeNodes\\":[{\\"id\\":\\"0\\",\\"name\\":\\"0\\",\\"children\\":[{\\"id\\":\\"1\\",\\"name\\":\\"1\\",\\"children\\":[]}]},{\\"id\\":\\"2\\",\\"name\\":\\"2\\",\\"children\\":[{\\"id\\":\\"3\\",\\"name\\":\\"3\\",\\"children\\":[{\\"id\\":\\"4\\",\\"name\\":\\"4\\",\\"children\\":[{\\"id\\":\\"5\\",\\"name\\":\\"5\\",\\"children\\":[]}]},{\\"id\\":\\"6\\",\\"name\\":\\"6\\",\\"children\\":[{\\"id\\":\\"7\\",\\"name\\":\\"7\\",\\"children\\":[]}]}]}]}]}"],"size":626,"type":"text/xml"}},{"path":"0","id":"id:0","hash":"0","content":{"data":["abc1"],"size":4,"type":"text/xml"}},{"path":"1","id":"id:1","hash":"1","content":{"data":["abc2"],"size":4,"type":"text/xml"}},{"path":"2","id":"id:2","hash":"2","content":{"data":["abc3"],"size":4,"type":"text/xml"}},{"path":"3","id":"id:3","hash":"3","content":{"data":["abc4"],"size":4,"type":"text/xml"}},{"path":"4","id":"id:4","hash":"4","content":{"data":["abc5"],"size":4,"type":"text/xml"}},{"path":"5","id":"id:5","hash":"5","content":{"data":["abc6"],"size":4,"type":"text/xml"}},{"path":"6","id":"id:6","hash":"6","content":{"data":["abc7"],"size":4,"type":"text/xml"}},{"path":"7","id":"id:7","hash":"7","content":{"data":["abc8"],"size":4,"type":"text/xml"}}]');
            expect(JSON.stringify($getTreeManager().data)).toBe('[{"id":"0","name":"0","children":[{"id":"1","name":"1","children":[]}]},{"id":"2","name":"2","children":[{"id":"3","name":"3","children":[{"id":"4","name":"4","children":[{"id":"5","name":"5","children":[]}]},{"id":"6","name":"6","children":[{"id":"7","name":"7","children":[]}]}]}]}]');
        });
    }
);