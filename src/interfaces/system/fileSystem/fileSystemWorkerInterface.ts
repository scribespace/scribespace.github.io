/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebWorkerManagerInterface } from "@/interfaces/webWorker";
import { FileSystemBase } from "./fileSystemInterface";

export interface FileSystemWorkerRegister {
  registerFileSystemWorker(api: any): void;
}

export interface FileSystemWorkerFunctions extends FileSystemBase {
  registerFileSystemWorker(api: any): void;
}
export type FileSystemWorkerWrapper = WebWorkerManagerInterface<FileSystemBase, "Async">;
