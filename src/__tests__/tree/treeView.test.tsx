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
                path: TREE_FILE,
                id: `id:${TREE_FILE}`,
                hash: TREE_FILE,
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

        await ReactTest.render(<DefaultTestTree/>);
    }
);

reactSetup();

describe('TreeView:',
    async () => {
        test('Load Tree',
            async () => {
                await vi.waitFor( () => { expect(JSON.stringify(treeManager.data)).toBe('[{"id":"id:0","name":"0","children":[{"id":"id:1","name":"1","children":[],"path":"1"}],"path":"0"},{"id":"id:2","name":"2","children":[{"id":"id:3","name":"3","children":[{"id":"id:4","name":"4","children":[{"id":"id:5","name":"5","children":[],"path":"5"}],"path":"4"},{"id":"id:6","name":"6","children":[{"id":"id:7","name":"7","children":[],"path":"7"}],"path":"6"}],"path":"3"}],"path":"2"}]'); } );
                expect( await $getMockedFilesJSON()).toBe('[{"path":"/tree","hash":"/tree","id":"id:/tree","content":{"data":["{\\"version\\":0,\\"data\\":[{\\"id\\":\\"id:0\\",\\"name\\":\\"0\\",\\"children\\":[{\\"id\\":\\"id:1\\",\\"name\\":\\"1\\",\\"children\\":[],\\"path\\":\\"1\\"}],\\"path\\":\\"0\\"},{\\"id\\":\\"id:2\\",\\"name\\":\\"2\\",\\"children\\":[{\\"id\\":\\"id:3\\",\\"name\\":\\"3\\",\\"children\\":[{\\"id\\":\\"id:4\\",\\"name\\":\\"4\\",\\"children\\":[{\\"id\\":\\"id:5\\",\\"name\\":\\"5\\",\\"children\\":[],\\"path\\":\\"5\\"}],\\"path\\":\\"4\\"},{\\"id\\":\\"id:6\\",\\"name\\":\\"6\\",\\"children\\":[{\\"id\\":\\"id:7\\",\\"name\\":\\"7\\",\\"children\\":[],\\"path\\":\\"7\\"}],\\"path\\":\\"6\\"}],\\"path\\":\\"3\\"}],\\"path\\":\\"2\\"}]}"],"size":417,"type":"text/xml"}},{"path":"0","id":"id:0","hash":"0","content":{"data":["abc1"],"size":4,"type":"text/xml"}},{"path":"1","id":"id:1","hash":"1","content":{"data":["abc2"],"size":4,"type":"text/xml"}},{"path":"2","id":"id:2","hash":"2","content":{"data":["abc3"],"size":4,"type":"text/xml"}},{"path":"3","id":"id:3","hash":"3","content":{"data":["abc4"],"size":4,"type":"text/xml"}},{"path":"4","id":"id:4","hash":"4","content":{"data":["abc5"],"size":4,"type":"text/xml"}},{"path":"5","id":"id:5","hash":"5","content":{"data":["abc6"],"size":4,"type":"text/xml"}},{"path":"6","id":"id:6","hash":"6","content":{"data":["abc7"],"size":4,"type":"text/xml"}},{"path":"7","id":"id:7","hash":"7","content":{"data":["abc8"],"size":4,"type":"text/xml"}}]');
            }
        );
    }
);