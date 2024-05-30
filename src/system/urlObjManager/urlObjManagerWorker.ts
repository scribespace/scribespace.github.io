import { WebWorkerThread } from "@/interfaces/webWorker/webWorkerThread";

export const UrlObjManagerWorkerInterface = {
    blobToUrlObj(blob: Blob): [urlObj: string] {
        if ( blob ) {
            return [URL.createObjectURL(blob)];
        }

        throw Error("No File provided");
    },
};
new WebWorkerThread(UrlObjManagerWorkerInterface);
