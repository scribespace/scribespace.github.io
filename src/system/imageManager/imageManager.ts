import { WebWorkerManager } from "@/interfaces/webWorker";

import { ImageManagerWorkerPublic } from "./imageManagerWorker";
import workerURL from "./imageManagerWorker?worker&url";
import { ImageManagerWorkerFunctions, ImageManagerWorkerFunctionsExtended, ImageManagerWorkerWrapper } from "./workerShared";
import { notNullOrThrow } from "@/utils";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface ImageManager extends ImageManagerWorkerWrapper {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class ImageManager extends WebWorkerManager<ImageManagerWorkerFunctions, ImageManagerWorkerFunctionsExtended> {
  private __offscreenCanvas: OffscreenCanvas;

  constructor() {
    super(workerURL, ImageManagerWorkerPublic);
    this.__offscreenCanvas = new OffscreenCanvas(10, 10);    
  }

  private onImageLoad(img: HTMLImageElement) {
    const ctx = this.__offscreenCanvas.getContext("2d", {alpha: true});
    notNullOrThrow(ctx);

    this.__offscreenCanvas.width = img.naturalWidth;
    this.__offscreenCanvas.height = img.naturalHeight;
    
    ctx.drawImage(img, 0, 0);
    this.__offscreenCanvas.convertToBlob({type:'image/png'});

  }

  saveImageElement( img: HTMLImageElement ) {
    if ( img.complete ) {
      this.onImageLoad(img);
    } else {
      img.onload = () => this.onImageLoad(img);
    }
  }
}
export const IMAGES_PATH = '/images/';
export function $getImageName() {
  return 'scribe-space-id-image-' + crypto.randomUUID() + (new Date().toJSON());
}

