import { WebWorkerThread } from "@/interfaces/webWorker";

export const ImageManagerWorkerPublic = {
  blobsToUrlObjs(blobs: Blob[]): [urlObjs: string[]] {
    const urlObjs: string[] = [];
    for (const blob of blobs) {
      urlObjs.push(URL.createObjectURL(blob));
    }

    return [urlObjs]; 
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
