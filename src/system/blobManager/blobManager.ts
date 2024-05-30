import { WebWorkerManager } from "@/interfaces/webWorker";
import { BlobManagerThreadInterface } from "./worker";
import { BlobManagerInterface, BlobManagerThreadInterfaceType } from "./workerShared";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface BlobManager extends BlobManagerInterface {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class BlobManager extends WebWorkerManager<BlobManagerThreadInterfaceType> {
    constructor() {
        super(new URL('./worker.ts', import.meta.url), BlobManagerThreadInterface);
    }
}