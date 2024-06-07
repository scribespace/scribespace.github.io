import { DeleteResults, DownloadResult, File, FileUploadMode, UploadResult } from "./fileSystemShared";
import { FileSystemWorkerWrapper } from "./fileSystemWorkerInterface";

export interface FileSystem extends FileSystemWorkerWrapper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerFileSystemAsync(api: any): void;
  calculateFileHashSync(file: File): Promise<string>;
  getFileHashSync(path: string): Promise<string>; 
  uploadFileSync( path: string, file: File, mode: FileUploadMode ): Promise<UploadResult>;
  downloadFileSync(path: string): Promise<DownloadResult>;
  deleteFileSync(path: string): Promise<DeleteResults>;
  getFileURLSync(path: string): Promise<string>;
}
