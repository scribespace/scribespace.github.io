
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
  hash: string | undefined;
  id: string;
  path: string;
}

export interface File {
  content: Blob;
  info: FileInfo;
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

export interface FileResult extends FileSystemSuccessResult {
  file: File;
}
export type FileResultType = FileSystemFailedResult | FileResult;
