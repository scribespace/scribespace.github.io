import { WebWorkerManager } from "@/interfaces/webWorker";

import workerURL from "./imageManagerWorker?worker&url";
import { ImageManagerWorkerImplementation, ImageManagerWorkerFunctions, ImageManagerWorkerWrapper } from "./workerShared";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface ImageManager extends ImageManagerWorkerWrapper {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class ImageManager extends WebWorkerManager<ImageManagerWorkerFunctions> {
  constructor() {
    super(workerURL, ImageManagerWorkerImplementation);
  }
}
