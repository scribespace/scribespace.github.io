import { FileSystemBase } from "@/interfaces/system/fileSystem/fileSystemInterface";
import { FileSystemWorkerRegister, FileSystemWorkerWrapper } from "@/interfaces/system/fileSystem/fileSystemWorkerInterface";
import { WebWorkerManager } from "@/interfaces/webWorker";
import * as DropboxAPI from "dropbox";
import { DropboxAuth } from "../dropboxAuth";
import { DropboxFileSystemWorkerImplementation, DropboxFileSystemWorkerImplementationExtended } from "./dropboxFileSystemWorkerImplementation";
import workerURL from "./dropboxFileSystemWorkerImplementation?worker&url";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface DropboxFileSystemAsync extends FileSystemWorkerWrapper{}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class DropboxFileSystemAsync extends WebWorkerManager<FileSystemBase, DropboxFileSystemWorkerImplementationExtended> implements FileSystemWorkerRegister {
    constructor() {
        super(workerURL, DropboxFileSystemWorkerImplementation.prototype, "Async");
      }

      registerFileSystemWorker(auth: DropboxAuth) {
        const dbxAuth = auth.GetDropboxAuth();
        const authOptions: DropboxAPI.DropboxOptions = {
          accessToken: dbxAuth.getAccessToken(),
          accessTokenExpiresAt: dbxAuth.getAccessTokenExpiresAt(),
          refreshToken: dbxAuth.getRefreshToken(),
          clientId: dbxAuth.getClientId(),
        };
        
        this.callFunction("registerFileSystemWorker", [authOptions], ()=>{}, (error) => console.error(error) );
      }
}