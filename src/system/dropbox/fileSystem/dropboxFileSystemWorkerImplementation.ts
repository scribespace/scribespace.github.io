import { WebWorkerThread } from "@/interfaces/webWorker";
import { GetExtendedFileSystemBase } from "./dropboxFileSystemBase";
import { EmptyClass } from "@/utils";
import { FileSystemWorkerRegister } from "@/interfaces/system/fileSystem/fileSystemInterface";
import * as DropboxAPI from "dropbox";

export const DropboxFileSystemWorkerPublic = GetExtendedFileSystemBase(EmptyClass);

export class DropboxFileSystemWorkerImplementationExtended extends DropboxFileSystemWorkerPublic implements FileSystemWorkerRegister {
  
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
