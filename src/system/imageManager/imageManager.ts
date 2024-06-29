import { WebWorkerManager } from "@/interfaces/webWorker";

import { FileSystemStatus, FileUploadMode } from "@/interfaces/system/fileSystem/fileSystemShared";
import { assert, variableExists, variableExistsOrThrow } from "@/utils";
import { $getFileSystem } from "@coreSystems";
import { $getStreamManager } from "@systems/streamManager/streamManager";
import { IMAGES_PATH, IMAGE_SUPPORTED_FORMATS, LOADING_IMAGE } from "./imageConstants";
import { ImageManagerWorkerPublic } from "./imageManagerWorker";
import workerURL from "./imageManagerWorker?worker&url";
import { ImageManagerWorkerFunctions, ImageManagerWorkerFunctionsExtended, ImageManagerWorkerWrapper } from "./workerShared";

export enum ImageState {
  Unknown = 0,
  Uploading = 1 << 0,
  BlobURL = 1 << 1,
  Preloading = 1 << 2,
  Completed = 1 << 3,
}


export interface ImageObject {
  state: ImageState;
  src: string;

  fileUrl: string;
  filePath: string;
}
export type ImageObjectListener = (imageObject: ImageObject, oldState: ImageState) => void;

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface ImageManager extends ImageManagerWorkerWrapper {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class ImageManager extends WebWorkerManager<ImageManagerWorkerFunctions, ImageManagerWorkerFunctionsExtended> {
  __imageSrcToID: Map<string, number> = new Map();
  __imageObjects: ImageObject[] = [];
  __imageListeners: Set<ImageObjectListener>[] = [];

  constructor() {
    super(workerURL, ImageManagerWorkerPublic);
  }

  private addImageObject( imageObject: ImageObject ): number {
    const imageID = this.__imageObjects.length;
    this.__imageObjects.push(imageObject);
    this.__imageListeners.push(new Set());

    return imageID;
  }

  private updateImageObject( imageID: number, state?: ImageState, src?: string, fileUrl?: string, filePath?: string ) {
    const imageObject = this.__imageObjects[imageID];
    const oldState = imageObject.state;
    
    if ( variableExists(src) ) {
      imageObject.src = src;
    }

    if ( variableExists(fileUrl) ) {
      imageObject.fileUrl = fileUrl;
    }

    if ( variableExists(filePath) ) {
      imageObject.filePath = filePath;
    }

    if ( variableExists(state) ) {
      imageObject.state = state;
    }

    const listeners = this.__imageListeners[imageID];
    for ( const callback of listeners ) {
      callback( imageObject, oldState );
    }
  }

  private async imageProcessPreload( imageID: number ) {
    const imageObject = this.__imageObjects[imageID];
    imageObject.state = imageObject.state | ImageState.Preloading;
    await this.preloadImage(imageObject.fileUrl);
    
    this.updateImageObject( imageID, ImageState.Completed, imageObject.fileUrl );
  }
  
  private async imageProcessUpload(imageBlob: Blob, imageID: number) {
    const imageName = $getImageName(imageBlob.type);
    const uploadResult = await $getStreamManager().uploadFile(imageName, imageBlob, FileUploadMode.Add);
    assert( uploadResult.status === FileSystemStatus.Success, "Missing fileInfo" );
    
    const finalURL = await $getFileSystem().getFileURLAsync(uploadResult.fileInfo.id);
    this.__imageSrcToID.set(finalURL, imageID);
    
    const imageObject = this.__imageObjects[imageID];
    const newState = (imageObject.state & (~ImageState.Uploading)) | ImageState.Preloading;
    this.updateImageObject( imageID, newState, undefined, finalURL, uploadResult.fileInfo.path );
    
    this.imageProcessPreload(imageID);
  }

  private async imageBlobURL( imageBlob: Blob, imageID: number ) {
    const blobURL = await this.blobToUrlObj(imageBlob);
    this.__imageSrcToID.set(blobURL, imageID);

    const imageObject = this.__imageObjects[imageID];
    if ( (imageObject.state & ImageState.Uploading) === ImageState.Uploading ) {
      this.updateImageObject( imageID, imageObject.state | ImageState.BlobURL, blobURL );
    }
  }

  imagePreload( src: string ): number {
    let imageID = this.__imageSrcToID.get(src);
    if ( !variableExists(imageID) ) {
      imageID = this.addImageObject( {state: ImageState.Unknown, src: LOADING_IMAGE, fileUrl:src, filePath:'' } );
      this.__imageSrcToID.set(src, imageID);
    }
    variableExistsOrThrow(imageID, `Couldn't find image`);

    const imageObject = this.__imageObjects[imageID];
    if ( (imageObject.state & (ImageState.Completed | ImageState.Preloading)) === 0  ) {
      this.imageProcessPreload(imageID);
    }

    return imageID;
  }

  imageUpload(imageBlob: Blob): number {
    const imageObject: ImageObject = {state: ImageState.Uploading, src: LOADING_IMAGE, fileUrl:'', filePath: ''};
    const imageID = this.addImageObject( imageObject );

    this.imageBlobURL(imageBlob, imageID);
    this.imageProcessUpload(imageBlob, imageID);

    return imageID;    
  }

  registerListener(imageID: number, callback: ImageObjectListener) {
    const listeners = this.__imageListeners[imageID];
    variableExistsOrThrow(listeners, 'Missing Image Object');

    listeners.add(callback);
    this.updateImageObject( imageID );

    return () => {
      listeners.delete(callback);
    };
  }
}
const imageManager = new ImageManager();

export function $getImageManager(): ImageManager {
  return imageManager;
}

export function $getImageName(type: string) {
  return `${IMAGES_PATH}scribe-space-id-image-${crypto.randomUUID()}${(new Date().toJSON())}.${IMAGE_SUPPORTED_FORMATS[type as keyof typeof IMAGE_SUPPORTED_FORMATS]}`;
}


