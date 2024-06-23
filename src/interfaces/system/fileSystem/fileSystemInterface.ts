/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebWorkerManagerInterface } from "@/interfaces/webWorker";
import { assert, notNullOrThrowDev } from "@/utils";
import { DeleteResults, DownloadResult, File, FileUploadMode, InfoResult } from "./fileSystemShared";

export interface FileSystemBase{
  calculateFileHash(file: File): Promise<string>;
  getFileHash(path: string): Promise<string>; 
  getFileInfo(path: string): Promise<InfoResult>; 
  uploadFile( path: string, file: File, mode: FileUploadMode ): Promise<InfoResult>;
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

export interface FileSystemMainThread {
  isPathID(path: string): boolean;
  getFileList(dirPath: string, callback: (list: string[]) => void, onerror: (error:any) => void): Promise<void>;
}

export interface FileSystem extends FileSystemAsync, FileSystemBase, FileSystemMainThread {
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