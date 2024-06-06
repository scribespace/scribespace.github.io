export enum FileSystemStatus {
  Unknown,
  Success,
  NotFound,
  MismatchHash,
}

export enum FileUploadMode {
  Add,
  Replace,
}

export interface File {
  content: Blob | null;
}

export interface FileInfo {
  hash: string | undefined;
  name: string | undefined;
}

export interface FileResult {
  status: FileSystemStatus;
}

export interface UploadResult extends FileResult {
  fileInfo?: FileInfo;
}
export interface DownloadResult extends FileResult {
  file?: File;
  fileInfo?: FileInfo;
}
export interface DeleteResults extends FileResult {}

export interface GetMetadataResults extends FileResult {
  fileInfo?: FileInfo;
}

export interface FileSystem {
  calculateFileHash(file: File): Promise<string>;
  getFileHash(path: string): Promise<string>; // return file's hash from server as string
  uploadFile(
    path: string,
    file: File,
    mode: FileUploadMode,
  ): Promise<UploadResult>;
  downloadFile(path: string): Promise<DownloadResult>;
  deleteFile(path: string): Promise<DeleteResults>;
  getFileURL(path: string): Promise<string>;
}
