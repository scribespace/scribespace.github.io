import { WebWorkerManager } from "@/interfaces/webWorker";

import workerURL from "./imageManagerWorker?worker&url";
import { ImageManagerWorkerImplementation, ImageManagerWorkerInterface, ImageManagerWorkerWrapper } from "./workerShared";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface ImageManager extends ImageManagerWorkerWrapper {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class ImageManager extends WebWorkerManager<ImageManagerWorkerInterface> {
  constructor() {
    super(workerURL, ImageManagerWorkerImplementation);
  }
}
