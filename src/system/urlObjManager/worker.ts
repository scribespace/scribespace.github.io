import { WebWorkerThread } from "@/interfaces/webWorker/webWorkerThread";

export const UrlObjManagerThreadInterface = {
    blobToUrlObj(blob: Blob): [urlObj: string] {
        if ( blob ) {
            return [URL.createObjectURL(blob)];
        }

        throw Error("No File provided");
    },
};
new WebWorkerThread(UrlObjManagerThreadInterface);
