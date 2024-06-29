import { WebWorkerThread } from "@/interfaces/webWorker";

export const ImageManagerWorkerPublic = {
  blobToUrlObj(blob: Blob): Promise<string> {
    return new Promise<string>(
      (resolve) => {
          resolve(URL.createObjectURL(blob)); 
      }
    );
  },
  async preloadImage(src: string): Promise<void> {
    // disable CORS, still can't load image to memoery but it ends up in cache
    const result = await fetch(src, {mode:"no-cors"}); 
    if ( result.status == 404 ) 
      throw Error(`Couldn't find ${src}`);
  }
};

export const ImageManagerWorkerImplementation = {
  ...ImageManagerWorkerPublic,
};
new WebWorkerThread(ImageManagerWorkerImplementation);
