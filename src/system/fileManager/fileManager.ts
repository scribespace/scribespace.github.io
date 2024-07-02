import { $getFileSystem } from "@coreSystems";
import { FileInfoResult, FileInfoResultType, FileObject, FileSystemFailedResult, FileSystemStatus, FileSystemSuccessResult, FileUploadMode } from "@interfaces/system/fileSystem/fileSystemShared";
import { assert, variableExists } from "@utils";

enum FileOperationType {
    FileUploadReplace,
    FileUploadAdd,
    FileDownload,
    FileGetInfo,
}

interface FileUploadReplace {
    type: FileOperationType.FileUploadReplace;
    version: number;
    content: Blob;
    resolves: ((result: FileInfoResultType) => void)[];
}

interface FileUploadAdd {
    type: FileOperationType.FileUploadAdd;
    fileID: string;
    content: Blob;
    resolve: ((result: FileOperationResultType) => void);
}

interface FileDownload {
    type: FileOperationType.FileDownload;
    resolves: ((result: FileOperationResultType) => void)[];
}

interface FileGetInfo {
    type: FileOperationType.FileGetInfo;
    version: number;
    resolves: ((result: FileInfoResultType) => void)[];
}

type FileOperation = FileUploadReplace | FileDownload | FileGetInfo | FileUploadAdd;

interface FileQueue {
    operations: FileOperation[];
    lock: Promise<void>;
}

interface FileCache {
    version: number;
    fileObject: FileObject;
}

export interface FileHandle {
    fileID: string;
    version: number;
}

export interface FileOperationResult extends FileSystemSuccessResult {
    handle: FileHandle;
    file: Readonly<FileObject>;
}

export type FileOperationResultType = FileOperationResult | FileSystemFailedResult;
const FILE_UPLOAD_ADD_ID = '$fileAdd' as const;

class FileManager {
    private __filesPathToID: Map<string, string> = new Map();
    private __filesIDToPath: Map<string, string> = new Map();

    private __fileCache: Map<string, FileCache> = new Map();

    private __fileOperationQueues: Map<string, FileQueue> = new Map();

    private getFileID( testID: string ): string {
        const isFileID = $getFileSystem().isFileID(testID);
        const otherID = isFileID ? this.__filesIDToPath.get(testID) || '' : this.__filesPathToID.get(testID) || '';
        return this.__fileCache.has(otherID) ? otherID : testID;
    }

    private async processFilesInternal( fileID: string, filesOperations: FileOperation[] ) {
        let filePathsIDsSet = false;
   
        for ( const operation of filesOperations ) {
            switch ( operation.type ) {
                case FileOperationType.FileUploadAdd:
                {
                    const fileUpload = operation as FileUploadAdd;
                    const result = await $getFileSystem().uploadFileAsync( fileUpload.fileID, fileUpload.content, FileUploadMode.Add );
                    if ( result.status === FileSystemStatus.Success ) {
                        this.__filesPathToID.set( result.fileInfo.path, result.fileInfo.id );

                        const operationResult: FileOperationResult = {
                            handle: { fileID: result.fileInfo.id,  version: 0 },
                            file: { content: fileUpload.content, fileInfo: result.fileInfo },
                            status: FileSystemStatus.Success
                        };

                        this.__fileCache.set( operationResult.handle.fileID, {fileObject: operationResult.file, version: 0 } );
                        fileUpload.resolve(operationResult);
                    } else {
                        fileUpload.resolve(result);
                    }
                }
                break;
                case FileOperationType.FileGetInfo:
                {   
                    const fileGetInfo = operation as FileGetInfo;

                    // Data in cache
                    const fileCache = this.__fileCache.get(fileID);
                    if ( variableExists(fileCache) ) {
                        const operationResult: FileInfoResult = {
                            fileInfo: fileCache.fileObject.fileInfo,
                            status: FileSystemStatus.Success
                        };

                        for ( const resolve of fileGetInfo.resolves ) {
                            resolve( operationResult );
                        }
                        break;
                    }

                    const result = await $getFileSystem().getFileInfoAsync( fileID );
                    if ( !filePathsIDsSet && result.status === FileSystemStatus.Success ) {
                        this.__filesPathToID.set( result.fileInfo.path, result.fileInfo.id );
                        this.__filesIDToPath.set( result.fileInfo.id, result.fileInfo.path );
                        filePathsIDsSet = true;
                    } 
                    for ( const resolve of fileGetInfo.resolves ) {
                        resolve( result );
                    }
                }   
                break;
                case FileOperationType.FileUploadReplace:
                {   
                    const fileUpload = operation as FileUploadReplace;
                    const result = await $getFileSystem().uploadFileAsync( fileID, fileUpload.content, FileUploadMode.Replace );
                    if ( result.status === FileSystemStatus.Success ) {
                        if ( !filePathsIDsSet ) {
                            this.__filesPathToID.set( result.fileInfo.path, result.fileInfo.id );
                            this.__filesIDToPath.set( result.fileInfo.id, result.fileInfo.path );
                            filePathsIDsSet = true;
                        }
                        this.__fileCache.set( fileID, {fileObject: {content: fileUpload.content, fileInfo: result.fileInfo}, version: 0 } );
                    } 

                    for ( const resolve of fileUpload.resolves ) {
                        resolve( result );
                    }
                }   
                break;
                case FileOperationType.FileDownload:
                    {   
                    const fileDownload = operation as FileDownload;

                    // Data in cache
                    const fileCache = this.__fileCache.get(fileID);
                    if ( variableExists(fileCache) ) {
                        const operationResult: FileOperationResult = {
                            handle: { fileID,  version: fileCache.version },
                            file: fileCache.fileObject,
                            status: FileSystemStatus.Success
                        };

                        for ( const resolve of fileDownload.resolves ) {
                            resolve( operationResult );
                         }
                         break;
                    }

                    // First download
                    const result = await $getFileSystem().downloadFileAsync( fileID );
                    if ( result.status === FileSystemStatus.Success ) {
                        if ( !filePathsIDsSet ) {
                            this.__filesPathToID.set( result.fileInfo.path, result.fileInfo.id );
                            this.__filesIDToPath.set( result.fileInfo.id, result.fileInfo.path );
                            filePathsIDsSet = true;
                        }

                        const operationResult: FileOperationResult = {
                            handle: { fileID,  version: 0 },
                            file: {...result},
                            status: FileSystemStatus.Success
                        };
                        this.__fileCache.set( fileID, {fileObject: operationResult.file, version: 0 } );

                        for ( const resolve of fileDownload.resolves ) {
                            resolve( operationResult );
                         }
                    } else {
                        for ( const resolve of fileDownload.resolves ) {
                           resolve( result );
                        }
                    }
                }   
                break;
            }
        }
    }

    
    private processFile( fileID: string, fileQueue: FileQueue ) {
        fileQueue.lock = fileQueue.lock.then(
            async () => {
                if ( fileQueue.operations.length === 0 ) {
                    return;
                }
                
                const fileOperation: FileOperation[] = [...fileQueue.operations];
                fileQueue.operations = [];

                await this.processFilesInternal(fileID, fileOperation);
            }
        );
    }


    createFile( path: string, content: Blob ): Promise<FileOperationResultType> {
        assert( path !== FILE_UPLOAD_ADD_ID, 'Path the same as uploadAdd ID!' );

        return new Promise<FileOperationResultType>(
            (resolve) => {
                const fileUpload: FileUploadAdd = {
                    type: FileOperationType.FileUploadAdd,
                    fileID: path,
                    content,
                    resolve
                };
                const fileQueue = this.__fileOperationQueues.get(FILE_UPLOAD_ADD_ID) || this.__fileOperationQueues.set(FILE_UPLOAD_ADD_ID,{operations: [], lock: Promise.resolve()}).get(FILE_UPLOAD_ADD_ID) as FileQueue;
                fileQueue.operations.push(fileUpload);

                this.processFile(path, fileQueue);
            }
        );
    }
    
    uploadFile( fileHandle: FileHandle, content: Blob ): Promise<FileInfoResultType> {
        return new Promise<FileInfoResultType>(
            (resolve) => {
                const fileID = this.getFileID(fileHandle.fileID);

                const fileQueue = this.__fileOperationQueues.get(fileID) || this.__fileOperationQueues.set(fileID,{operations: [], lock: Promise.resolve()}).get(fileID) as FileQueue;
                const operations = fileQueue.operations;

                if ( operations.length === 0 || operations[operations.length - 1].type !== FileOperationType.FileUploadReplace || (operations[operations.length - 1] as FileUploadReplace).version !== fileHandle.version ) {
                    const fileUpload: FileUploadReplace = {
                        type: FileOperationType.FileUploadReplace,
                        version: fileHandle.version,
                        content,
                        resolves: [resolve]
                    };
                    operations.push(fileUpload);
                } else {
                    const lastUpload = operations[operations.length - 1] as FileUploadReplace;
                    lastUpload.content = content;
                    lastUpload.resolves.push(resolve);
                }

                this.processFile(fileID, fileQueue);
            }
        );
    }

    getFileInfo( fileHandle: FileHandle ): Promise<FileInfoResultType> {
        return new Promise<FileInfoResultType>(
            (resolve) => {
                const fileID = this.getFileID(fileHandle.fileID);

                const fileQueue = this.__fileOperationQueues.get(fileID) || this.__fileOperationQueues.set(fileID,{operations: [], lock: Promise.resolve()}).get(fileID) as FileQueue;
                const operations = fileQueue.operations;

                if ( operations.length === 0 || operations[operations.length - 1].type !== FileOperationType.FileGetInfo || (operations[operations.length - 1] as FileGetInfo).version !== fileHandle.version ) {
                    const fileGetInfo: FileGetInfo = {
                        type: FileOperationType.FileGetInfo,
                        version: fileHandle.version,
                        resolves: [resolve]
                    };
                    operations.push(fileGetInfo);
                } else {
                    const lastUpload = operations[operations.length - 1] as FileGetInfo;
                    lastUpload.resolves.push(resolve);
                }

                this.processFile(fileID, fileQueue);
            }
        );
    }

    downloadFile( path: string ): Promise<FileOperationResultType> {
        return new Promise<FileOperationResultType>(
            (resolve) => {
                const fileID = this.getFileID(path);

                const fileQueue = this.__fileOperationQueues.get(fileID) || this.__fileOperationQueues.set(fileID,{operations: [], lock: Promise.resolve()}).get(fileID) as FileQueue;
                const operations = fileQueue.operations;

                if ( operations.length === 0 || operations[operations.length - 1].type !== FileOperationType.FileDownload ) {
                    const fileDownload: FileDownload = {
                        type: FileOperationType.FileDownload,
                        resolves: [resolve]
                    };
                    operations.push(fileDownload);
                } else {
                    const lastUpload = operations[operations.length - 1] as FileDownload;
                    lastUpload.resolves.push(resolve);
                }

                this.processFile(fileID, fileQueue);
            }
        );
    }

    flush(): Promise<void[]> {
        const promisesArray: Promise<void>[] = [];
        for ( const fileQueue of this.__fileOperationQueues ) {
            promisesArray.push(fileQueue[1].lock);
        }

        return Promise.all([...promisesArray]);
    }

    clear() {
        this.__filesPathToID.clear();
        this.__filesIDToPath.clear();
        this.__fileCache.clear();
    }
}

const __fileManager = new FileManager();

export function $getFileManager() {
    return __fileManager;
}