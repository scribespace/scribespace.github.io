import { DeleteResults, DownloadResult, File, FileUploadMode, UploadResult } from "./fileSystemShared";
import { FileSystemWorkerRegister, FileSystemWorkerWrapper } from "./fileSystemWorkerInterface";

export interface FileSystemAsync extends FileSystemWorkerWrapper, FileSystemWorkerRegister {
}

export interface FileSystemBase{
  calculateFileHash(file: File): Promise<string>;
  getFileHash(path: string): Promise<string>; 
  uploadFile( path: string, file: File, mode: FileUploadMode ): Promise<UploadResult>;
  downloadFile(path: string): Promise<DownloadResult>;
  deleteFile(path: string): Promise<DeleteResults>;
  getFileURL(path: string): Promise<string>;
}

export interface FileSystem extends FileSystemAsync, FileSystemBase {
}
