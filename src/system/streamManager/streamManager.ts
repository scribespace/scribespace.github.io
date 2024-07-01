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

class StreamManager {
    private __filesPathToID: Map<string, string> = new Map();
    private __filesIDToPath: Map<string, string> = new Map();
    private __fileOperationQueues: Map<string, FileOperation[]> = new Map();
    private __fileAddQueue: FileUploadAdd[] = [];

    private __processFilesLock = Promise.resolve();

    private async processFilesInternal( filesOperations: [string, FileOperation[]][], filesAdd: FileUploadAdd[] ) {
        for ( const file of filesAdd ) {
            const result = await $getFileSystem().uploadFileAsync( file.fileID, file.content, FileUploadMode.Add );
            if ( result.status === FileSystemStatus.Success ) {
                this.__filesPathToID.set( result.fileInfo.path, result.fileInfo.id );
            }
            file.resolve( result );
        }

        for ( const entry of filesOperations ) {
            let filePathsIDsSet = false;
            const fileID = $getFileSystem().isFileID( entry[0] ) ? entry[0] : (this.__filesPathToID.get(entry[0]) || entry[0]);
            const operationsQueue = entry[1];

            for ( const operation of operationsQueue ) {
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
    }

    private processFiles() {
        this.__processFilesLock = this.__processFilesLock.then(
            async () => {
                if ( this.__fileAddQueue.length === 0 && this.__fileOperationQueues.size === 0 ) {
                    return;
                }

                const filesOperations: [string, FileOperation[]][] = Array.from( this.__fileOperationQueues );
                const filesAdd: FileUploadAdd[] = [...this.__fileAddQueue ];
                this.__fileOperationQueues.clear();
                this.__fileAddQueue = [];

                await this.processFilesInternal(filesOperations, filesAdd);
            }
        );
    }

    private getFileID( testID: string ): string {
        const isFileID = $getFileSystem().isFileID(testID);
        const otherID = isFileID ? this.__filesIDToPath.get(testID) || '' : this.__filesPathToID.get(testID) || '';
        return this.__fileOperationQueues.has(otherID) ? otherID : testID;
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

                    this.processFiles();
                }
            );
        }

        return new Promise<FileInfoResultType>(
            (resolve) => {
                const fileID = this.getFileID(path);

                const lastOperation = this.__fileOperationQueues.get(fileID) || [];
                if ( lastOperation.length === 0 || lastOperation[lastOperation.length - 1].type !== FileOperationType.FileUploadReplace ) {
                    const fileUpload: FileUploadReplace = {
                        type: FileOperationType.FileUploadReplace,
                        content,
                        resolves: [resolve]
                    };
                    if ( lastOperation.length > 0 ) {
                        lastOperation.push(fileUpload);
                    } else {
                        this.__fileOperationQueues.set( path, [...lastOperation, fileUpload] );
                    }

                } else {
                    const lastUpload = lastOperation[lastOperation.length - 1] as FileUploadReplace;
                    lastUpload.content = content;
                    lastUpload.resolves.push(resolve);
                }


                this.processFiles();
            }
        );
    }

    getFileInfo( path: string ): Promise<FileInfoResultType> {
        return new Promise<FileInfoResultType>(
            (resolve) => {
                const fileID = this.getFileID(path);

                const lastOperation = this.__fileOperationQueues.get(fileID) || [];
                if ( lastOperation.length === 0 || lastOperation[lastOperation.length - 1].type !== FileOperationType.FileGetInfo ) {
                    const fileInfo: FileGetInfo = {
                        type: FileOperationType.FileGetInfo,
                        resolves: [resolve]
                    };
                    if ( lastOperation.length > 0 ) {
                        lastOperation.push(fileInfo);
                    } else {
                        this.__fileOperationQueues.set( path, [...lastOperation, fileInfo] );
                    }

                } else {
                    const lastGetInfo = lastOperation[lastOperation.length - 1] as FileGetInfo;
                    lastGetInfo.resolves.push(resolve);
                }


                this.processFiles();
            }
        );
    }

    downloadFile( path: string ): Promise<FileResultType> {
        return new Promise<FileResultType>(
            (resolve) => {
                const fileID = this.getFileID(path);

                const lastOperation = this.__fileOperationQueues.get(fileID) || [];
                if ( lastOperation.length === 0 || lastOperation[lastOperation.length - 1].type !== FileOperationType.FileDownload ) {
                    const fileInfo: FileDownload = {
                        type: FileOperationType.FileDownload,
                        resolves: [resolve]
                    };
                    if ( lastOperation.length > 0 ) {
                        lastOperation.push(fileInfo);
                    } else {
                        this.__fileOperationQueues.set( path, [...lastOperation, fileInfo] );
                    }

                } else {
                    const lastDownload = lastOperation[lastOperation.length - 1] as FileDownload;
                    lastDownload.resolves.push(resolve);
                }

                this.processFiles();
            }
        );
    }

    flush(): Promise<void> {
        return new Promise<void>(
            (resolve) => {
                this.__processFilesLock = this.__processFilesLock.then(
                    () => {
                        resolve();
                    }
                );
            }
        );
    }
}

const __streamManager = new StreamManager();

export function $getStreamManager() {
    return __streamManager;
}