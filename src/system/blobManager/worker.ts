import { WebWorkerThread } from "@/interfaces/webWorker/webWorkerThread";

export const BlobManagerThreadInterface = {
    blobToUrlObj(test: string) {
        return test + 'abc';
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
const blobManagerThread = new WebWorkerThread(BlobManagerThreadInterface);
