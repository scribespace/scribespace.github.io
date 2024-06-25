import { WebWorkerManager } from "@/interfaces/webWorker";

import { FileInfoResultType, FileSystemStatus, FileUploadMode } from "@/interfaces/system/fileSystem/fileSystemShared";
import { assert } from "@/utils";
import { $getFileSystem } from "@coreSystems";
import { ImageManagerWorkerPublic } from "./imageManagerWorker";
import workerURL from "./imageManagerWorker?worker&url";
import { ImageManagerWorkerFunctions, ImageManagerWorkerFunctionsExtended, ImageManagerWorkerWrapper } from "./workerShared";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface ImageManager extends ImageManagerWorkerWrapper {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class ImageManager extends WebWorkerManager<ImageManagerWorkerFunctions, ImageManagerWorkerFunctionsExtended> {
  constructor() {
    super(workerURL, ImageManagerWorkerPublic);
  }

  imageUpload(imageBlob: Blob): Promise<string> {
    return $getFileSystem()
    .uploadFileAsync($getImageName(imageBlob.type), imageBlob, FileUploadMode.Add)
    .then(
      (result: FileInfoResultType) => {
        assert( result.status === FileSystemStatus.Success, "Missing fileInfo" );
        return $getFileSystem().getFileURLAsync(result.fileInfo.id);
      }
    );
  }
}
const imageManager = new ImageManager();

export function $getImageManager(): ImageManager {
  return imageManager;
}

export const IMAGES_PATH = '/images/';
export const IMAGE_SUPPORTED_FORMATS = {
  "image/bmp": "bmp",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp"
};
export function $getImageName(type: string) {
  return `${IMAGES_PATH}scribe-space-id-image-${crypto.randomUUID()}${(new Date().toJSON())}.${IMAGE_SUPPORTED_FORMATS[type as keyof typeof IMAGE_SUPPORTED_FORMATS]}`;
}


