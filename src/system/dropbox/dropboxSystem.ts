import * as DropboxAPI from "dropbox";
import { DropboxAuth } from "./dropboxAuth";
import { System } from "@interfaces/system/systemInterface";
import { Authenticate } from "@/interfaces/system/authInterface";
import { FileSystem } from "@/interfaces/system/fileSystem/fileSystemInterface";
import { DROPBOX_APP } from "./dropboxCommon";
import { DropboxFileSystem } from "./fileSystem/dropboxFileSystem";

export class DropboxSystem implements System {
  private dbx: DropboxAPI.Dropbox = new DropboxAPI.Dropbox();
  auth: DropboxAuth;
  fileSystem: DropboxFileSystem;

  constructor() {
    this.auth = new DropboxAuth();
    const drobopxOptions: DropboxAPI.DropboxOptions = { auth: this.auth.GetDropboxAuth() };
    this.dbx = new DropboxAPI.Dropbox(drobopxOptions);
    this.auth.SetDropbox(this.dbx);
    this.fileSystem = new DropboxFileSystem(this.dbx);
  }

  getID(): string {
    return DROPBOX_APP;
  }

  getAuth(): Authenticate {
    return this.auth;
  }

  getFileSystem(): FileSystem {
    return this.fileSystem;
  }

  getSystemDomain(): string {
    return "https://www.dropbox.com";
  }
}
