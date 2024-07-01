import { $getFileSystem } from "@coreSystems";
import { FileInfoResultType, FileResultType, FileSystemStatus, FileUploadMode } from "@interfaces/system/fileSystem/fileSystemShared";

enum FileOperationType {
    FileUploadReplace,
    FileUploadAdd,
    FileDownload,
    FileGetInfo,
}

interface FileUploadReplace {
    type: FileOperationType.FileUploadReplace;
    content: Blob;
    resolves: ((result: FileInfoResultType) => void)[];
}

interface FileUploadAdd {
    type: FileOperationType.FileUploadAdd;
    fileID: string;
    content: Blob;
    resolve: ((result: FileInfoResultType) => void);
}

interface FileDownload {
    type: FileOperationType.FileDownload;
    resolves: ((result: FileResultType) => void)[];
}

interface FileGetInfo {
    type: FileOperationType.FileGetInfo;
    resolves: ((result: FileInfoResultType) => void)[];
}

type FileOperation = FileUploadReplace | FileDownload | FileGetInfo;

interface FileQueue {
    operations: FileOperation[];
    lock: Promise<void>;
}

class StreamManager {
    private __filesPathToID: Map<string, string> = new Map();
    private __filesIDToPath: Map<string, string> = new Map();

    private __fileOperationQueues: Map<string, FileQueue> = new Map();

    private __fileAddQueue: FileUploadAdd[] = [];
    private __processFilesAddLock = Promise.resolve();

    
    private getFileID( testID: string ): string {
        const isFileID = $getFileSystem().isFileID(testID);
        const otherID = isFileID ? this.__filesIDToPath.get(testID) || '' : this.__filesPathToID.get(testID) || '';
        return this.__fileOperationQueues.has(otherID) ? otherID : testID;
    }

    private async processFilesInternal( filePath: string, filesOperations: FileOperation[] ) {
        let filePathsIDsSet = false;
        const fileID = $getFileSystem().isFileID( filePath ) ? filePath : (this.__filesPathToID.get(filePath) || filePath);
   
        for ( const operation of filesOperations ) {
            switch ( operation.type ) {
                case FileOperationType.FileGetInfo:
                {   
                    const fileGetInfo = operation as FileGetInfo;
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
                    if ( !filePathsIDsSet && result.status === FileSystemStatus.Success ) {
                        this.__filesPathToID.set( result.fileInfo.path, result.fileInfo.id );
                        this.__filesIDToPath.set( result.fileInfo.id, result.fileInfo.path );
                        filePathsIDsSet = true;
                    }
                    for ( const resolve of fileUpload.resolves ) {
                        resolve( result );
                    }
                }   
                break;
                case FileOperationType.FileDownload:
                {   
                    const fileDownload = operation as FileDownload;
                    const result = await $getFileSystem().downloadFileAsync( fileID );
                    if ( !filePathsIDsSet && result.status === FileSystemStatus.Success ) {
                        this.__filesPathToID.set( result.file.info.path, result.file.info.id );
                        this.__filesIDToPath.set( result.file.info.id, result.file.info.path );
                        filePathsIDsSet = true;
                    }
                    for ( const resolve of fileDownload.resolves ) {
                        resolve( result );
                    }
                }   
                break;
            }
        }
    }

    
    private processFiles( filePath: string, fileQueue: FileQueue ) {
        fileQueue.lock = fileQueue.lock.then(
            async () => {
                if ( fileQueue.operations.length === 0 ) {
                    return;
                }

                const fileOperation: FileOperation[] = [...fileQueue.operations];
                fileQueue.operations = [];

                await this.processFilesInternal(filePath, fileOperation);
            }
        );
    }

    private async processFileAddInternal(filesAdd: FileUploadAdd[]) {
        for ( const file of filesAdd ) {
            const result = await $getFileSystem().uploadFileAsync( file.fileID, file.content, FileUploadMode.Add );
            if ( result.status === FileSystemStatus.Success ) {
                this.__filesPathToID.set( result.fileInfo.path, result.fileInfo.id );
            }
            file.resolve( result );
        }
    }

    private processFilesAdd() {
        this.__processFilesAddLock = this.__processFilesAddLock.then(
            async () => {
                if ( this.__fileAddQueue.length === 0 ) {
                    return;
                }

                const filesAdd: FileUploadAdd[] = [...this.__fileAddQueue ];
                this.__fileAddQueue = [];

                await this.processFileAddInternal(filesAdd);
            }
        );
    }
    
    uploadFile( path: string, content: Blob, mode: FileUploadMode ): Promise<FileInfoResultType> {
        if ( mode === FileUploadMode.Add ) {
            return new Promise<FileInfoResultType>(
                (resolve) => {
                    const fileUpload: FileUploadAdd = {
                        type: FileOperationType.FileUploadAdd,
                        fileID: path,
                        content,
                        resolve
                    };
                    this.__fileAddQueue.push(fileUpload);

                    this.processFilesAdd();
                }
            );
        }

        return new Promise<FileInfoResultType>(
            (resolve) => {
                const fileID = this.getFileID(path);

                const fileQueue = this.__fileOperationQueues.get(fileID) || this.__fileOperationQueues.set(fileID,{operations: [], lock: Promise.resolve()}).get(fileID) as FileQueue;
                const operations = fileQueue.operations;
                if ( operations.length === 0 || operations[operations.length - 1].type !== FileOperationType.FileUploadReplace ) {
                    const fileUpload: FileUploadReplace = {
                        type: FileOperationType.FileUploadReplace,
                        content,
                        resolves: [resolve]
                    };
                    operations.push(fileUpload);
                } else {
                    const lastUpload = operations[operations.length - 1] as FileUploadReplace;
                    lastUpload.content = content;
                    lastUpload.resolves.push(resolve);
                }

                this.processFiles(fileID, fileQueue);
            }
        );
    }

    getFileInfo( path: string ): Promise<FileInfoResultType> {
        return new Promise<FileInfoResultType>(
            (resolve) => {
                const fileID = this.getFileID(path);

                const fileQueue = this.__fileOperationQueues.get(fileID) || this.__fileOperationQueues.set(fileID,{operations: [], lock: Promise.resolve()}).get(fileID) as FileQueue;
                const operations = fileQueue.operations;
                if ( operations.length === 0 || operations[operations.length - 1].type !== FileOperationType.FileGetInfo ) {
                    const fileGetInfo: FileGetInfo = {
                        type: FileOperationType.FileGetInfo,
                        resolves: [resolve]
                    };
                    operations.push(fileGetInfo);
                } else {
                    const lastUpload = operations[operations.length - 1] as FileGetInfo;
                    lastUpload.resolves.push(resolve);
                }

                this.processFiles(fileID, fileQueue);
            }
        );
    }

    downloadFile( path: string ): Promise<FileResultType> {
        return new Promise<FileResultType>(
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

                this.processFiles(fileID, fileQueue);
            }
        );
    }

    flush(): Promise<void[]> {
        const promisesArray: Promise<void>[] = [];
        for ( const fileQueue of this.__fileOperationQueues ) {
            promisesArray.push(fileQueue[1].lock);
        }

        return Promise.all(promisesArray);
    }
}

const __streamManager = new StreamManager();

export function $getStreamManager() {
    return __streamManager;
}