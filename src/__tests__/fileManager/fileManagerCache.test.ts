import { FileSystemStatus } from "@interfaces/system/fileSystem/fileSystemShared";
import { $clearMockedFiles, $getFileSystemStats, $resetFileSystemStats, $setMockedFiles, MockedFile } from "../helpers/fileSystemMock";

import { $callCommand } from "@systems/commandsManager/commandsManager";
import { $getFileManager, FILE_CACHE_COUNT, FILE_CHANGE_VALID_PERIOD, FileOperationResult, FileUploadReplaceResolve, _test_getNewFileManager } from "@systems/fileManager/fileManager";
import { APP_GET_FOCUS } from "@systems/systemCommands";
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
        vi.useRealTimers();
    }
);

beforeAll(
    () => {
        const date = new Date(0);
        vi.useFakeTimers();
        vi.setSystemTime(date);
    }
);

beforeEach( 
    async () => {
        const files: MockedFile[] = [];
        for ( let i = 0; i < FILE_CACHE_COUNT + 1; ++i ) {
            files.push(
                {
                    path: i.toString(),
                    id: `id:${i.toString()}`,
                    hash: i.toString(),
                    content: new Blob(['Test'])
                }
            );
        }
        $setMockedFiles(files);
    }
);

describe('FileManagerCache:',
async () => {
        test('Download from cache',
            async () => {
                await $getFileManager().downloadFile('id:0');
                const fileHandle = await $getFileManager().downloadFile('id:0');

                expect(fileHandle.status).toBe( FileSystemStatus.Success );
                const fileResult = fileHandle as FileOperationResult;
                expect( await fileResult.file.content.text() ).toBe('Test');
                expect( $getFileSystemStats().downloadCount ).toBe(1);
            }
        );

        test('Download from cache',
            async () => {
                const fileOperation0 = await $getFileManager().downloadFile('id:0');
                expect(fileOperation0.status).toBe( FileSystemStatus.Success );
                const fileHandle0 = (fileOperation0 as FileOperationResult).handle;
                await $getFileManager().uploadFile( fileHandle0, new Blob(['Test1']), () => { throw new Error(); } );

                const fileOperation1 = await $getFileManager().downloadFile('id:0');

                expect(fileOperation1.status).toBe( FileSystemStatus.Success );
                const fileResult = fileOperation1 as FileOperationResult;
                expect( await fileResult.file.content.text() ).toBe('Test1');
                expect( $getFileSystemStats().downloadCount ).toBe(1);
            }
        );

        test('Invalidate cache - writing',
            async () => {
                const fileOperation0 = await $getFileManager().downloadFile('id:0');

                const tmpFileManager = _test_getNewFileManager();
                const fileOperation1 = await tmpFileManager.downloadFile('id:0');

                expect( $getFileSystemStats().downloadCount ).toBe(2);

                expect(fileOperation0.status).toBe( FileSystemStatus.Success );
                const fileHandle0 = (fileOperation0 as FileOperationResult).handle;
                await $getFileManager().uploadFile( fileHandle0, new Blob(['Test1']), () => { throw new Error(); } );
                
                expect(fileOperation1.status).toBe( FileSystemStatus.Success );
                const fileHandle1 = (fileOperation1 as FileOperationResult).handle;
                
                const currentTime = new Date().getTime();
                const date = new Date(currentTime + FILE_CHANGE_VALID_PERIOD * 2);
                vi.setSystemTime(date);
                
                const invalidCallackFunction = vi.fn((_fileID: string, _filePath: string, _targetVersion: number, oldResolve: FileUploadReplaceResolve)=>{oldResolve({status: FileSystemStatus.Success, fileInfo: {date: '', hash: '', id: '', path: ''}});});
                await tmpFileManager.uploadFile( fileHandle1, new Blob(['Test2']), invalidCallackFunction );

                expect(invalidCallackFunction).toHaveBeenCalled();
            }
        );

        test('Invalidate cache - onfocus',
            async () => {
                const fileOperation0 = await $getFileManager().downloadFile('id:0');

                const tmpFileManager = _test_getNewFileManager();
                const fileOperation1 = await tmpFileManager.downloadFile('id:0');

                expect( $getFileSystemStats().downloadCount ).toBe(2);

                expect(fileOperation0.status).toBe( FileSystemStatus.Success );
                const fileHandle0 = (fileOperation0 as FileOperationResult).handle;
                await $getFileManager().uploadFile( fileHandle0, new Blob(['Test1']), () => { throw new Error(); } );
                
                expect(fileOperation1.status).toBe( FileSystemStatus.Success );
                const fileHandle1 = (fileOperation1 as FileOperationResult).handle;
                
                $callCommand(APP_GET_FOCUS, undefined);
                await tmpFileManager.flush();

                const invalidCallackFunction = vi.fn((_fileID: string, _filePath: string, _targetVersion: number, oldResolve: FileUploadReplaceResolve)=>{oldResolve({status: FileSystemStatus.Success, fileInfo: {date: '', hash: '', id: '', path: ''}});});
                await tmpFileManager.uploadFile( fileHandle1, new Blob(['Test2']), invalidCallackFunction );

                expect(invalidCallackFunction).toHaveBeenCalled();
            }
        );
    }
);