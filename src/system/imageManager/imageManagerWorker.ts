import { WebWorkerThread } from "@/interfaces/webWorker";

export const ImageManagerWorkerPublic = {
  blobsToUrlObjs(blobs: Blob[]): [urlObjs: string[]] {
    const urlObjs: string[] = [];

    for (const blob of blobs) {
      urlObjs.push(URL.createObjectURL(blob));
    }

    return [urlObjs];
  },
  
};

export const ImageManagerWorkerImplementation = {
  ...ImageManagerWorkerPublic,
};
new WebWorkerThread(ImageManagerWorkerImplementation);
