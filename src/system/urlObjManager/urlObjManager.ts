import { WebWorkerManager } from "@/interfaces/webWorker";
import { UrlObjManagerWorkerInterface } from "./urlObjManagerWorker";
import { UrlObjManagerInterface, UrlObjManagerWorkerInterfaceType } from "./workerShared";

import workerURL from './urlObjManagerWorker?worker&url';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UrlObjManager extends UrlObjManagerInterface {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UrlObjManager extends WebWorkerManager<UrlObjManagerWorkerInterfaceType> {
    constructor() {
        super(workerURL, UrlObjManagerWorkerInterface);
    }
}