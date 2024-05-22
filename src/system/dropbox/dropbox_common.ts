import { DropboxResponse, files, Error as DropboxError, DropboxResponseError, sharing } from "dropbox";

export const DROPBOX_APP = 'dropbox';

export interface DropboxSystemError<T> {
    system: 'Dropbox',
    error: T,
}

export function ThrowDropboxError<T>(error: T): never {
    throw { system: 'Dropbox', error } as DropboxSystemError<T>;
}

export function isDropboxResponseError<T extends object>(error: unknown): error is DropboxResponseError<DropboxError<T>> {
    return typeof error === 'object' && error !== null && 
           'error' in error && 
           typeof (error as DropboxResponseError<DropboxError<T>>).error === 'object' && 
           'error_summary' in (error as DropboxResponseError<DropboxError<T>>).error && 
           'error' in (error as DropboxResponseError<DropboxError<T>>).error &&
           typeof (error as DropboxResponseError<DropboxError<T>>).error.error === 'object' && 
           '.tag' in (error as DropboxResponseError<DropboxError<T>>).error.error;
}

export function isDropboxResponseErrorOrThrow<T extends object>(error: unknown): asserts error is DropboxResponseError<DropboxError<T>> {
    if ( !isDropboxResponseError<T>(error) ) ThrowDropboxError(`Unknown Dropbox Error: ${error}`);
}

export type DropboxFileMetadata = files.FileMetadata;

export interface DropboxFileBlob extends DropboxFileMetadata {
    fileBlob?: Blob;
}

export type DropboxFileBlobResponse = DropboxResponse<DropboxFileBlob>;

export type DropboxLookupError = files.LookupError;

export type DropboxUploadSmallFileError = files.UploadError;
export type DropboxFileMetadataErrorResponse = DropboxResponseError<DropboxError<DropboxUploadSmallFileError>>;

export type DropboxUploadSessionStartError = files.UploadSessionStartError;
export type DropboxUploadSessionStartErrorResponse = DropboxResponseError<DropboxError<DropboxUploadSessionStartError>>;

export type DropboxUploadSessionAppendError = files.UploadSessionAppendError;
export type DropboxUploadSessionAppendErrorResponse = DropboxResponseError<DropboxError<DropboxUploadSessionAppendError>>;

export type DropboxUploadSessionFinishError = files.UploadSessionFinishError;
export type DropboxUploadSessionFinishErrorResponse = DropboxResponseError<DropboxError<DropboxUploadSessionFinishError>>;

export type DropboxUploadError = DropboxUploadSmallFileError | DropboxUploadSessionStartError | DropboxUploadSessionAppendError | DropboxUploadSessionFinishError;

export type DropboxDownloadError = files.DownloadError;
export type DropboxDownloadErrorResponse = DropboxResponseError<DropboxError<DropboxDownloadError>>;

export type DropboxGetMetadataError = files.GetMetadataError;
export type DropboxGetMetadataErrorResponse = DropboxResponseError<DropboxError<DropboxGetMetadataError>>;

export type DropboxDeleteError = files.DeleteError;
export type DropboxDeleteErrorResponse = DropboxResponseError<DropboxError<DropboxDeleteError>>;

export type DropboxCreateSharedLinkWithSettingsError = sharing.CreateSharedLinkWithSettingsError;
export type DropboxCreateSharedLinkWithSettingsErrorResponse = DropboxResponseError<DropboxError<DropboxCreateSharedLinkWithSettingsError>>;

export type DropboxCommitInfo = files.CommitInfo;

export const DropboxWriteModeAdd: files.WriteModeAdd = {'.tag': 'add'};
export const DropboxWriteModeOverwrite: files.WriteModeOverwrite = {'.tag': 'overwrite'};
export const DropboxLinkAudiencePublic: sharing.LinkAudiencePublic = { '.tag': 'public' };
export const DropboxUploadSessionTypeConcurrent: files.UploadSessionTypeConcurrent = {'.tag': 'concurrent' };