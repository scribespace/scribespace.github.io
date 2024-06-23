import { $clearMockedFiles, $getMockedFilesJSON, $setMockedFiles, MockedFile } from "../helpers/fileSystemMock";
import { ReactTest, reactSetup } from "../helpers/prepareReact";
import '../helpers/workerMock';

import { treeManager } from "@systems/treeManager";
import { TREE_FILE } from "@systems/treeManager/treeData";
import { afterAll, afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { DefaultTestDataLoader } from "../helpers/testDataLoader";


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

reactSetup();

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
                path: '/notes/0',
                id: 'id:0',
                hash: '0',
                content: new Blob(['abc1'])
            },
            {
                path: '/notes/1',
                id: 'id:1',
                hash: '1',
                content: new Blob(['abc2'])
            },
            {
                path: '/notes/2',
                id: 'id:2',
                hash: '2',
                content: new Blob(['abc3'])
            },
            {
                path: '/notes/3',
                id: 'id:3',
                hash: '3',
                content: new Blob(['abc4'])
            },
            {
                path: '/notes/4',
                id: 'id:4',
                hash: '4',
                content: new Blob(['abc5'])
            },
            {
                path: '/notes/5',
                id: 'id:5',
                hash: '5',
                content: new Blob(['abc6'])
            },
            {
                path: '/notes/6',
                id: 'id:6',
                hash: '6',
                content: new Blob(['abc7'])
            },
            {
                path: '/notes/7',
                id: 'id:7',
                hash: '7',
                content: new Blob(['abc8'])
            }
        ];
        $setMockedFiles(files);
        await ReactTest.act(async ()=>{ await ReactTest.render(<DefaultTestDataLoader/>);});
    }
);

describe('Convert:',
    async () => {
        test('V0',
           async () => {
                await vi.waitFor( () => { expect(JSON.stringify(treeManager.data)).toBe('[{"id":"id:0","name":"0","children":[{"id":"id:1","name":"1","children":[]}]},{"id":"id:2","name":"2","children":[{"id":"id:3","name":"3","children":[{"id":"id:4","name":"4","children":[{"id":"id:5","name":"5","children":[]}]},{"id":"id:6","name":"6","children":[{"id":"id:7","name":"7","children":[]}]}]}]}]'); } );
                expect( $getMockedFilesJSON()).toBe('[{"path":"/tree","id":"id:/tree","hash":"/tree","content":{"data":["{\\"version\\":0,\\"data\\":[{\\"id\\":\\"id:0\\",\\"name\\":\\"0\\",\\"children\\":[{\\"id\\":\\"id:1\\",\\"name\\":\\"1\\",\\"children\\":[]}]},{\\"id\\":\\"id:2\\",\\"name\\":\\"2\\",\\"children\\":[{\\"id\\":\\"id:3\\",\\"name\\":\\"3\\",\\"children\\":[{\\"id\\":\\"id:4\\",\\"name\\":\\"4\\",\\"children\\":[{\\"id\\":\\"id:5\\",\\"name\\":\\"5\\",\\"children\\":[]}]},{\\"id\\":\\"id:6\\",\\"name\\":\\"6\\",\\"children\\":[{\\"id\\":\\"id:7\\",\\"name\\":\\"7\\",\\"children\\":[]}]}]}]}]}"],"size":329,"type":"text/xml"}},{"path":"/notes/0","id":"id:0","hash":"0","content":{"data":["{\\"version\\":0,\\"data\\":\\"{\\\\\\"root\\\\\\":{\\\\\\"children\\\\\\":[{\\\\\\"children\\\\\\":[{\\\\\\"detail\\\\\\":0,\\\\\\"format\\\\\\":0,\\\\\\"mode\\\\\\":\\\\\\"normal\\\\\\",\\\\\\"style\\\\\\":\\\\\\"\\\\\\",\\\\\\"text\\\\\\":\\\\\\"abc1\\\\\\",\\\\\\"type\\\\\\":\\\\\\"extended-text\\\\\\",\\\\\\"version\\\\\\":1}],\\\\\\"direction\\\\\\":null,\\\\\\"format\\\\\\":\\\\\\"\\\\\\",\\\\\\"indent\\\\\\":0,\\\\\\"type\\\\\\":\\\\\\"paragraph\\\\\\",\\\\\\"version\\\\\\":1,\\\\\\"textFormat\\\\\\":0}],\\\\\\"direction\\\\\\":null,\\\\\\"format\\\\\\":\\\\\\"\\\\\\",\\\\\\"indent\\\\\\":0,\\\\\\"type\\\\\\":\\\\\\"root\\\\\\",\\\\\\"version\\\\\\":1}}\\"}"],"size":371,"type":"text/xml"}},{"path":"/notes/1","id":"id:1","hash":"1","content":{"data":["{\\"version\\":0,\\"data\\":\\"{\\\\\\"root\\\\\\":{\\\\\\"children\\\\\\":[{\\\\\\"children\\\\\\":[{\\\\\\"detail\\\\\\":0,\\\\\\"format\\\\\\":0,\\\\\\"mode\\\\\\":\\\\\\"normal\\\\\\",\\\\\\"style\\\\\\":\\\\\\"\\\\\\",\\\\\\"text\\\\\\":\\\\\\"abc2\\\\\\",\\\\\\"type\\\\\\":\\\\\\"extended-text\\\\\\",\\\\\\"version\\\\\\":1}],\\\\\\"direction\\\\\\":null,\\\\\\"format\\\\\\":\\\\\\"\\\\\\",\\\\\\"indent\\\\\\":0,\\\\\\"type\\\\\\":\\\\\\"paragraph\\\\\\",\\\\\\"version\\\\\\":1,\\\\\\"textFormat\\\\\\":0}],\\\\\\"direction\\\\\\":null,\\\\\\"format\\\\\\":\\\\\\"\\\\\\",\\\\\\"indent\\\\\\":0,\\\\\\"type\\\\\\":\\\\\\"root\\\\\\",\\\\\\"version\\\\\\":1}}\\"}"],"size":371,"type":"text/xml"}},{"path":"/notes/2","id":"id:2","hash":"2","content":{"data":["{\\"version\\":0,\\"data\\":\\"{\\\\\\"root\\\\\\":{\\\\\\"children\\\\\\":[{\\\\\\"children\\\\\\":[{\\\\\\"detail\\\\\\":0,\\\\\\"format\\\\\\":0,\\\\\\"mode\\\\\\":\\\\\\"normal\\\\\\",\\\\\\"style\\\\\\":\\\\\\"\\\\\\",\\\\\\"text\\\\\\":\\\\\\"abc3\\\\\\",\\\\\\"type\\\\\\":\\\\\\"extended-text\\\\\\",\\\\\\"version\\\\\\":1}],\\\\\\"direction\\\\\\":null,\\\\\\"format\\\\\\":\\\\\\"\\\\\\",\\\\\\"indent\\\\\\":0,\\\\\\"type\\\\\\":\\\\\\"paragraph\\\\\\",\\\\\\"version\\\\\\":1,\\\\\\"textFormat\\\\\\":0}],\\\\\\"direction\\\\\\":null,\\\\\\"format\\\\\\":\\\\\\"\\\\\\",\\\\\\"indent\\\\\\":0,\\\\\\"type\\\\\\":\\\\\\"root\\\\\\",\\\\\\"version\\\\\\":1}}\\"}"],"size":371,"type":"text/xml"}},{"path":"/notes/3","id":"id:3","hash":"3","content":{"data":["{\\"version\\":0,\\"data\\":\\"{\\\\\\"root\\\\\\":{\\\\\\"children\\\\\\":[{\\\\\\"children\\\\\\":[{\\\\\\"detail\\\\\\":0,\\\\\\"format\\\\\\":0,\\\\\\"mode\\\\\\":\\\\\\"normal\\\\\\",\\\\\\"style\\\\\\":\\\\\\"\\\\\\",\\\\\\"text\\\\\\":\\\\\\"abc4\\\\\\",\\\\\\"type\\\\\\":\\\\\\"extended-text\\\\\\",\\\\\\"version\\\\\\":1}],\\\\\\"direction\\\\\\":null,\\\\\\"format\\\\\\":\\\\\\"\\\\\\",\\\\\\"indent\\\\\\":0,\\\\\\"type\\\\\\":\\\\\\"paragraph\\\\\\",\\\\\\"version\\\\\\":1,\\\\\\"textFormat\\\\\\":0}],\\\\\\"direction\\\\\\":null,\\\\\\"format\\\\\\":\\\\\\"\\\\\\",\\\\\\"indent\\\\\\":0,\\\\\\"type\\\\\\":\\\\\\"root\\\\\\",\\\\\\"version\\\\\\":1}}\\"}"],"size":371,"type":"text/xml"}},{"path":"/notes/4","id":"id:4","hash":"4","content":{"data":["{\\"version\\":0,\\"data\\":\\"{\\\\\\"root\\\\\\":{\\\\\\"children\\\\\\":[{\\\\\\"children\\\\\\":[{\\\\\\"detail\\\\\\":0,\\\\\\"format\\\\\\":0,\\\\\\"mode\\\\\\":\\\\\\"normal\\\\\\",\\\\\\"style\\\\\\":\\\\\\"\\\\\\",\\\\\\"text\\\\\\":\\\\\\"abc5\\\\\\",\\\\\\"type\\\\\\":\\\\\\"extended-text\\\\\\",\\\\\\"version\\\\\\":1}],\\\\\\"direction\\\\\\":null,\\\\\\"format\\\\\\":\\\\\\"\\\\\\",\\\\\\"indent\\\\\\":0,\\\\\\"type\\\\\\":\\\\\\"paragraph\\\\\\",\\\\\\"version\\\\\\":1,\\\\\\"textFormat\\\\\\":0}],\\\\\\"direction\\\\\\":null,\\\\\\"format\\\\\\":\\\\\\"\\\\\\",\\\\\\"indent\\\\\\":0,\\\\\\"type\\\\\\":\\\\\\"root\\\\\\",\\\\\\"version\\\\\\":1}}\\"}"],"size":371,"type":"text/xml"}},{"path":"/notes/5","id":"id:5","hash":"5","content":{"data":["{\\"version\\":0,\\"data\\":\\"{\\\\\\"root\\\\\\":{\\\\\\"children\\\\\\":[{\\\\\\"children\\\\\\":[{\\\\\\"detail\\\\\\":0,\\\\\\"format\\\\\\":0,\\\\\\"mode\\\\\\":\\\\\\"normal\\\\\\",\\\\\\"style\\\\\\":\\\\\\"\\\\\\",\\\\\\"text\\\\\\":\\\\\\"abc6\\\\\\",\\\\\\"type\\\\\\":\\\\\\"extended-text\\\\\\",\\\\\\"version\\\\\\":1}],\\\\\\"direction\\\\\\":null,\\\\\\"format\\\\\\":\\\\\\"\\\\\\",\\\\\\"indent\\\\\\":0,\\\\\\"type\\\\\\":\\\\\\"paragraph\\\\\\",\\\\\\"version\\\\\\":1,\\\\\\"textFormat\\\\\\":0}],\\\\\\"direction\\\\\\":null,\\\\\\"format\\\\\\":\\\\\\"\\\\\\",\\\\\\"indent\\\\\\":0,\\\\\\"type\\\\\\":\\\\\\"root\\\\\\",\\\\\\"version\\\\\\":1}}\\"}"],"size":371,"type":"text/xml"}},{"path":"/notes/6","id":"id:6","hash":"6","content":{"data":["{\\"version\\":0,\\"data\\":\\"{\\\\\\"root\\\\\\":{\\\\\\"children\\\\\\":[{\\\\\\"children\\\\\\":[{\\\\\\"detail\\\\\\":0,\\\\\\"format\\\\\\":0,\\\\\\"mode\\\\\\":\\\\\\"normal\\\\\\",\\\\\\"style\\\\\\":\\\\\\"\\\\\\",\\\\\\"text\\\\\\":\\\\\\"abc7\\\\\\",\\\\\\"type\\\\\\":\\\\\\"extended-text\\\\\\",\\\\\\"version\\\\\\":1}],\\\\\\"direction\\\\\\":null,\\\\\\"format\\\\\\":\\\\\\"\\\\\\",\\\\\\"indent\\\\\\":0,\\\\\\"type\\\\\\":\\\\\\"paragraph\\\\\\",\\\\\\"version\\\\\\":1,\\\\\\"textFormat\\\\\\":0}],\\\\\\"direction\\\\\\":null,\\\\\\"format\\\\\\":\\\\\\"\\\\\\",\\\\\\"indent\\\\\\":0,\\\\\\"type\\\\\\":\\\\\\"root\\\\\\",\\\\\\"version\\\\\\":1}}\\"}"],"size":371,"type":"text/xml"}},{"path":"/notes/7","id":"id:7","hash":"7","content":{"data":["{\\"version\\":0,\\"data\\":\\"{\\\\\\"root\\\\\\":{\\\\\\"children\\\\\\":[{\\\\\\"children\\\\\\":[{\\\\\\"detail\\\\\\":0,\\\\\\"format\\\\\\":0,\\\\\\"mode\\\\\\":\\\\\\"normal\\\\\\",\\\\\\"style\\\\\\":\\\\\\"\\\\\\",\\\\\\"text\\\\\\":\\\\\\"abc8\\\\\\",\\\\\\"type\\\\\\":\\\\\\"extended-text\\\\\\",\\\\\\"version\\\\\\":1}],\\\\\\"direction\\\\\\":null,\\\\\\"format\\\\\\":\\\\\\"\\\\\\",\\\\\\"indent\\\\\\":0,\\\\\\"type\\\\\\":\\\\\\"paragraph\\\\\\",\\\\\\"version\\\\\\":1,\\\\\\"textFormat\\\\\\":0}],\\\\\\"direction\\\\\\":null,\\\\\\"format\\\\\\":\\\\\\"\\\\\\",\\\\\\"indent\\\\\\":0,\\\\\\"type\\\\\\":\\\\\\"root\\\\\\",\\\\\\"version\\\\\\":1}}\\"}"],"size":371,"type":"text/xml"}},{"path":"/notes_meta","hash":"/notes_meta","id":"id:/notes_meta","content":{"data":["{\\"version\\":0,\\"notes\\":[[\\"id:0\\",\\"/notes/0\\"],[\\"id:1\\",\\"/notes/1\\"],[\\"id:2\\",\\"/notes/2\\"],[\\"id:3\\",\\"/notes/3\\"],[\\"id:4\\",\\"/notes/4\\"],[\\"id:5\\",\\"/notes/5\\"],[\\"id:6\\",\\"/notes/6\\"],[\\"id:7\\",\\"/notes/7\\"]]}"],"size":183,"type":"text/xml"}}]');
            }
        );
    }
);