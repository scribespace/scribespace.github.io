import { FileSystem } from "@/interfaces/system/fileSystem/fileSystemInterface";
import { FileInfo, FileInfoResultType, FileResultType, FileSystemResult, FileSystemStatus, FileUploadMode } from "@interfaces/system/fileSystem/fileSystemShared";
import { variableExists } from "@utils";
import { vi } from "vitest";


export interface MockedFileInfo {
    hash: string,
    id: string,
    path: string,
}

export interface MockedFile extends MockedFileInfo {
    content: Blob
}

export interface MockedFileFlat extends MockedFileInfo {
    content: string,
}

vi.spyOn(global, 'Blob').mockImplementation(
    (args: BlobPart[] | undefined) => {
        class BlobMock {
            data: string[];
            size: number;
            type = 'text/xml';
            constructor( args: string[] | undefined ) {
                this.data = args || [];
                this.size = this.data.toString().length;
            }

            arrayBuffer() {
                return new Promise<ArrayBuffer>((resolve)=> {resolve( new ArrayBuffer(0));});
            }
            
            stream() {
                throw new Error("Not implemented");
                return new ReadableStream();
            }
            
            slice() {
                return new Blob([]);
            }

            text() {
                return new Promise<string>( (resolve) => { resolve( this.data.toString() ); } );
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
}

export function $getMockedFiles() {
    return [...filesMapID.values()];
}

export function $getMockedFilesJSON(): string {
    return JSON.stringify([...filesMapID.values()]);
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
                        const mockedFile = loadFile(path) || { hash: '0' };
                        return mockedFile.hash;
                    },
                    getFileInfo: async function (path: string): Promise<FileInfoResultType> {
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
                                path: mockedFile.path
                            }
                        };
                    },
                    uploadFile: async function (path: string, content: Blob, mode: FileUploadMode): Promise<FileInfoResultType> {
                        if ( path.startsWith('id:') && (mode === FileUploadMode.Add || !filesMapID.has(path) ) ) {
                            return {status: FileSystemStatus.NotFound };
                        }

                        if ( mode === FileUploadMode.Add ) {
                            const mockedFile: MockedFile = { path: path, hash: path, id: 'id:'+path, content: content };
                            while (fileExists(mockedFile.path)) {
                                mockedFile.path += '1';
                                mockedFile.hash += '1';
                                mockedFile.id += '1';
                            }

                            return { status: FileSystemStatus.Success, fileInfo: { path: mockedFile.path, hash: mockedFile.hash, id: mockedFile.id } };
                        }
                        let mockedFile = loadFile(path);
                        if ( variableExists(mockedFile) ) {
                            mockedFile.content = content;
                        } else {
                            mockedFile = { path: path, hash: path, id: 'id:'+path, content: content };
                        }

                        addFile(mockedFile);
                        
                        return { status: FileSystemStatus.Success, fileInfo: { path: mockedFile.path, hash: mockedFile.hash, id: mockedFile.id } };
                    },
                    downloadFile: async function (path: string): Promise<FileResultType> {
                        const mockedFile = loadFile(path);
                        if (!variableExists(mockedFile)) {
                            return { status: FileSystemStatus.NotFound };
                        }

                        return {
                            status: FileSystemStatus.Success,
                            file: { content: mockedFile.content, info: { hash: mockedFile.hash, id: mockedFile.id, path: mockedFile.path } }
                        };
                    },
                    deleteFile: async function (path: string): Promise<FileSystemResult> {
                        if (!fileExists(path)) return { status: FileSystemStatus.NotFound };

                        deleteFile(loadFile(path)!);

                        return {
                            status: FileSystemStatus.Success
                        };
                    },
                    getFileURL: async function (path: string): Promise<string> {
                        if (!fileExists(path)) return '';

                        return 'https://' + path + '.com';
                    },
                    getFileList: async function (dirPath: string, callback: (list: FileInfo[]) => void/*, onerror: (error: unknown) => void*/): Promise<void> {
                        const fileList: FileInfo[] = [];
                        for (const [filePath,file] of filesMapPath) {
                            if (filePath.startsWith(dirPath)) {
                                fileList.push( {hash: file.hash, id: file.id, path: file.path} );
                            }
                        }
                        callback(fileList);
                    },
                    isPathID: function (path: string): boolean {
                        return path.startsWith('id:');
                    }
                };
                
                return fileSystem;
            }
        )
    };
});