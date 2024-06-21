/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebWorkerManagerInterface } from "@/interfaces/webWorker";
import { assert, notNullOrThrowDev } from "@/utils";
import { DeleteResults, DownloadResult, File, FileUploadMode, UploadResult } from "./fileSystemShared";

export interface FileSystemBase{
  calculateFileHash(file: File): Promise<string>;
  getFileHash(path: string): Promise<string>; 
  uploadFile( path: string, file: File, mode: FileUploadMode ): Promise<UploadResult>;
  downloadFile(path: string): Promise<DownloadResult>;
  deleteFile(path: string): Promise<DeleteResults>;
  getFileURL(path: string): Promise<string>;
}

export interface FileSystemWorkerRegister {
  registerFileSystemWorker(api: any): void;
}

export type FileSystemWorkerWrapper = WebWorkerManagerInterface<FileSystemBase, "Async">;

export interface FileSystemAsync extends FileSystemWorkerWrapper, FileSystemWorkerRegister {
}

export interface FileSystem extends FileSystemAsync, FileSystemBase {
}

let fileSystem: FileSystem | null = null;


export function $setFileSystem( fs: FileSystem | null ) {
  assert( fs == null || fileSystem == null, "File system already set" );
  fileSystem = fs;
}

export function $getFileSystem() {
  notNullOrThrowDev(fileSystem);
  return fileSystem;
}