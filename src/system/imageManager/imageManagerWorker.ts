import { WebWorkerThread } from "@/interfaces/webWorker";

export const ImageManagerWorkerImplementation = {
  blobsToUrlObjs(blobs: Blob[]): [urlObjs: string[]] {
    const urlObjs: string[] = [];

    for (const blob of blobs) {
      urlObjs.push(URL.createObjectURL(blob));
    }

    return [urlObjs];
  },
};
new WebWorkerThread(ImageManagerWorkerImplementation);
