import { $setAuthentication } from "@/interfaces/system/authInterface";
import { $setFileSystem } from "@/interfaces/system/fileSystem/fileSystemInterface";
import * as DropboxAPI from "dropbox";
import { DropboxAuth } from "./dropboxAuth";
import { DropboxFileSystem } from "./fileSystem/dropboxFileSystem";
import { System } from "@coreSystems";
import { DROPBOX_APP } from "./dropboxCommon";

export class DropboxSystem implements System {
  private dbx: DropboxAPI.Dropbox = new DropboxAPI.Dropbox();

  constructor() {
    const auth = new DropboxAuth();
    this.dbx = new DropboxAPI.Dropbox({ auth: auth.getDropboxAuth() });
    auth.setDropbox(this.dbx);
    $setAuthentication(auth);
    $setFileSystem( new DropboxFileSystem(this.dbx) );
  }

  getAppID(): string {
    return DROPBOX_APP;
  }
  getSystemDomain(): string {
    return "https://www.dropbox.com";
  }
}
