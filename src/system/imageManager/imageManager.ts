import { WebWorkerManager } from "@/interfaces/webWorker";

import { File, FileUploadMode, InfoResult } from "@/interfaces/system/fileSystem/fileSystemShared";
import { notNullOrThrowDev, variableExistsOrThrowDev } from "@/utils";
import { ImageManagerWorkerPublic } from "./imageManagerWorker";
import workerURL from "./imageManagerWorker?worker&url";
import { ImageManagerWorkerFunctions, ImageManagerWorkerFunctionsExtended, ImageManagerWorkerWrapper } from "./workerShared";
import { $getFileSystem } from "@coreSystems";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface ImageManager extends ImageManagerWorkerWrapper {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class ImageManager extends WebWorkerManager<ImageManagerWorkerFunctions, ImageManagerWorkerFunctionsExtended> {
  constructor() {
    super(workerURL, ImageManagerWorkerPublic);
  }

  imageUpload(file: File): Promise<string> {
    notNullOrThrowDev(file.content);
    return $getFileSystem()
    .uploadFileAsync($getImageName(file.content.type), file, FileUploadMode.Add)
    .then(
      (result: InfoResult) => {
        variableExistsOrThrowDev( result.fileInfo, "Missing fileInfo" );
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


