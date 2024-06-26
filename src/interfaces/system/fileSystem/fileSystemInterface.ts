/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebWorkerManagerInterface } from "@/interfaces/webWorker";
import { assert, notNullOrThrowDev } from "@/utils";
import { FileInfo, FileInfoResultType, FileResultType, FileSystemResult, FileUploadMode } from "./fileSystemShared";

export interface FileSystemBase{
  calculateFileHash(fileContent: Blob): Promise<string>;
  getFileHash(path: string): Promise<string>; 
  getFileInfo(path: string): Promise<FileInfoResultType>; 
  uploadFile( path: string, content: Blob, mode: FileUploadMode ): Promise<FileInfoResultType>;
  downloadFile(path: string): Promise<FileResultType>;
  deleteFile(path: string): Promise<FileSystemResult>;
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
  getFileList(dirPath: string, callback: (list: FileInfo[]) => void): Promise<FileSystemResult>;
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