import { $getFileSystem } from "@coreSystems";
import { FileInfoResultType, FileResultType, FileUploadMode } from "@interfaces/system/fileSystem/fileSystemShared";
import { assert, variableExists } from "@utils";

interface FileUploadObject {
    content: Blob;
    mode: FileUploadMode;
    resolves: ((fileInfo: FileInfoResultType | PromiseLike<FileInfoResultType>) => void)[];
}

interface FileCallback {
    resolve: (fileInfo: FileResultType | PromiseLike<FileResultType>) => void;
}

class StreamManager {
    private __uploadQueue: Map<string, FileUploadObject> = new Map();
    private __uploadProcessPromise = Promise.resolve();

    private async processUpload(queue: [string, FileUploadObject][]) {
        for (const [path, queueObj] of queue ) {
            const fileInfo = await $getFileSystem().uploadFileAsync( path, queueObj.content, queueObj.mode );
            for ( const resolve of queueObj.resolves )
                resolve(fileInfo);
        }
    }

    uploadFile( path: string, content: Blob, mode: FileUploadMode ): Promise<FileInfoResultType> {
        let uploadObject = this.__uploadQueue.get(path);
        if ( !variableExists(uploadObject)) {
            uploadObject = { content, mode, resolves: [] };
            this.__uploadQueue.set(path, uploadObject);
        }
        assert(mode === uploadObject.mode, `Mixed modes for upload`);
        uploadObject.content = content;

        return new Promise<FileInfoResultType>( (resolve) => {
            uploadObject.resolves.push(resolve);
            this.__uploadProcessPromise = this.__uploadProcessPromise.then(async () => {
                if ( this.__uploadQueue.size === 0 )
                    return;

                const queueCopy = Array.from(this.__uploadQueue);
                this.__uploadQueue.clear();

                await this.processUpload(queueCopy);
            });
        } );
    }

    private __downloadQueue: Map<string, FileCallback[]> = new Map();
    private __downloadProcessPromise = Promise.resolve();

    private async processDownload(queue: [string, FileCallback[]][]) {
        for ( const [path, callbacks] of queue ) {
            const file = await $getFileSystem().downloadFileAsync( path );
            for ( const callback of callbacks )
                callback.resolve(file);
        }
    }

    async downloadFile( path: string ) {
        let callbackList = this.__downloadQueue.get(path);
        if ( !variableExists(callbackList) ) {
            callbackList = [] as FileCallback[];
            this.__downloadQueue.set( path, callbackList );
        }
        
        return new Promise<FileResultType>(
            (resolve) => {
                callbackList.push( {resolve} );
                this.__downloadProcessPromise = this.__downloadProcessPromise.then( async () => {
                    if ( this.__downloadQueue.size === 0 )
                        return;
    
                    const queueCopy = Array.from(this.__downloadQueue);
                    this.__downloadQueue.clear();
    
                    await this.processDownload(queueCopy);
                });
            }
        );
    }
}

export const streamManager = new StreamManager();