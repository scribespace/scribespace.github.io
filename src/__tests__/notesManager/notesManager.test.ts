import '../helpers/cryptoMock';
import '../helpers/workerMock';
import { $clearMockedFiles, $fileSystemSetDelay, $getMockedFiles, $resetFileSystemStats, $setMockedFiles, MockedFile, MockedFileSerialized } from "../helpers/fileSystemMock";
import { $getFileManager } from '@systems/fileManager/fileManager';


import { $getNotesManager } from "@systems/notesManager";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";


afterEach(
    () => {
        $clearMockedFiles();
        $resetFileSystemStats();
    }
);

afterAll(
    () => {
      vi.useRealTimers();
        vi.clearAllMocks();
        $fileSystemSetDelay(0);
    }
);

beforeAll(
    () => {
      const date = new Date(0);
      vi.useFakeTimers({toFake:['Date']});
      vi.setSystemTime(date);
      $fileSystemSetDelay(100);
    }
);

beforeEach( 
    async () => {
        const files: MockedFile[] = [
          {
            path: "/notes/0",
            hash: "/notes/0",
            id: "id:/notes/0",
            content: new Blob(["{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"0\",\"type\":\"extended-text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1,\"textFormat\":0}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}"]),
          },
          {
            path: "/notes/1",
            hash: "/notes/1",
            id: "id:/notes/1",
            content: new Blob(["{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"1\",\"type\":\"extended-text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1,\"textFormat\":0}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}"]),
          },
          {
            path: "/notes/2",
            hash: "/notes/2",
            id: "id:/notes/2",
            content: new Blob(["{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"2\",\"type\":\"extended-text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1,\"textFormat\":0}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}"]),
          },
          {
            path: "/notes/3",
            hash: "/notes/3",
            id: "id:/notes/3",
            content: new Blob(["{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"3\",\"type\":\"extended-text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1,\"textFormat\":0}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}"]),
          },
          {
            path: "/notes/4",
            hash: "/notes/4",
            id: "id:/notes/4",
            content: new Blob(["{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"4\",\"type\":\"extended-text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1,\"textFormat\":0}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}"]),
          },
          {
            path: "/notes/5",
            hash: "/notes/5",
            id: "id:/notes/5",
            content: new Blob(["{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"5\",\"type\":\"extended-text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1,\"textFormat\":0}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}"]),
          },
          {
            path: "/notes/6",
            hash: "/notes/6",
            id: "id:/notes/6",
            content: new Blob(["{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"6\",\"type\":\"extended-text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1,\"textFormat\":0}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}"]),
          },
          {
            path: "/notes/7",
            hash: "/notes/7",
            id: "id:/notes/7",
            content: new Blob(["<p>dsadsasdsadsa<img src=\"https://www.test-image.com\">dsadsadsadsad</p>"]),
          }
        ];
        $setMockedFiles(files);
    }
);

describe('NotesManager:',
async () => {
        test('Create Note',
            async () => {
                const fileInfo = await $getNotesManager().createNote();
                expect(JSON.stringify(fileInfo)).toBe('{"path":"/notes/scribe-space-id-00","hash":"/notes/scribe-space-id-00","id":"id:/notes/scribe-space-id-00","date":"2015-05-12T15:50:38Z"}');
            }
        );

        test('Load Note',
            async () => {
                const note = await $getNotesManager().loadNote('id:/notes/6');
                expect(JSON.stringify(note)).toBe('{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"6","type":"extended-text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}');
            }
        );

        test('Load-Convert Note',
            async () => {
                const note = await $getNotesManager().loadNote('id:/notes/7');
                expect(JSON.stringify(note)).toBe('{"version":0,"data":"{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"dsadsasdsadsa\\",\\"type\\":\\"extended-text\\",\\"version\\":1},{\\"src\\":\\"https://www.test-image.com/\\",\\"filePath\\":\\"\\",\\"type\\":\\"image\\",\\"version\\":2},{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"dsadsadsadsad\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":null,\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":null,\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"}');
              }
        );

        test('Store Note',
            async () => {
                const editorState = {
                  root: {
                    children: [
                      {
                        children: [
                          {
                            detail: 0,
                            format: 0,
                            mode: "normal",
                            style: "",
                            text: "dsadsasdsadsa",
                            type: "extended-text",
                            version: 1
                          },
                          {
                            src: "https: //www.test-image.com/",
                            type: "image",
                            version: 1
                          },
                          {
                            detail: 0,
                            format: 0,
                            mode: "normal",
                            style: "",
                            text: "dsadsadsadsad",
                            type: "extended-text",
                            version: 1
                          }
                        ],
                        direction: null,
                        format: "",
                        indent: 0,
                        type: "paragraph",
                        version: 1,
                        textFormat: 0
                      }
                    ],
                    direction: null,
                    format: "",
                    indent: 0,
                    type: "root",
                    version: 1
                  }
                };

                $getNotesManager().loadNote('id:/notes/7');
                $getNotesManager().storeNote('id:/notes/7', JSON.stringify(editorState) );

                await $getFileManager().flush();

                const files = $getMockedFiles();
                const filesSerialized: MockedFileSerialized[] = [];
                for ( const f of files ) {
                    filesSerialized.push( {...f, content: await f.content.text()} );
                }

                expect(JSON.stringify(filesSerialized)).toBe('[{"path":"/notes/0","hash":"/notes/0","id":"id:/notes/0","content":"{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"0\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"},{"path":"/notes/1","hash":"/notes/1","id":"id:/notes/1","content":"{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"1\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"},{"path":"/notes/2","hash":"/notes/2","id":"id:/notes/2","content":"{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"2\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"},{"path":"/notes/3","hash":"/notes/3","id":"id:/notes/3","content":"{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"3\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"},{"path":"/notes/4","hash":"/notes/4","id":"id:/notes/4","content":"{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"4\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"},{"path":"/notes/5","hash":"/notes/5","id":"id:/notes/5","content":"{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"5\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"},{"path":"/notes/6","hash":"/notes/6","id":"id:/notes/6","content":"{\\"root\\":{\\"children\\":[{\\"children\\":[{\\"detail\\":0,\\"format\\":0,\\"mode\\":\\"normal\\",\\"style\\":\\"\\",\\"text\\":\\"6\\",\\"type\\":\\"extended-text\\",\\"version\\":1}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"paragraph\\",\\"version\\":1,\\"textFormat\\":0}],\\"direction\\":\\"ltr\\",\\"format\\":\\"\\",\\"indent\\":0,\\"type\\":\\"root\\",\\"version\\":1}}"},{"path":"/notes/7","hash":"/notes/711","id":"id:/notes/7","content":"{\\"version\\":0,\\"data\\":\\"{\\\\\\"root\\\\\\":{\\\\\\"children\\\\\\":[{\\\\\\"children\\\\\\":[{\\\\\\"detail\\\\\\":0,\\\\\\"format\\\\\\":0,\\\\\\"mode\\\\\\":\\\\\\"normal\\\\\\",\\\\\\"style\\\\\\":\\\\\\"\\\\\\",\\\\\\"text\\\\\\":\\\\\\"dsadsasdsadsa\\\\\\",\\\\\\"type\\\\\\":\\\\\\"extended-text\\\\\\",\\\\\\"version\\\\\\":1},{\\\\\\"src\\\\\\":\\\\\\"https://www.test-image.com/\\\\\\",\\\\\\"filePath\\\\\\":\\\\\\"\\\\\\",\\\\\\"type\\\\\\":\\\\\\"image\\\\\\",\\\\\\"version\\\\\\":2},{\\\\\\"detail\\\\\\":0,\\\\\\"format\\\\\\":0,\\\\\\"mode\\\\\\":\\\\\\"normal\\\\\\",\\\\\\"style\\\\\\":\\\\\\"\\\\\\",\\\\\\"text\\\\\\":\\\\\\"dsadsadsadsad\\\\\\",\\\\\\"type\\\\\\":\\\\\\"extended-text\\\\\\",\\\\\\"version\\\\\\":1}],\\\\\\"direction\\\\\\":null,\\\\\\"format\\\\\\":\\\\\\"\\\\\\",\\\\\\"indent\\\\\\":0,\\\\\\"type\\\\\\":\\\\\\"paragraph\\\\\\",\\\\\\"version\\\\\\":1,\\\\\\"textFormat\\\\\\":0}],\\\\\\"direction\\\\\\":null,\\\\\\"format\\\\\\":\\\\\\"\\\\\\",\\\\\\"indent\\\\\\":0,\\\\\\"type\\\\\\":\\\\\\"root\\\\\\",\\\\\\"version\\\\\\":1}}\\"}"}]');
              }
        );
    }
);