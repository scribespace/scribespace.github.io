import * as DropboxAPI from "dropbox";
import { DropboxFileSystemAsync } from "./dropboxFileSystemAsync";
import { GetExtendedFileSystemBase } from "./dropboxFileSystemBase";
import { FileSystemMainThread } from "@coreSystems";

const DropboxFileSystemExtened = GetExtendedFileSystemBase(DropboxFileSystemAsync);
export class DropboxFileSystem extends DropboxFileSystemExtened implements FileSystemMainThread{
  constructor(dbx: DropboxAPI.Dropbox) {
    //@ts-expect-error Class defined in mixin needs this argument
    super(dbx);
  }
  isPathID(path: string): boolean {
    return path.startsWith('id:');
  }
  
  async getFileList(dirPath: string, callback: (list: string[]) => void, onerror: (error: unknown) => void): Promise<void> {
    try {
      const fileListResult = await this.dbx.filesListFolder({path: dirPath});
      const fileList = fileListResult.result;

      do {
        const files: string[] = [];
        for ( const entry of fileList.entries ) {
          if ( entry[".tag"] == 'file' ) {
            files.push( entry.id );
          }
        }

        await callback(files);
      } while( fileList.has_more );

    } catch ( error ) {
      onerror(error);
    }
  }
}