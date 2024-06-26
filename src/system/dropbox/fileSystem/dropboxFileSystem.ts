import { FileSystemMainThread } from "@coreSystems";
import { FileInfo, FileSystemResult, FileSystemStatus } from "@interfaces/system/fileSystem/fileSystemShared";
import * as DropboxAPI from "dropbox";
import { DropboxListFolderError, ThrowDropboxError, isDropboxResponseErrorOrThrow } from "../dropboxCommon";
import { DropboxFileSystemAsync } from "./dropboxFileSystemAsync";
import { GetExtendedFileSystemBase, metaToFileInfo } from "./dropboxFileSystemBase";
import { HandleListFolderError } from "./dropboxFileSystemShared";

const DropboxFileSystemExtened = GetExtendedFileSystemBase(DropboxFileSystemAsync);
export class DropboxFileSystem extends DropboxFileSystemExtened implements FileSystemMainThread{
  constructor(dbx: DropboxAPI.Dropbox) {
    //@ts-expect-error Class defined in mixin needs this argument
    super(dbx);
  }
  isFileID(path: string): boolean {
    return path.startsWith('id:');
  }
  
  async getFileList(dirPath: string, callback: (list: FileInfo[]) => void): Promise<FileSystemResult> {
    try {
      let cursor = '';
      do {
        let fileList: DropboxAPI.files.ListFolderResult | null = null;

        if ( cursor === '' ) {
          const fileListResult = await this.dbx.filesListFolder({path: dirPath});
          fileList = fileListResult.result;
          cursor = fileList.has_more ? fileList.cursor : '';
        } else {
          const fileListResult = await this.dbx.filesListFolderContinue({cursor});
          fileList = fileListResult.result;
          cursor = fileList.has_more ? fileList.cursor : '';
        }

        const files: FileInfo[] = [];
        for ( const entry of fileList.entries ) {
          if ( entry[".tag"] == 'file' ) {
            files.push( metaToFileInfo(entry) );
          }
        }

        await callback(files);
      } while( cursor !== '' );

      return {status: FileSystemStatus.Success};
    } catch ( error ) {
        isDropboxResponseErrorOrThrow<DropboxListFolderError>(error);
        const listFolderError = error.error;
        if (!listFolderError.error) {
          ThrowDropboxError(listFolderError);
        }
      return HandleListFolderError(dirPath, listFolderError.error );
    }
  }
}