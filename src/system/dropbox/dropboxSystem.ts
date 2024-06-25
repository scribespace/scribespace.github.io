import { $setAuthentication } from "@/interfaces/system/authInterface";
import * as DropboxAPI from "dropbox";
import { DropboxAuth } from "./dropboxAuth";
import { DropboxFileSystem } from "./fileSystem/dropboxFileSystem";
import { $setFileSystem, System } from "@coreSystems";
import { DROPBOX_APP } from "./dropboxCommon";

export class DropboxSystem implements System {
  private __dbx: DropboxAPI.Dropbox = new DropboxAPI.Dropbox();

  constructor() {
    const auth = new DropboxAuth();
    this.__dbx = new DropboxAPI.Dropbox({ auth: auth.getDropboxAuth() });
    auth.setDropbox(this.__dbx);
    $setAuthentication(auth);
    $setFileSystem( new DropboxFileSystem(this.__dbx) );
  }

  getAppID(): string {
    return DROPBOX_APP;
  }
  getSystemDomain(): string {
    return "https://www.dropbox.com";
  }
}
