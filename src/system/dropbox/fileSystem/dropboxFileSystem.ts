import * as DropboxAPI from "dropbox";
import { DropboxFileSystemAsync } from "./dropboxFileSystemAsync";
import { GetExtendedFileSystemBase } from "./dropboxFileSystemBase";

const DropboxFileSystemExtened = GetExtendedFileSystemBase(DropboxFileSystemAsync);
export class DropboxFileSystem extends DropboxFileSystemExtened {
  constructor(dbx: DropboxAPI.Dropbox) {
    //@ts-expect-error Class defined in mixin needs this argument
    super(dbx);
  }
}