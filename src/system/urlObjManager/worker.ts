import { WebWorkerThread } from "@/interfaces/webWorker/webWorkerThread";

export const UrlObjManagerThreadInterface = {
    blobToUrlObj(blob: Blob): [urlObj: string] {
        if ( blob ) {
            return [URL.createObjectURL(blob)];
        }

        throw Error("No File provided");
    },

    urlToUrlObj(test: string, test2: number) {
        return new Promise<[string, number]>(
            (resolve) => {
                setTimeout(() => resolve([`${test}${test2}`,test2*2]), 2000);
            }
        );
    },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const urlObjManagerThread = new WebWorkerThread(UrlObjManagerThreadInterface);
