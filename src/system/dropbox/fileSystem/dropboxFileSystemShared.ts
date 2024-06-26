import { FileSystemFailedResult, FileSystemStatus } from "@/interfaces/system/fileSystem/fileSystemShared";
import { DropboxDeleteError, DropboxDownloadError, DropboxGetMetadataError, DropboxListFolderError, DropboxLookupError, DropboxUploadError, ThrowDropboxError } from "../dropboxCommon";


function HandleLookupError(
  path: string,
  lookupError: DropboxLookupError
): FileSystemFailedResult {
  switch (lookupError[".tag"]) {
    case "not_found": //LookupErrorNotFound
      return { status: FileSystemStatus.NotFound };
    default:
      ThrowDropboxError(
        "Unsupported LookupError type. File: " +
        path +
        " Tag: " +
        lookupError[".tag"]
      );
  }
}
export function HandleDownloadError(
  path: string,
  downloadError: DropboxDownloadError
): FileSystemFailedResult {
  switch (downloadError[".tag"]) {
    case "path": //DownloadErrorPath
      return HandleLookupError(path, downloadError.path);
    default:
      ThrowDropboxError("Unsupported DownloadError type. File: " + path);
  }
}
export function HandleDeleteError(
  path: string,
  deleteError: DropboxDeleteError
): FileSystemFailedResult {
  switch (deleteError[".tag"]) {
    case "path_lookup": //DeleteErrorPathLookup
      return HandleLookupError(path, deleteError.path_lookup);
    default:
      ThrowDropboxError("Unsupported DownloadError type. File: " + path);
  }
}
export function HandleUploadError(
  path: string,
  uploadError: DropboxUploadError
): FileSystemFailedResult {
  switch (uploadError[".tag"]) {
    case "content_hash_mismatch":
      return { status: FileSystemStatus.MismatchHash };
    default:
      ThrowDropboxError(
        "Unsupported UploadError type. File: " +
        path +
        " Tag: " +
        uploadError[".tag"]
      );
  }
}
export function HandleGetMetadataError(
  path: string,
  getMetadataError: DropboxGetMetadataError
) {
  switch (getMetadataError[".tag"]) {
    case "path": //DownloadErrorPath
      return HandleLookupError(path, getMetadataError.path);
    default:
      ThrowDropboxError("Unsupported GetMetadataError type. File: " + path);
  }
}

export function HandleListFolderError(
  path: string,
  listFolderError: DropboxListFolderError
) {
  switch (listFolderError[".tag"]) {
    case "path": //DownloadErrorPath
      return HandleLookupError(path, listFolderError.path);
    default:
      ThrowDropboxError("Unsupported listFolderError type. File: " + path);
  }
}
