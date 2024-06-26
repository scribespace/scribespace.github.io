import { $getFileSystem } from "@coreSystems";
import { FileInfoResultType, FileResultType, FileUploadMode } from "@interfaces/system/fileSystem/fileSystemShared";
import { variableExists } from "@utils";

interface FileUploadObject {
    content: Blob;
    resolves: ((fileInfo: FileInfoResultType | PromiseLike<FileInfoResultType>) => void)[];
}

interface FileAddObject {
    path: string;
    uploadObject: FileUploadObject;
}

type FileCallback = (fileInfo: FileResultType | PromiseLike<FileResultType>) => void;

class StreamManager {
    private __uploadReplaceQueue: Map<string, FileUploadObject> = new Map();
    private __uploadAddQueue: FileAddObject[] = [];
    private __uploadProcessPromise = Promise.resolve();

    private async processUpload(replaceQueue: [string, FileUploadObject][], addQueue: FileAddObject[]) {
        for (const [path, queueObj] of replaceQueue ) {
            const fileInfo = await $getFileSystem().uploadFileAsync( path, queueObj.content, FileUploadMode.Replace );
            for ( const resolve of queueObj.resolves )
                resolve(fileInfo);
        }
        
        for (const addObject of addQueue ) {
            const fileInfo = await $getFileSystem().uploadFileAsync( addObject.path, addObject.uploadObject.content, FileUploadMode.Add );
            addObject.uploadObject.resolves[0](fileInfo);
        }
    }

    uploadFile( path: string, content: Blob, mode: FileUploadMode ): Promise<FileInfoResultType> {
        let uploadObject: FileUploadObject | undefined = undefined;
        if ( mode === FileUploadMode.Replace ) {
            uploadObject = this.__uploadReplaceQueue.get(path);
            if ( !variableExists(uploadObject)) {
                uploadObject = { content, resolves: [] };
                this.__uploadReplaceQueue.set(path, uploadObject);
            }
        } else { // Add
            uploadObject = { content, resolves: [] };
            this.__uploadAddQueue.push( {path, uploadObject } );
        }

        uploadObject.content = content;

        return new Promise<FileInfoResultType>( (resolve) => {
            uploadObject.resolves.push(resolve);
            this.__uploadProcessPromise = this.__uploadProcessPromise.then(async () => {
                if ( this.__uploadReplaceQueue.size === 0 && this.__uploadAddQueue.length === 0 )
                    return;

                const queueReplaceCopy = Array.from(this.__uploadReplaceQueue);
                const queueAddCopy = this.__uploadAddQueue;
                this.__uploadReplaceQueue.clear();
                this.__uploadAddQueue = [];

                await this.processUpload(queueReplaceCopy, queueAddCopy);
            });
        } );
    }

    private __downloadQueue: Map<string, FileCallback[]> = new Map();
    private __downloadProcessPromise = Promise.resolve();

    private async processDownload(queue: [string, FileCallback[]][]) {
        for ( const [path, callbacks] of queue ) {
            const file = await $getFileSystem().downloadFileAsync( path );
            for ( const callback of callbacks )
                callback(file);
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
                callbackList.push( resolve );
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

    async flush() {
        await Promise.all([this.__uploadProcessPromise, this.__downloadProcessPromise]);
    }
}

const __streamManager = new StreamManager();

export function $getStreamManager() {
    return __streamManager;
}