/* eslint-disable @typescript-eslint/no-unused-vars */
import { WebWorkerManagerInterface } from "@/interfaces/webWorker";
import { DownloadResult } from "./fileSystemShared";

export const FileSystemWorkerImplementation = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerFileSystemWorker(api: any): void {
    throw Error("Not implemented");
  },

  downloadFileAsync(path: string): Promise<[result: DownloadResult]> {
    throw Error("Not implemented");
  },
};

export type FileSystemWorkerInterface = typeof FileSystemWorkerImplementation;
export type FileSystemWorkerWrapper = WebWorkerManagerInterface<FileSystemWorkerInterface>;
