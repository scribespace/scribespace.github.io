import * as DropboxAPI from 'dropbox';
import { ThrowDropboxError, DropboxUploadSmallFileError, isDropboxResponseErrorOrThrow as isDropboxErrorResponseOrThrow, DropboxUploadSessionStartError, DropboxUploadSessionAppendError, DropboxUploadError, DropboxUploadSessionFinishError, DropboxDownloadError, DropboxFileBlobResponse, DropboxFileMetadata, DropboxGetMetadataError, DropboxDeleteError, DropboxCreateSharedLinkWithSettingsError, DropboxLookupError, DropboxCommitInfo, DropboxWriteModeAdd, DropboxWriteModeOverwrite, DropboxLinkAudiencePublic, DropboxUploadSessionTypeConcurrent } from './dropbox_common';
import {
    FileSystem,
    File,
    FileSystemStatus,
    UploadResult,
    DownloadResult,
    FileInfo,
    FileUploadMode,
    DeleteResults as DeleteResult,
    GetMetadataResults,
    FileResult,
} from '../../interfaces/system/fs_interface';
import { variableExistsOrThrow } from '@utils/common';

function HandleLookupError(path: string, lookupError: DropboxLookupError): FileResult {
    switch (lookupError['.tag']) {
        case 'not_found': //LookupErrorNotFound
            return {status: FileSystemStatus.NotFound };
        default:
            ThrowDropboxError('Unsupported LookupError type. File: ' + path + ' Tag: ' + lookupError['.tag']);
    }
}

function HandleDownloadError(path: string, downloadError: DropboxDownloadError): FileResult {
    switch (downloadError['.tag']) {
        case 'path': //DownloadErrorPath
            return HandleLookupError(path, downloadError.path);
        default:
            ThrowDropboxError('Unsupported DownloadError type. File: ' + path);
    }
}

function HandleDeleteError(path: string, deleteError: DropboxDeleteError): FileResult {
    switch (deleteError['.tag']) {
        case 'path_lookup': //DeleteErrorPathLookup
            return HandleLookupError(path, deleteError.path_lookup);
        default:
            ThrowDropboxError('Unsupported DownloadError type. File: ' + path);
    }
}

function HandleUploadError(path: string, uploadError: DropboxUploadError): FileResult {
    switch (uploadError['.tag']) {
        case 'content_hash_mismatch':
            return {status: FileSystemStatus.MismatchHash };
        default:
            ThrowDropboxError('Unsupported UploadError type. File: ' + path + ' Tag: ' + uploadError['.tag']);
    }
}

function HandleGetMetadataError(path: string, getMetadataError: DropboxGetMetadataError) {
    switch (getMetadataError['.tag']) {
        case 'path': //DownloadErrorPath
            return HandleLookupError(path, getMetadataError.path);
        default:
            ThrowDropboxError('Unsupported GetMetadataError type. File: ' + path);
    }
}

export class DropboxFS implements FileSystem {
    private dbx: DropboxAPI.Dropbox;
    constructor(dbx: DropboxAPI.Dropbox) {
        this.dbx = dbx;
    }

    async calculateFileHash(file: File): Promise<string> {
        if (file.content === null) ThrowDropboxError('calculateFileHash: File has no content');
        /*
            -Split the file into blocks of 4 MB (4,194,304 or 4 * 1024 * 1024 bytes). The last block (if any) may be smaller than 4 MB.
            -Compute the hash of each block using SHA-256.
            -Concatenate the hash of all blocks in the binary format to form a single binary string.
            -Compute the hash of the concatenated string using SHA-256. Output the resulting hash in hexadecimal format.
        */

        const BLOCK_SIZE = 4 * 1024 * 1024;
        const blocksHashesPromises: Promise<ArrayBuffer>[] = [];
        const fileSize = file.content.size;
        for (let offset = 0; offset < fileSize; offset += BLOCK_SIZE) {
            const blockSize = Math.min(BLOCK_SIZE, fileSize - offset);
            const blockBlob = file.content.slice(offset, offset + blockSize);
            const blockHashPromise = blockBlob.arrayBuffer();
            blocksHashesPromises.push(blockHashPromise);
        }

        const blockArrays = await Promise.all(blocksHashesPromises);
        blocksHashesPromises.length = 0;
        for (const blockArray of blockArrays) {
            const blockHashPromise = crypto.subtle.digest('SHA-256', blockArray);
            blocksHashesPromises.push(blockHashPromise);
        }

        let mergedBufferSize = 0;
        const blockHashes = await Promise.all(blocksHashesPromises);
        for (const blockHash of blockHashes) {
            mergedBufferSize += blockHash.byteLength;
        }

        const mergedHash = new Uint8Array(mergedBufferSize);
        let offset = 0;
        for (const blockHash of blockHashes) {
            mergedHash.set(new Uint8Array(blockHash), offset);
            offset += blockHash.byteLength;
        }

        const finalHashArrayBuffer = await crypto.subtle.digest('SHA-256', mergedHash);
        const finalHash = new Uint8Array(finalHashArrayBuffer);
        const hexHash: string[] = new Array<string>(mergedBufferSize);
        for (const b of finalHash) {
            const char = b.toString(16).padStart(2, '0');
            hexHash.push(char);
        }

        return hexHash.join('');
    }

    //for files below 150MB
    private async uploadSmallFile(
        path: string,
        file: File,
        commit: DropboxCommitInfo,
        fileHash: Promise<string>
    ): Promise<UploadResult> {
        if (file.content === null) ThrowDropboxError('uploadSmallFile: File has no content');

        let fileMeta: DropboxFileMetadata;
        try {
            fileMeta = (
                await this.dbx.filesUpload({
                    path,
                    contents: file.content,
                    autorename: commit.autorename,
                    mute: commit.mute,
                    mode: commit.mode,
                    content_hash: await fileHash,
                })
            ).result;
        } catch (error) {
            isDropboxErrorResponseOrThrow<DropboxUploadSmallFileError>(error);
            const uploadError = error.error;
            if (!uploadError.error) {
                ThrowDropboxError(uploadError);
            }
            return HandleUploadError(path, uploadError.error);
        }

        const fileInfo: FileInfo = {
            hash: fileMeta.content_hash,
            name: fileMeta.id,
        };
        return { status: FileSystemStatus.Success, fileInfo };
    }

    private async uploadBigFile(
        path: string,
        file: File,
        commit: DropboxCommitInfo,
        fileHash: Promise<string>
    ): Promise<UploadResult> {
        if (file.content === null) ThrowDropboxError('uploadBigFile: File has no content');

        const concurrentSize = 4194304; // call must be multiple of 4194304 bytes (except for last upload_session/append:2 with UploadSessionStartArg.close to true, that may contain any remaining data).
        const maxBlob = concurrentSize * Math.floor((8 * 1024 * 1024) / concurrentSize); // 8MB - Dropbox JavaScript API suggested max file / chunk size

        const blobs: Blob[] = [];
        let offset = 0;
        while (offset < file.content.size) {
            const blobSize = Math.min(maxBlob, file.content.size - offset);
            blobs.push(file.content.slice(offset, offset + blobSize));
            offset += maxBlob;
        }
        const blobsCount = blobs.length;

        let sessionId: string = "";
        try {
            sessionId = (await this.dbx.filesUploadSessionStart({ session_type: DropboxUploadSessionTypeConcurrent })).result.session_id;
        } catch (error) {
            isDropboxErrorResponseOrThrow<DropboxUploadSessionStartError>(error);
            const uploadError = error.error;
            if (!uploadError.error) {
                ThrowDropboxError(uploadError);
            }
            return HandleUploadError(path, uploadError.error);
        }

        try {
            const uploadPromises: Promise<DropboxAPI.DropboxResponse<void>>[] = [];
            for (let id = 0; id < blobsCount - 1; ++id) {
                const cursor = { session_id: sessionId, offset: id * maxBlob };
                uploadPromises.push(this.dbx.filesUploadSessionAppendV2({ cursor: cursor, contents: blobs[id] }));
            }

            const lastBlob = blobs[blobsCount - 1];
            const cursor = { session_id: sessionId, offset: (blobsCount - 1) * maxBlob };
            uploadPromises.push(
                this.dbx.filesUploadSessionAppendV2({ cursor: cursor, contents: lastBlob, close: true })
            );
            await Promise.all(uploadPromises);
        } catch (error) {
            isDropboxErrorResponseOrThrow<DropboxUploadSessionAppendError>(error);
            const uploadError = error.error;
            if (!uploadError.error) {
                ThrowDropboxError(uploadError);
            }
            return HandleUploadError(path, uploadError.error);
        }

        let fileMeta: DropboxFileMetadata;
        try {
            const cursor = { session_id: sessionId, offset: 0 /*concurrent*/ };
            fileMeta = (
                await this.dbx.filesUploadSessionFinish({
                    cursor: cursor,
                    commit: commit,
                    content_hash: await fileHash,
                })
            ).result;
        } catch (error) {
            isDropboxErrorResponseOrThrow<DropboxUploadSessionFinishError>(error);
            const uploadError = error.error;
            if (!uploadError.error) {
                ThrowDropboxError(uploadError);
            }
            return HandleUploadError(path, uploadError.error);
        }

        const fileInfo: FileInfo = {hash: fileMeta.content_hash, name: fileMeta.id };
        return { status: FileSystemStatus.Success, fileInfo };
    }

    async uploadFile(path: string, file: File, mode: FileUploadMode): Promise<UploadResult> {
        if (file.content === null) ThrowDropboxError('uploadFile: File has no content');

        const smallFileMaxSize = 150 * 1024 * 1024; // 150 MB - from dropbox doc
        const settings: DropboxCommitInfo = {
            path: path,
            mute: true,
            autorename: true,
            mode: DropboxWriteModeAdd,
        };
        switch (mode) {
            case FileUploadMode.Add:
                //defualt
                break;
            case FileUploadMode.Replace:
                settings.autorename = false;
                settings.mode = DropboxWriteModeOverwrite;
                break;
            default:
                ThrowDropboxError('Unknown upload mode');
        }

        const fileHash: Promise<string> = this.calculateFileHash(file);
        if (file.content.size < smallFileMaxSize) {
            return this.uploadSmallFile(path, file, settings, fileHash);
        } else {
            return this.uploadBigFile(path, file, settings, fileHash);
        }
    }

    async downloadFile(path: string): Promise<DownloadResult> {
        let respond: DropboxFileBlobResponse;
        try {
            respond = await this.dbx.filesDownload({ path: path });
        } catch (error) {
            isDropboxErrorResponseOrThrow<DropboxDownloadError>(error);
            const downloadError = error.error;
            if (!downloadError.error) {
                ThrowDropboxError(downloadError);
            }
            return HandleDownloadError(path, downloadError.error); // promise returns DropboxResponseError<Error<files.DownloadError>> (there is a mistake in index.d.ts)
        }

        const fileMeta = respond.result;
        variableExistsOrThrow(fileMeta.path_lower);
        variableExistsOrThrow(fileMeta.fileBlob);
        const fileExtension = fileMeta.path_lower.split('.').pop();
        let fileType = '';
        switch (fileExtension) {
            case 'png':
            case 'jpg': // only png can be copied to clipboard, it should get converted
            case 'jpeg':
                fileType = 'image/png';
                break;
            case 'gif':
                fileType = 'image/gif';
                break;
            case 'mp4':
                fileType = 'video/mp4';
                break;
        }

        const file = fileType
            ? { content: fileMeta.fileBlob.slice(0, fileMeta.fileBlob.size, fileType) }
            : { content: fileMeta.fileBlob };
        const fileHash: string = await this.calculateFileHash(file);

        if (fileHash !== fileMeta.content_hash) {
            return { status: FileSystemStatus.MismatchHash };
        }

        const result: DownloadResult = {
            status: FileSystemStatus.Success,
            file: file,
            fileInfo: { hash: fileMeta.content_hash, name: fileMeta.id },
        };

        return result;
    }

    async getMetadata(path: string): Promise<GetMetadataResults> {
        let fileMeta: DropboxFileMetadata;
        try {
            fileMeta = (await this.dbx.filesGetMetadata({ path: path })).result as DropboxFileMetadata;
        } catch (error) {
            isDropboxErrorResponseOrThrow<DropboxGetMetadataError>(error);
            const getMetadataError = error.error;
            if (!getMetadataError.error) {
                ThrowDropboxError(getMetadataError);
            }
            return HandleGetMetadataError(path, getMetadataError.error);
        }

        return {status: FileSystemStatus.Success, fileInfo: { hash: fileMeta.content_hash, name: fileMeta.id }};
    }

    async getFileHash(path: string): Promise<string> {
        const fileMeta = await this.getMetadata(path);

        if (!fileMeta.fileInfo?.hash) {
            ThrowDropboxError({
                status: FileSystemStatus.NotFound,
                message: 'getFileHash: no hash for file "' + path + '"',
            });
        }
        return fileMeta.fileInfo.hash;
    }
    
    async deleteFile(path: string): Promise<DeleteResult> {
        try {
            await this.dbx.filesDeleteV2({ path: path });
        } catch (error) {
            isDropboxErrorResponseOrThrow<DropboxDeleteError>(error);
            const deleteError = error.error;
            if (!deleteError.error) {
                ThrowDropboxError(deleteError);
            }
            return HandleDeleteError(path, deleteError.error); // promise returns DropboxResponseError<Error<files.DownloadError>> (there is a mistake in index.d.ts)
        }

        const result: DeleteResult = {
            status: FileSystemStatus.Success,
        };
        return result;
    }
    
    async getFileURL(path: string): Promise<string> {
        try {
            const share = await this.dbx.sharingCreateSharedLinkWithSettings({
                path: path,
                settings: {
                    audience: DropboxLinkAudiencePublic
                }
            });

            let url = share.result.url.slice(0, -4); // remove dl=0
            url = url + 'raw=1'; // add raw file

            return url;
        } catch (error) {
            isDropboxErrorResponseOrThrow<DropboxCreateSharedLinkWithSettingsError>(error);
            const shareError = error.error;
            if (!shareError.error) {
                ThrowDropboxError(shareError);
            }
            return "";
        }
    }
}
