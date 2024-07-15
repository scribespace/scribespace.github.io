import { $clearMockedFiles, $fileSystemSetDelay, $getFileSystemStats, $getMockedFilesJSON, $resetFileSystemStats, $setMockedFiles, MockedFile } from "../helpers/fileSystemMock";

import { $getFileManager, FileOperationResult, FileOperationResultType } from "@systems/fileManager/fileManager";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";


afterEach(
    () => {
        $clearMockedFiles();
        $resetFileSystemStats();
    }
);

afterAll(
    () => {
        vi.clearAllMocks();
        $fileSystemSetDelay(0);
    }
);

beforeAll(
    () => {
        $fileSystemSetDelay(100);
    }
);

beforeEach( 
    async () => {
        const files: MockedFile[] = [
  
        ];
        $setMockedFiles(files);
    }
);

describe('FileManager:',
async () => {
        test('Upload Multiple Files',
            async () => {
                const fileContent = {
                  root: {
                    children: [
                      {
                        children: [
                          {
                            detail: 0,
                            format: 0,
                            mode: "normal",
                            style: "",
                            text: "",
                            type: "extended-text",
                            version: 1,
                          },
                        ],
                        direction: "ltr",
                        format: "",
                        indent: 0,
                        type: "paragraph",
                        version: 1,
                        textFormat: 0,
                      },
                    ],
                    direction: "ltr",
                    format: "",
                    indent: 0,
                    type: "root",
                    version: 1,
                  },
                };

                for ( let i = 0; i < 8; ++i ) {
                    const file = structuredClone(fileContent);
                    file.root.children[0].children[0].text = i.toString();
                    $getFileManager().createFile(`/notes/${i}`, new Blob([JSON.stringify(file)]));
                }
                expect(await $getMockedFilesJSON()).toBe('[{"path":"/notes/0","hash":"/notes/0","id":"id:/notes/0","content":{"data":["{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"0\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"],"size":289,"type":"text/xml"}},{"path":"/notes/1","hash":"/notes/1","id":"id:/notes/1","content":{"data":["{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"1\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"],"size":289,"type":"text/xml"}},{"path":"/notes/2","hash":"/notes/2","id":"id:/notes/2","content":{"data":["{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"2\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"],"size":289,"type":"text/xml"}},{"path":"/notes/3","hash":"/notes/3","id":"id:/notes/3","content":{"data":["{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"3\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"],"size":289,"type":"text/xml"}},{"path":"/notes/4","hash":"/notes/4","id":"id:/notes/4","content":{"data":["{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"4\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"],"size":289,"type":"text/xml"}},{"path":"/notes/5","hash":"/notes/5","id":"id:/notes/5","content":{"data":["{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"5\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"],"size":289,"type":"text/xml"}},{"path":"/notes/6","hash":"/notes/6","id":"id:/notes/6","content":{"data":["{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"6\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"],"size":289,"type":"text/xml"}},{"path":"/notes/7","hash":"/notes/7","id":"id:/notes/7","content":{"data":["{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"7\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"],"size":289,"type":"text/xml"}}]');
                expect($getFileSystemStats().uploadCount).toBe(8);
            }
        );

        test('Upload Same Files - Add',
        async () => {
            const fileContent = {
              root: {
                children: [
                  {
                    children: [
                      {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "",
                        type: "extended-text",
                        version: 1,
                      },
                    ],
                    direction: "ltr",
                    format: "",
                    indent: 0,
                    type: "paragraph",
                    version: 1,
                    textFormat: 0,
                  },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "root",
                version: 1,
              },
            };

            for ( let i = 0; i < 8; ++i ) {
                const file = structuredClone(fileContent);
                file.root.children[0].children[0].text = i.toString();
                $getFileManager().createFile(`/notes/0`, new Blob([JSON.stringify(file)]));
            }

            expect(await $getMockedFilesJSON()).toBe('[{"path":"/notes/0","hash":"/notes/0","id":"id:/notes/0","content":{"data":["{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"0\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"],"size":289,"type":"text/xml"}},{"path":"/notes/01","hash":"/notes/01","id":"id:/notes/01","content":{"data":["{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"1\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"],"size":289,"type":"text/xml"}},{"path":"/notes/011","hash":"/notes/011","id":"id:/notes/011","content":{"data":["{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"2\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"],"size":289,"type":"text/xml"}},{"path":"/notes/0111","hash":"/notes/0111","id":"id:/notes/0111","content":{"data":["{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"3\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"],"size":289,"type":"text/xml"}},{"path":"/notes/01111","hash":"/notes/01111","id":"id:/notes/01111","content":{"data":["{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"4\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"],"size":289,"type":"text/xml"}},{"path":"/notes/011111","hash":"/notes/011111","id":"id:/notes/011111","content":{"data":["{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"5\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"],"size":289,"type":"text/xml"}},{"path":"/notes/0111111","hash":"/notes/0111111","id":"id:/notes/0111111","content":{"data":["{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"6\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"],"size":289,"type":"text/xml"}},{"path":"/notes/01111111","hash":"/notes/01111111","id":"id:/notes/01111111","content":{"data":["{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"7\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"],"size":289,"type":"text/xml"}}]');
            expect($getFileSystemStats().uploadCount).toBe(8);
        });

        test('Upload Same Files - Replace',
        async () => {
            const fileContent = {
              root: {
                children: [
                  {
                    children: [
                      {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "",
                        type: "extended-text",
                        version: 1,
                      },
                    ],
                    direction: "ltr",
                    format: "",
                    indent: 0,
                    type: "paragraph",
                    version: 1,
                    textFormat: 0,
                  },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "root",
                version: 1,
              },
            };

            const fileHandle = ((await $getFileManager().createFile('/notes/0', new Blob(['']))) as FileOperationResult).handle;
            $resetFileSystemStats();
            const invalidCacheFunction = vi.fn();

            for ( let i = 0; i < 8; ++i ) {
                const file = structuredClone(fileContent);
                file.root.children[0].children[0].text = i.toString();
                $getFileManager().uploadFile(fileHandle, new Blob([JSON.stringify(file)]), invalidCacheFunction);
            }

            expect(await $getMockedFilesJSON()).toBe('[{"path":"/notes/0","hash":"/notes/01","id":"id:/notes/0","content":{"data":["{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"7\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"],"size":289,"type":"text/xml"}}]');
            expect($getFileSystemStats().uploadCount).toBe(1);
            expect(invalidCacheFunction).not.toHaveBeenCalled();
        });

        test('Download - One File, Multiple Times', 
            async () => {
                const files: MockedFile[] = [
                    {
                        path: '/tree',
                        id: `id:/tree`,
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

                const promises: Promise<FileOperationResultType>[] = [];
                for ( let i = 0; i < 8; ++i ) {
                    promises.push($getFileManager().downloadFile('id:7'));
                }

                const filesDownloaded = await Promise.all(promises);
                expect($getFileSystemStats().downloadCount).toBe(1);

                expect(JSON.stringify(filesDownloaded[0])).toBe('{"handle":{"fileID":"id:7","version":0},"file":{"status":1,"content":{"data":["abc8"],"size":4,"type":"text/xml"},"fileInfo":{"hash":"7","id":"id:7","path":"7","date":"2015-05-12T15:50:38Z"}},"status":1}');
            }
        );

        test('Download - Multiple Files', 
            async () => {
                const files: MockedFile[] = [
                    {
                        path: '/tree',
                        id: `id:/tree`,
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

                const promises: Promise<FileOperationResultType>[] = [];
                for ( let i = 0; i < 8; ++i ) {
                    promises.push($getFileManager().downloadFile(`id:${i}`));
                }

                const filesDownloaded = await Promise.all(promises);
                expect($getFileSystemStats().downloadCount).toBe(8);

                expect(JSON.stringify(filesDownloaded)).toBe('[{"handle":{"fileID":"id:0","version":0},"file":{"status":1,"content":{"data":["abc1"],"size":4,"type":"text/xml"},"fileInfo":{"hash":"0","id":"id:0","path":"0","date":"2015-05-12T15:50:38Z"}},"status":1},{"handle":{"fileID":"id:1","version":0},"file":{"status":1,"content":{"data":["abc2"],"size":4,"type":"text/xml"},"fileInfo":{"hash":"1","id":"id:1","path":"1","date":"2015-05-12T15:50:38Z"}},"status":1},{"handle":{"fileID":"id:2","version":0},"file":{"status":1,"content":{"data":["abc3"],"size":4,"type":"text/xml"},"fileInfo":{"hash":"2","id":"id:2","path":"2","date":"2015-05-12T15:50:38Z"}},"status":1},{"handle":{"fileID":"id:3","version":0},"file":{"status":1,"content":{"data":["abc4"],"size":4,"type":"text/xml"},"fileInfo":{"hash":"3","id":"id:3","path":"3","date":"2015-05-12T15:50:38Z"}},"status":1},{"handle":{"fileID":"id:4","version":0},"file":{"status":1,"content":{"data":["abc5"],"size":4,"type":"text/xml"},"fileInfo":{"hash":"4","id":"id:4","path":"4","date":"2015-05-12T15:50:38Z"}},"status":1},{"handle":{"fileID":"id:5","version":0},"file":{"status":1,"content":{"data":["abc6"],"size":4,"type":"text/xml"},"fileInfo":{"hash":"5","id":"id:5","path":"5","date":"2015-05-12T15:50:38Z"}},"status":1},{"handle":{"fileID":"id:6","version":0},"file":{"status":1,"content":{"data":["abc7"],"size":4,"type":"text/xml"},"fileInfo":{"hash":"6","id":"id:6","path":"6","date":"2015-05-12T15:50:38Z"}},"status":1},{"handle":{"fileID":"id:7","version":0},"file":{"status":1,"content":{"data":["abc8"],"size":4,"type":"text/xml"},"fileInfo":{"hash":"7","id":"id:7","path":"7","date":"2015-05-12T15:50:38Z"}},"status":1}]');
            }
        );
    }
);