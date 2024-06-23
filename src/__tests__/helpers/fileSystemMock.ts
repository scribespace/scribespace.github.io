import { FileSystem } from "@/interfaces/system/fileSystem/fileSystemInterface";
import { DeleteResults, DownloadResult, File, FileSystemStatus, FileUploadMode, InfoResult } from "@interfaces/system/fileSystem/fileSystemShared";
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

function addFile( file: MockedFile ) {
    filesMapID.set( file.id, file );
    filesMapBlob.set( file.content, file );
    filesMapPath.set( file.path, file );
}

function deleteFile( file: MockedFile ) {
    filesMapID.delete(file.id);
    filesMapPath.delete(file.path);
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
                    calculateFileHashAsync: async function (file: File): Promise<string> {
                        return this.calculateFileHash(file);
                    },
                    getFileHashAsync: async function (path: string): Promise<string> {
                        return this.getFileHash(path);
                    },
                    getFileInfoAsync: async function (path: string): Promise<InfoResult> {
                        return this.getFileInfo(path);
                    },
                    uploadFileAsync: async function (path: string, file: File, mode: FileUploadMode): Promise<InfoResult> {
                        return this.uploadFile(path, file, mode);
                    },
                    downloadFileAsync: async function (path: string): Promise<DownloadResult> {
                        return this.downloadFile(path);
                    },
                    deleteFileAsync: async function (path: string): Promise<DeleteResults> {
                        return this.deleteFile(path);
                    },
                    getFileURLAsync: async function (path: string): Promise<string> {
                        return this.getFileURL(path);
                    },
                    registerFileSystemWorker: function (): void {
                        return;
                    },
                    calculateFileHash: async function (file: File): Promise<string> {
                        if (file.content == null)
                            return '0';

                        const mockedFile = filesMapBlob.get(file.content) || { hash: '0' };
                        return mockedFile.hash;
                    },
                    getFileHash: async function (path: string): Promise<string> {
                        const mockedFile = loadFile(path) || { hash: '0' };
                        return mockedFile.hash;
                    },
                    getFileInfo: async function (path: string): Promise<InfoResult> {
                        const mockedFile = loadFile(path) || null;
                        if (mockedFile == null)
                            return { status: FileSystemStatus.NotFound };

                        return {
                            status: FileSystemStatus.Success,
                            fileInfo: {
                                hash: mockedFile.hash,
                                id: mockedFile.id,
                                path: mockedFile.path
                            }
                        };
                    },
                    uploadFile: async function (path: string, file: File, mode: FileUploadMode): Promise<InfoResult> {
                        const mockedFile: MockedFile = { path: path, hash: path, id: 'id:' + path, content: file.content! };
                        if (mode === FileUploadMode.Add) {
                            while (fileExists(mockedFile.path)) {
                                mockedFile.path += '1';
                                mockedFile.hash += '1';
                                mockedFile.id += '1';
                            }
                        }

                        addFile(mockedFile);

                        return { status: FileSystemStatus.Success, fileInfo: { path: mockedFile.path, hash: mockedFile.hash, id: mockedFile.id } };
                    },
                    downloadFile: async function (path: string): Promise<DownloadResult> {
                        const mockedFile = loadFile(path);
                        if (!variableExists(mockedFile)) return { status: FileSystemStatus.NotFound };

                        return {
                            status: FileSystemStatus.Success,
                            fileInfo: { hash: mockedFile.hash, id: mockedFile.id, path: mockedFile.path },
                            file: { content: mockedFile.content }
                        };
                    },
                    deleteFile: async function (path: string): Promise<DeleteResults> {
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
                    getFileList: function (): Promise<void> {
                        throw new Error("Function not implemented.");
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