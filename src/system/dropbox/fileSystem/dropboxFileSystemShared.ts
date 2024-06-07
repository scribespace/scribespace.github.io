import { FileResult, FileSystemStatus } from "@/interfaces/system/fileSystem/fileSystemShared";
import { DropboxLookupError, ThrowDropboxError, DropboxDownloadError, DropboxDeleteError, DropboxUploadError, DropboxGetMetadataError } from "../dropboxCommon";


function HandleLookupError(
  path: string,
  lookupError: DropboxLookupError
): FileResult {
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
): FileResult {
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
): FileResult {
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
): FileResult {
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
