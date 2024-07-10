import { $clearMockedFiles, $getMockedFile, $setMockedFiles, MockedFile } from "../helpers/fileSystemMock";
import { ReactTest, reactSetup } from "../helpers/prepareReact";
import '../helpers/workerMock';

import { $getTreeManager } from "@systems/treeManager";
import { afterAll, afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { DefaultTestDataLoader } from "../helpers/testDataLoader";
import { $getFileManager } from "@systems/fileManager/fileManager";


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
                path: '/tree',
                id: `id:${'/tree'}`,
                hash: '/tree',
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
        test('pre V -> V1',
           async () => {
               expect(JSON.stringify($getTreeManager().data)).toBe('[{"id":"0","name":"0","children":[{"id":"1","name":"1","children":[]}]},{"id":"2","name":"2","children":[{"id":"3","name":"3","children":[{"id":"4","name":"4","children":[{"id":"5","name":"5","children":[]}]},{"id":"6","name":"6","children":[{"id":"7","name":"7","children":[]}]}]}]}]');
               
               await $getFileManager().flush();

                const treeJSON = JSON.stringify( $getTreeManager().__test__serializeTreeData() );
                expect(treeJSON).toBe('{"version":1,"treeNodeLastID":8,"treeNotesMap":[{"treeNodeID":"0","noteID":"id:0"},{"treeNodeID":"1","noteID":"id:1"},{"treeNodeID":"2","noteID":"id:2"},{"treeNodeID":"3","noteID":"id:3"},{"treeNodeID":"4","noteID":"id:4"},{"treeNodeID":"5","noteID":"id:5"},{"treeNodeID":"6","noteID":"id:6"},{"treeNodeID":"7","noteID":"id:7"}],"treeNodes":[{"id":"0","name":"0","children":[{"id":"1","name":"1","children":[]}]},{"id":"2","name":"2","children":[{"id":"3","name":"3","children":[{"id":"4","name":"4","children":[{"id":"5","name":"5","children":[]}]},{"id":"6","name":"6","children":[{"id":"7","name":"7","children":[]}]}]}]}]}');

                const notesArray: Array<Promise<string>> = new Array(8);
                for (let i = 0; i < 8; ++i ) {
                    notesArray[i] = $getMockedFile(`/notes/${i}`)!.content.text();
                }
                const notes = (await Promise.all( notesArray )).join(',');
                expect(notes).toBe('{"version":0,"data":"{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"abc1\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":null,\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":null,\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"},{"version":0,"data":"{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"abc2\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":null,\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":null,\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"},{"version":0,"data":"{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"abc3\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":null,\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":null,\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"},{"version":0,"data":"{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"abc4\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":null,\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":null,\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"},{"version":0,"data":"{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"abc5\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":null,\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":null,\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"},{"version":0,"data":"{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"abc6\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":null,\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":null,\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"},{"version":0,"data":"{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"abc7\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":null,\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":null,\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"},{"version":0,"data":"{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"abc8\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":null,\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":null,\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"}');
            }
        );
    }
);