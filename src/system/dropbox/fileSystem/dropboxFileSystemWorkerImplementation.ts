import { WebWorkerThread } from "@/interfaces/webWorker";
import { GetExtendedFileSystemBase } from "./dropboxFileSystemBase";
import { EmptyClass } from "@/utils";
import { FileSystemWorkerFunctions } from "@/interfaces/system/fileSystem/fileSystemWorkerInterface";
import * as DropboxAPI from "dropbox";

export const DropboxFileSystemWorkerImplementation = GetExtendedFileSystemBase(EmptyClass);

export class DropboxFileSystemWorkerImplementationExtended extends DropboxFileSystemWorkerImplementation implements FileSystemWorkerFunctions {
  
  constructor() {
    //@ts-expect-error Class defined in mixin needs this argument
    super(new DropboxAPI.Dropbox());
  }
  
  registerFileSystemWorker(authOptions: DropboxAPI.DropboxOptions): void {
    this.dbx = new DropboxAPI.Dropbox(authOptions);
  }  
}

const dropboxFileSystem = new DropboxFileSystemWorkerImplementationExtended();
new WebWorkerThread(dropboxFileSystem);
