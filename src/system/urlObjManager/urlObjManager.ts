import { WebWorkerManager } from "@/interfaces/webWorker";
import { UrlObjManagerThreadInterface } from "./worker";
import { UrlObjManagerInterface, UrlObjManagerThreadInterfaceType } from "./workerShared";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UrlObjManager extends UrlObjManagerInterface {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UrlObjManager extends WebWorkerManager<UrlObjManagerThreadInterfaceType> {
    constructor() {
        super(new URL('./worker.ts', import.meta.url), UrlObjManagerThreadInterface);
    }
}