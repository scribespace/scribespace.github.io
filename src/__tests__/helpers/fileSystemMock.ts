import { FileSystem } from "@/interfaces/system/fileSystem/fileSystemInterface";
import { FileInfo, FileInfoResultType, FileResultType, FileSystemResult, FileSystemStatus, FileUploadMode } from "@interfaces/system/fileSystem/fileSystemShared";
import { $getFileManager } from "@systems/fileManager/fileManager";
import { variableExists } from "@utils";
import { vi } from "vitest";


export interface MockedFileInfo {
    hash: string,
    id: string,
    path: string,
}

export interface MockedFile extends MockedFileInfo {
    content: Blob;
}

export interface MockedFileSerialized extends MockedFileInfo {
    content: string;
}

vi.spyOn(global, 'Blob').mockImplementation(
    (args: BlobPart[] | undefined) => {
        class BlobMock {
            data: Uint8Array;
            size: number;
            type = 'text/xml';
            constructor( args: (string | Uint8Array)[] | undefined ) {
                this.size = 0;
                if ( variableExists(args) ) {
                    for ( const a of args ) {
                        this.size += a.length;
                    }

                    this.data = new Uint8Array(this.size);
                    let offset = 0; 
                    for ( const a of args ) {
                        const array = ArrayBuffer.isView(a) ? a : new TextEncoder().encode(a);

                        this.data.set( array, offset );
                        offset += a.length;
                    }
                } else {
                    this.data = new Uint8Array();
                }
            }

            arrayBuffer() {
                return new Promise<ArrayBuffer>((resolve)=> {resolve( this.data.buffer);});
            }
            
            stream() {
                throw new Error("Not implemented");
                return new ReadableStream();
            }
            
            slice() {
                return new Blob([structuredClone(this.data)]);
            }

            text() {
                return new Promise<string>( (resolve) => { resolve( new TextDecoder().decode( this.data ) ); } );
            }
        }

        return new BlobMock(args as string[] | undefined);
    }
);

const filesMapID = new Map<string, MockedFile>();
const filesMapBlob = new Map<Blob, MockedFile>();
const filesMapPath = new Map<string, MockedFile>();
const filesMapPathToID = new Map<string, string>();

function addFile( file: MockedFile ) {
    filesMapID.set( file.id, file );
    filesMapBlob.set( file.content, file );
    filesMapPath.set( file.path, file );
    filesMapPathToID.set( file.path, file.id );
}

function deleteFile( file: MockedFile ) {
    filesMapID.delete(file.id);
    filesMapPath.delete(file.path);
    filesMapPathToID.delete(file.path);
    filesMapBlob.delete(file.content);
}

function loadFile( path: string ) {
    return path.startsWith('id:') ? filesMapID.get(path) : filesMapPath.get(path);
}

function fileExists( path: string ) {
    return path.startsWith('id:') ? filesMapID.has(path) : filesMapPath.has(path);
}

export function $setMockedFiles( files: MockedFile[] ) {
    for ( const file of files ) {
        addFile(file);
    }
}

export function $clearMockedFiles() {
    filesMapID.clear();
    filesMapPath.clear();
    filesMapBlob.clear();
    filesMapPathToID.clear();
    $getFileManager().clear();
}

export function $getMockedFile( id: string ): MockedFile | undefined {
    return loadFile(id);
}

export function $getMockedFiles() {
    return [...filesMapID.values()];
}

const fileSystemStats = {
    uploadCount: 0,
    downloadCount: 0,
};

export function $resetFileSystemStats() {
    fileSystemStats.uploadCount = 0;
    fileSystemStats.downloadCount = 0;
}

export function $getFileSystemStats() {
    return fileSystemStats;
}

function fileSystemStatsAddUpload() {
    ++fileSystemStats.uploadCount;
}

function fileSystemStatsAddDownload() {
    ++fileSystemStats.downloadCount;
}

const fileSystemSettings = {
    callsDelay: 0,
};

export function $fileSystemSetDelay(delay: number) {
    fileSystemSettings.callsDelay = delay;
}

async function fakeWait() {
    if ( fileSystemSettings.callsDelay > 0 )
        await new Promise(resolve => setTimeout(resolve, fileSystemSettings.callsDelay));
}

vi.mock('@coreSystems', 
async (importOriginal) => {
    const mod = await importOriginal<typeof import('@coreSystems')>();
    return {
        ...mod,
        $getFileSystem: vi.fn<[], FileSystem>(
            () => {
                const fileSystem: FileSystem = {
                    calculateFileHashAsync: async function (content: Blob): Promise<string> {
                        return this.calculateFileHash(content);
                    },
                    getFileHashAsync: async function (path: string): Promise<string> {
                        return this.getFileHash(path);
                    },
                    getFileInfoAsync: async function (path: string): Promise<FileInfoResultType> {
                        return this.getFileInfo(path);
                    },
                    uploadFileAsync: async function (path: string, content: Blob, mode: FileUploadMode): Promise<FileInfoResultType> {
                        return this.uploadFile(path, content, mode);
                    },
                    downloadFileAsync: async function (path: string): Promise<FileResultType> {
                        return this.downloadFile(path);
                    },
                    deleteFileAsync: async function (path: string): Promise<FileSystemResult> {
                        return this.deleteFile(path);
                    },
                    getFileURLAsync: async function (path: string): Promise<string> {
                        return this.getFileURL(path);
                    },
                    registerFileSystemWorker: function (): void {
                        return;
                    },
                    calculateFileHash: async function (content: Blob): Promise<string> {
                        const mockedFile = filesMapBlob.get(content) || { hash: '0' };
                        return mockedFile.hash;
                    },
                    getFileHash: async function (path: string): Promise<string> {
                        await fakeWait();
                        const mockedFile = loadFile(path) || { hash: '0' };
                        return mockedFile.hash;
                    },
                    getFileInfo: async function (path: string): Promise<FileInfoResultType> {
                        await fakeWait();
                        const mockedFile = loadFile(path) || null;
                        if (mockedFile == null)
                            {
                                return { status: FileSystemStatus.NotFound };
                            }

                        return {
                            status: FileSystemStatus.Success,
                            fileInfo: {
                                hash: mockedFile.hash,
                                id: mockedFile.id,
                                path: mockedFile.path,
                                date: '2015-05-12T15:50:38Z'
                            }
                        };
                    },
                    uploadFile: async function (path: string, content: Blob, mode: FileUploadMode): Promise<FileInfoResultType> {
                        await fakeWait();

                        if ( path.startsWith('id:') && (mode === FileUploadMode.Add || !filesMapID.has(path) ) ) {
                            return {status: FileSystemStatus.NotFound };
                        }
                        fileSystemStatsAddUpload();
                        if ( mode === FileUploadMode.Add ) {
                            const mockedFile: MockedFile = { path: path, hash: path, id: 'id:'+path, content: content };
                            while (fileExists(mockedFile.path)) {
                                mockedFile.path += '1';
                                mockedFile.hash += '1';
                                mockedFile.id += '1';
                            }
                            
                            addFile(mockedFile);
                            return { status: FileSystemStatus.Success, fileInfo: { path: mockedFile.path, hash: mockedFile.hash, id: mockedFile.id, date: '2015-05-12T15:50:38Z' } };
                        }
                        let mockedFile = loadFile(path);
                        if ( variableExists(mockedFile) ) {
                            mockedFile.content = content;
                            mockedFile.hash += '1';
                        } else {
                            mockedFile = { path: path, hash: path, id: 'id:'+path, content: content };
                        }

                        addFile(mockedFile);
                        
                        return { status: FileSystemStatus.Success, fileInfo: { path: mockedFile.path, hash: mockedFile.hash, id: mockedFile.id, date: '2015-05-12T15:50:38Z' } };
                    },
                    downloadFile: async function (path: string): Promise<FileResultType> {
                        await fakeWait();

                        const mockedFile = loadFile(path);
                        if (!variableExists(mockedFile)) {
                            return { status: FileSystemStatus.NotFound };
                        }
                        fileSystemStatsAddDownload();
                        return {
                            status: FileSystemStatus.Success,
                            content: mockedFile.content, 
                            fileInfo: { hash: mockedFile.hash, id: mockedFile.id, path: mockedFile.path, date: '2015-05-12T15:50:38Z' }
                        };
                    },
                    deleteFile: async function (path: string): Promise<FileSystemResult> {
                        await fakeWait();
                        if (!fileExists(path)) return { status: FileSystemStatus.NotFound };

                        deleteFile(loadFile(path)!);

                        return {
                            status: FileSystemStatus.Success
                        };
                    },
                    getFileURL: async function (path: string): Promise<string> {
                        await fakeWait();
                        if (!fileExists(path)) return '';

                        return 'https://' + path + '.com';
                    },
                    getFileList: async function (dirPath: string, callback: (list: FileInfo[]) => void): Promise<FileSystemResult> {
                        await fakeWait();
                        const fileList: FileInfo[] = [];
                        for (const [filePath,file] of filesMapPath) {
                            if (filePath.startsWith(dirPath)) {
                                fileList.push( {hash: file.hash, id: file.id, path: file.path, date: '2015-05-12T15:50:38Z'} );
                            }
                        }
                        callback(fileList);
                        return {status: FileSystemStatus.Success};
                    },
                    isFileID: function (path: string): boolean {
                        return path.startsWith('id:');
                    },
                };
                
                return fileSystem;
            }
        )
    };
});