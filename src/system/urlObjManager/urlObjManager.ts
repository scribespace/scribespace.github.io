import { WebWorkerManager } from "@/interfaces/webWorker";
import { UrlObjManagerThreadInterface } from "./worker";
import { UrlObjManagerInterface, UrlObjManagerThreadInterfaceType } from "./workerShared";

import workerURL from './worker?worker&url';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UrlObjManager extends UrlObjManagerInterface {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UrlObjManager extends WebWorkerManager<UrlObjManagerThreadInterfaceType> {
    constructor() {
        super(workerURL, UrlObjManagerThreadInterface);
    }
}