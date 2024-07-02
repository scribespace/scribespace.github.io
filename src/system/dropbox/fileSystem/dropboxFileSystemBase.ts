/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FileSystemBase
} from "@/interfaces/system/fileSystem/fileSystemInterface";
import {
  FileInfo,
  FileInfoResultType,
  FileResult,
  FileResultType,
  FileSystemResult,
  FileSystemStatus,
  FileUploadMode
} from "@/interfaces/system/fileSystem/fileSystemShared";
import { Constructor, variableExistsOrThrow } from "@utils";
import * as DropboxAPI from "dropbox";
import {
  DropboxCommitInfo,
  DropboxCreateSharedLinkWithSettingsError,
  DropboxDeleteError,
  DropboxDownloadError,
  DropboxFileBlobResponse,
  DropboxFileMetadata,
  DropboxGetMetadataError,
  DropboxLinkAudiencePublic,
  DropboxUploadSessionAppendError,
  DropboxUploadSessionFinishError,
  DropboxUploadSessionStartError,
  DropboxUploadSessionTypeConcurrent,
  DropboxUploadSmallFileError,
  DropboxWriteModeAdd,
  DropboxWriteModeOverwrite,
  ThrowDropboxError,
  isDropboxResponseErrorOrThrow,
} from "../dropboxCommon";
import { HandleDeleteError, HandleDownloadError, HandleGetMetadataError, HandleUploadError } from "./dropboxFileSystemShared";

export function metaToFileInfo(meta: DropboxFileMetadata): FileInfo {
  return {
    hash: meta.content_hash,
    id: meta.id,
    path: meta.path_lower || '',
    date: meta.server_modified
  };
}

export function GetExtendedFileSystemBase<TExtend extends Constructor>(extend: TExtend) {
  return class DropboxFileSystemBase extends extend implements FileSystemBase {
    protected dbx: DropboxAPI.Dropbox;
    constructor(...args: any[]) {
      const [dbx] = args;
      super();
      this.dbx = dbx;
    }

    async calculateFileHash(fileContent: Blob): Promise<string> {
      /*
          -Split the file into blocks of 4 MB (4,194,304 or 4 * 1024 * 1024 bytes). The last block (if any) may be smaller than 4 MB.
          -Compute the hash of each block using SHA-256.
          -Concatenate the hash of all blocks in the binary format to form a single binary string.
          -Compute the hash of the concatenated string using SHA-256. Output the resulting hash in hexadecimal format.
      */

      const BLOCK_SIZE = 4 * 1024 * 1024;
      const blocksHashesPromises: Promise<ArrayBuffer>[] = [];
      const fileSize = fileContent.size;
      for (let offset = 0; offset < fileSize; offset += BLOCK_SIZE) {
        const blockSize = Math.min(BLOCK_SIZE, fileSize - offset);
        const blockBlob = fileContent.slice(offset, offset + blockSize);
        const blockHashPromise = blockBlob.arrayBuffer();
        blocksHashesPromises.push(blockHashPromise);
      }

      const blockArrays = await Promise.all(blocksHashesPromises);
      blocksHashesPromises.length = 0;
      for (const blockArray of blockArrays) {
        const blockHashPromise = crypto.subtle.digest("SHA-256", blockArray);
        blocksHashesPromises.push(blockHashPromise);
      }

      let mergedBufferSize = 0;
      const blockHashes = await Promise.all(blocksHashesPromises);
      for (const blockHash of blockHashes) {
        mergedBufferSize += blockHash.byteLength;
      }

      const mergedHash = new Uint8Array(mergedBufferSize);
      let offset = 0;
      for (const blockHash of blockHashes) {
        mergedHash.set(new Uint8Array(blockHash), offset);
        offset += blockHash.byteLength;
      }

      const finalHashArrayBuffer = await crypto.subtle.digest(
        "SHA-256",
        mergedHash
      );
      const finalHash = new Uint8Array(finalHashArrayBuffer);
      const hexHash: string[] = new Array<string>(mergedBufferSize);
      for (const b of finalHash) {
        const char = b.toString(16).padStart(2, "0");
        hexHash.push(char);
      }

      return hexHash.join("");
    }

    //for files below 150MB
    private async uploadSmallFile(
      path: string,
      content: Blob,
      commit: DropboxCommitInfo,
      fileHash: Promise<string>
    ): Promise<FileInfoResultType> {
      let fileMeta: DropboxFileMetadata;
      try {
        fileMeta = (
          await this.dbx.filesUpload({
            path,
            contents: content,
            autorename: commit.autorename,
            mute: commit.mute,
            mode: commit.mode,
            content_hash: await fileHash,
          })
        ).result;
      } catch (error) {
        isDropboxResponseErrorOrThrow<DropboxUploadSmallFileError>(error);
        const uploadError = error.error;
        if (!uploadError.error) {
          ThrowDropboxError(uploadError);
        }
        return HandleUploadError(path, uploadError.error);
      }

      const fileInfo = metaToFileInfo(fileMeta);
      return { status: FileSystemStatus.Success, fileInfo };
    }

    private async uploadBigFile(
      path: string,
      content: Blob,
      commit: DropboxCommitInfo,
      fileHash: Promise<string>
    ): Promise<FileInfoResultType> {
      const concurrentSize = 4194304; // call must be multiple of 4194304 bytes (except for last upload_session/append:2 with UploadSessionStartArg.close to true, that may contain any remaining data).
      const maxBlob =
        concurrentSize * Math.floor((8 * 1024 * 1024) / concurrentSize); // 8MB - Dropbox JavaScript API suggested max file / chunk size

      const blobs: Blob[] = [];
      let offset = 0;
      while (offset < content.size) {
        const blobSize = Math.min(maxBlob, content.size - offset);
        blobs.push(content.slice(offset, offset + blobSize));
        offset += maxBlob;
      }
      const blobsCount = blobs.length;

      let sessionId: string = "";
      try {
        sessionId = (
          await this.dbx.filesUploadSessionStart({
            session_type: DropboxUploadSessionTypeConcurrent,
          })
        ).result.session_id;
      } catch (error) {
        isDropboxResponseErrorOrThrow<DropboxUploadSessionStartError>(error);
        const uploadError = error.error;
        if (!uploadError.error) {
          ThrowDropboxError(uploadError);
        }
        return HandleUploadError(path, uploadError.error);
      }

      try {
        const uploadPromises: Promise<DropboxAPI.DropboxResponse<void>>[] = [];
        for (let id = 0; id < blobsCount - 1; ++id) {
          const cursor = { session_id: sessionId, offset: id * maxBlob };
          uploadPromises.push(
            this.dbx.filesUploadSessionAppendV2({
              cursor: cursor,
              contents: blobs[id],
            })
          );
        }

        const lastBlob = blobs[blobsCount - 1];
        const cursor = {
          session_id: sessionId,
          offset: (blobsCount - 1) * maxBlob,
        };
        uploadPromises.push(
          this.dbx.filesUploadSessionAppendV2({
            cursor: cursor,
            contents: lastBlob,
            close: true,
          })
        );
        await Promise.all(uploadPromises);
      } catch (error) {
        isDropboxResponseErrorOrThrow<DropboxUploadSessionAppendError>(error);
        const uploadError = error.error;
        if (!uploadError.error) {
          ThrowDropboxError(uploadError);
        }
        return HandleUploadError(path, uploadError.error);
      }

      let fileMeta: DropboxFileMetadata;
      try {
        const cursor = { session_id: sessionId, offset: 0 /*concurrent*/ };
        fileMeta = (
          await this.dbx.filesUploadSessionFinish({
            cursor: cursor,
            commit: commit,
            content_hash: await fileHash,
          })
        ).result;
      } catch (error) {
        isDropboxResponseErrorOrThrow<DropboxUploadSessionFinishError>(error);
        const uploadError = error.error;
        if (!uploadError.error) {
          ThrowDropboxError(uploadError);
        }
        return HandleUploadError(path, uploadError.error);
      }

      const fileInfo = metaToFileInfo(fileMeta);
      return { status: FileSystemStatus.Success, fileInfo };
    }

    async uploadFile(
      path: string,
      content: Blob,
      mode: FileUploadMode
    ): Promise<FileInfoResultType> {
      const smallFileMaxSize = 150 * 1024 * 1024; // 150 MB - from dropbox doc
      const settings: DropboxCommitInfo = {
        path: path,
        mute: true,
        autorename: true,
        mode: DropboxWriteModeAdd,
      };
      switch (mode) {
        case FileUploadMode.Add:
          //defualt
          break;
        case FileUploadMode.Replace:
          settings.autorename = false;
          settings.mode = DropboxWriteModeOverwrite;
          break;
        default:
          ThrowDropboxError("Unknown upload mode");
      }

      const fileHash: Promise<string> = this.calculateFileHash(content);
      if (content.size < smallFileMaxSize) {
        return this.uploadSmallFile(path, content, settings, fileHash);
      } else {
        return this.uploadBigFile(path, content, settings, fileHash);
      }
    }

    async downloadFile(path: string): Promise<FileResultType> {
      let respond: DropboxFileBlobResponse;
      try {
        respond = await this.dbx.filesDownload({ path: path });
      } catch (error) {
        isDropboxResponseErrorOrThrow<DropboxDownloadError>(error);
        const downloadError = error.error;
        if (!downloadError.error) {
          ThrowDropboxError(downloadError);
        }
        return HandleDownloadError(path, downloadError.error); // promise returns DropboxResponseError<Error<files.DownloadError>> (there is a mistake in index.d.ts)
      }

      const fileMeta = respond.result;
      variableExistsOrThrow(fileMeta.path_lower, "Missing fileMeta.path_lower");
      variableExistsOrThrow(fileMeta.fileBlob, "Missing fileMeta.fileBlob");
      const fileExtension = fileMeta.path_lower.split(".").pop();
      let fileType = "";
      switch (fileExtension) {
        case "png":
        case "jpg": // only png can be copied to clipboard, it should get converted
        case "jpeg":
          fileType = "image/png";
          break;
        case "gif":
          fileType = "image/gif";
          break;
        case "mp4":
          fileType = "video/mp4";
          break;
      }

      const fileContent = fileType
        ? fileMeta.fileBlob.slice(0, fileMeta.fileBlob.size, fileType)
        : fileMeta.fileBlob;
      const fileHash: string = await this.calculateFileHash(fileContent);

      if (fileHash !== fileMeta.content_hash) {
        return { status: FileSystemStatus.MismatchHash };
      }

      const result: FileResult = {
        status: FileSystemStatus.Success,
        content: fileContent,
        fileInfo: metaToFileInfo( fileMeta )
      };

      return result;
    }

    async getFileInfo(path: string): Promise<FileInfoResultType> {
      let fileMeta: DropboxFileMetadata;
      try {
        fileMeta = (await this.dbx.filesGetMetadata({ path: path }))
          .result as DropboxFileMetadata;
      } catch (error) {
        isDropboxResponseErrorOrThrow<DropboxGetMetadataError>(error);
        const getMetadataError = error.error;
        if (!getMetadataError.error) {
          ThrowDropboxError(getMetadataError);
        }
        return HandleGetMetadataError(path, getMetadataError.error);
      }

      return {
        status: FileSystemStatus.Success,
        fileInfo: metaToFileInfo( fileMeta ),
      };
    }

    async getFileHash(path: string): Promise<string> {
      const fileMeta = await this.getFileInfo(path);
      if ( fileMeta.status !== FileSystemStatus.Success ) {
        ThrowDropboxError({
          status: fileMeta.status,
          message: `Couldn't get FileInfo`
        });
      }

      if (!fileMeta.fileInfo.hash) {
        ThrowDropboxError({
          status: FileSystemStatus.NotFound,
          message: 'getFileHash: no hash for file "' + path + '"',
        });
      }
      return fileMeta.fileInfo.hash;
    }

    async deleteFile(path: string): Promise<FileSystemResult> {
      try {
        await this.dbx.filesDeleteV2({ path: path });
      } catch (error) {
        isDropboxResponseErrorOrThrow<DropboxDeleteError>(error);
        const deleteError = error.error;
        if (!deleteError.error) {
          ThrowDropboxError(deleteError);
        }
        return HandleDeleteError(path, deleteError.error); // promise returns DropboxResponseError<Error<files.DownloadError>> (there is a mistake in index.d.ts)
      }

      return {status: FileSystemStatus.Success};
    }

    async getFileURL(path: string): Promise<string> {
      try {
        const share = await this.dbx.sharingCreateSharedLinkWithSettings({
          path: path,
          settings: {
            audience: DropboxLinkAudiencePublic,
          },
        });

        let url = share.result.url.slice(0, -4); // remove dl=0
        url = url + "raw=1"; // add raw file

        return url;
      } catch (error) {
        isDropboxResponseErrorOrThrow<DropboxCreateSharedLinkWithSettingsError>(
          error
        );
        const shareError = error.error;
        if (!shareError.error) {
          ThrowDropboxError(shareError);
        }
        return "";
      }
    }
  };
}
