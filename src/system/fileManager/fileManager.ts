import { $getFileSystem } from "@coreSystems";
import { FileInfoResult, FileInfoResultType, FileObject, FileSystemFailedResult, FileSystemStatus, FileSystemSuccessResult, FileUploadMode } from "@interfaces/system/fileSystem/fileSystemShared";
import { $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { APP_GET_FOCUS } from "@systems/systemCommands";
import { assert, variableExists } from "@utils";

enum FileOperationType {
    FileUploadReplace,
    FileUploadAdd,
    FileDownload,
    FileGetInfo,
    FileValidateCache,
}

export type FileUploadReplaceResolve = ((result: FileInfoResultType) => void);
export type InvalidCacheCallback = ((fileID: string, filePath: string, targetVersion: number, oldResolve: FileUploadReplaceResolve) => void);

export interface FileUploadReplaceCallback {
    resolve: FileUploadReplaceResolve;
    invalidCacheCallback: InvalidCacheCallback;
}

interface FileUploadReplace {
    type: FileOperationType.FileUploadReplace;
    version: number;
    content: Blob;
    callbacks: FileUploadReplaceCallback[];
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

interface FileValidateCache {
    type: FileOperationType.FileValidateCache;
}

type FileOperation = FileUploadReplace | FileDownload | FileGetInfo | FileUploadAdd | FileValidateCache;

interface FileQueue {
    operations: FileOperation[];
    lock: Promise<void>;
}

interface FileCache {
    targetVersion: number;
    currentVersion: number;
    fileObject: FileObject;
    nextChangeTest: number;
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

export const FILE_CHANGE_VALID_PERIOD = 90000 as const;
export const FILE_CACHE_COUNT = 20 as const;

class FileManager {
    private __filesPathToID: Map<string, string> = new Map();
    private __filesIDToPath: Map<string, string> = new Map();

    private __fileCachedLastUsed: string[] = [];
    private __fileCache: Map<string, FileCache> = new Map();

    private __fileOperationQueues: Map<string, FileQueue> = new Map();    

    constructor() {
        $registerCommandListener(
            APP_GET_FOCUS,
            () => {
                for ( const fileID of this.__fileCachedLastUsed) {
                    const fileQueue = this.__fileOperationQueues.get(fileID) || this.__fileOperationQueues.set(fileID,{operations: [], lock: Promise.resolve()}).get(fileID) as FileQueue;
                    const operations = fileQueue.operations;

                    const fileGetInfo: FileValidateCache = {
                        type: FileOperationType.FileValidateCache,
                    };
                    operations.push(fileGetInfo);

                    this.processFile(fileID, fileQueue);
                }
            }
        );
    }

    private updateFileUsed( fileID: string ) {
        if ( this.__fileCachedLastUsed.length >= FILE_CACHE_COUNT ) {
            const currentFileID = this.__fileCachedLastUsed.findIndex( (element) => {return element === fileID;} );
            if ( currentFileID === -1 ) {
                const outOfCacheFileID = this.__fileCachedLastUsed[0];
                const outOfCacheFile = this.__fileCache.get( outOfCacheFileID );
                assert( variableExists(outOfCacheFile), 'Cached file not in cache!' );
                outOfCacheFile.fileObject.content = new Blob([]);
                outOfCacheFile.fileObject.fileInfo.date = '';
                outOfCacheFile.fileObject.fileInfo.hash = '';
                ++outOfCacheFile.targetVersion;

                this.__fileCachedLastUsed = this.__fileCachedLastUsed.slice( 1 );
            } else {
                this.__fileCachedLastUsed = this.__fileCachedLastUsed.slice( currentFileID, currentFileID + 1 );
            }
        }

        this.__fileCachedLastUsed.push( fileID );
    }

    private getFileID( testID: string ): string {
        const isFileID = $getFileSystem().isFileID(testID);
        const otherID = isFileID ? this.__filesIDToPath.get(testID) || '' : this.__filesPathToID.get(testID) || '';
        return this.__fileCache.has(otherID) ? otherID : testID;
    }

    private async validateCache(fileID: string, fileCache: FileCache) {
        const result = await $getFileSystem().getFileInfoAsync( fileID );
        assert( result.status === FileSystemStatus.Success, `Couldn't grab FileInfo` );
        const cacheValid = fileCache.fileObject.fileInfo.hash === result.fileInfo.hash;
        if ( !cacheValid ) {
            ++fileCache.targetVersion;
        }

        return cacheValid;
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

                        this.__fileCache.set( operationResult.handle.fileID, {fileObject: operationResult.file, currentVersion: 0, targetVersion: 0, nextChangeTest: (new Date()).getTime() + FILE_CHANGE_VALID_PERIOD } );
                        fileUpload.resolve(operationResult);

                        this.updateFileUsed(operationResult.handle.fileID);

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
                    if ( variableExists(fileCache) && fileCache.targetVersion === fileGetInfo.version ) {
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
                    const fileCache = this.__fileCache.get(fileID);
                    assert( variableExists(fileCache), `Upload replace before download ${fileID}`);

                    if ( fileCache.targetVersion !== fileUpload.version ) {
                        for ( const callback of fileUpload.callbacks ){
                            callback.invalidCacheCallback( fileCache.fileObject.fileInfo.id, fileCache.fileObject.fileInfo.path, fileCache.targetVersion, callback.resolve );
                        }
                        break;
                    }

                    if ( (new Date()).getTime() > fileCache.nextChangeTest) {
                        if ( !(await this.validateCache(fileID, fileCache)) ) {
                            for ( const callback of fileUpload.callbacks ){
                                callback.invalidCacheCallback( fileCache.fileObject.fileInfo.id, fileCache.fileObject.fileInfo.path, fileCache.targetVersion, callback.resolve );
                            }
                            break;
                        }
                    }

                    const result = await $getFileSystem().uploadFileAsync( fileID, fileUpload.content, FileUploadMode.Replace );
                    if ( result.status === FileSystemStatus.Success ) {
                        if ( !filePathsIDsSet ) {
                            this.__filesPathToID.set( result.fileInfo.path, result.fileInfo.id );
                            this.__filesIDToPath.set( result.fileInfo.id, result.fileInfo.path );
                            filePathsIDsSet = true;
                        }
                        fileCache.fileObject = {content: fileUpload.content, fileInfo: result.fileInfo};
                        fileCache.nextChangeTest = (new Date()).getTime() + FILE_CHANGE_VALID_PERIOD;

                        this.updateFileUsed(fileID);
                    } 

                    for ( const callback of fileUpload.callbacks ) {
                        callback.resolve( result );
                    }
                }   
                break;
                case FileOperationType.FileDownload:
                    {   
                    const fileDownload = operation as FileDownload;
                    let targetVersion = 0;

                    // Data in cache
                    const fileCache = this.__fileCache.get(fileID);
                    if ( variableExists(fileCache) ) {
                        targetVersion = fileCache.targetVersion;
                        if ( targetVersion === fileCache.currentVersion ) {
                            const operationResult: FileOperationResult = {
                                handle: { fileID, version: fileCache.currentVersion },
                                file: {content: fileCache.fileObject.content.slice(), fileInfo: structuredClone( fileCache.fileObject.fileInfo )},
                                status: FileSystemStatus.Success
                            };

                            for ( const resolve of fileDownload.resolves ) {
                                resolve( operationResult );
                            }
                            break;
                        }
                    }

                    // First download or updating cache
                    const result = await $getFileSystem().downloadFileAsync( fileID );
                    if ( result.status === FileSystemStatus.Success ) {
                        if ( !filePathsIDsSet ) {
                            this.__filesPathToID.set( result.fileInfo.path, result.fileInfo.id );
                            this.__filesIDToPath.set( result.fileInfo.id, result.fileInfo.path );
                            filePathsIDsSet = true;
                        }

                        const operationResult: FileOperationResult = {
                            handle: { fileID,  version: targetVersion },
                            file: {...result},
                            status: FileSystemStatus.Success
                        };
                        this.__fileCache.set( fileID, {fileObject: operationResult.file, currentVersion: targetVersion, targetVersion: targetVersion, nextChangeTest: (new Date()).getTime() + FILE_CHANGE_VALID_PERIOD } );

                        this.updateFileUsed(fileID);
                        
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
                case FileOperationType.FileValidateCache:
                {
                    const fileCache = this.__fileCache.get(fileID);
                    assert( variableExists(fileCache), `Upload replace before download ${fileID}`);

                    const result = await $getFileSystem().getFileInfoAsync( fileID );
                    assert( result.status === FileSystemStatus.Success, `Couldn't grab FileInfo` );
                    this.validateCache(fileID, fileCache);
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
    
    uploadFile( fileHandle: FileHandle, content: Blob, invalidCacheCallback: InvalidCacheCallback ): Promise<FileInfoResultType> {
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
                        callbacks: [{invalidCacheCallback, resolve}]
                    };
                    operations.push(fileUpload);
                } else {
                    const lastUpload = operations[operations.length - 1] as FileUploadReplace;
                    lastUpload.content = content;
                    lastUpload.callbacks.push( {invalidCacheCallback, resolve } );
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
        this.__fileCachedLastUsed.length = 0;
    }
}

const __fileManager = new FileManager();

export function $getFileManager() {
    return __fileManager;
}

export function _test_getNewFileManager() {
    return new FileManager();
}