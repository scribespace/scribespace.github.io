import { WebWorkerManager } from "@/interfaces/webWorker";
import { ImageManagerWorkerInterface } from "./imageManagerWorker";
import {
  ImageManagerInterface,
  ImageManagerWorkerInterfaceType,
} from "./workerShared";

import workerURL from "./imageManagerWorker?worker&url";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface ImageManager extends ImageManagerInterface {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class ImageManager extends WebWorkerManager<ImageManagerWorkerInterfaceType> {
  constructor() {
    super(workerURL, ImageManagerWorkerInterface);
  }
}
