import { WebWorkerThread } from "@/interfaces/webWorker";

export const ImageManagerWorkerInterface = {
  blobsToUrlObjs(blobs: Blob[]): [urlObjs: string[]] {
    const urlObjs: string[] = [];

    for (const blob of blobs) {
      urlObjs.push(URL.createObjectURL(blob));
    }

    return [urlObjs];
  },
  preloadImageUrl(url: string): void {
    new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.onload = (event: ProgressEvent) => {
        if (event.total == event.loaded) resolve();
      };
      xhr.onerror = reject;
      xhr.open("GET", url, true);
      xhr.send();
    });
  },
};
new WebWorkerThread(ImageManagerWorkerInterface);
