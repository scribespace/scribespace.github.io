
export enum FileSystemStatus {
  Unknown,
  Success,
  NotFound,
  MismatchHash
}

export enum FileUploadMode {
  Add,
  Replace
}

export interface FileInfo {
  hash?: string;
  id: string;
  path: string;
  date: string;
}

export interface FileSystemResult {
  status: FileSystemStatus;
}

export interface FileSystemFailedResult {
  status: FileSystemStatus.Unknown | FileSystemStatus.NotFound | FileSystemStatus.MismatchHash;
}

export interface FileSystemSuccessResult {
  status: FileSystemStatus.Success;
}

export interface FileInfoResult extends FileSystemSuccessResult {
  fileInfo: FileInfo;
}
export type FileInfoResultType = FileSystemFailedResult | FileInfoResult;

export interface FileObject {
  content: Blob;
  fileInfo: FileInfo;
}

export interface FileResult extends FileObject, FileSystemSuccessResult {
}
export type FileResultType = FileSystemFailedResult | FileResult;
