import { WebWorkerManagerInterface } from "@/interfaces/webWorker";
import { ImageManagerWorkerImplementation } from "./imageManagerWorker";

export type ImageManagerWorkerInterface = typeof ImageManagerWorkerImplementation;
export type ImageManagerWorkerWrapper = WebWorkerManagerInterface<ImageManagerWorkerInterface>;
export { ImageManagerWorkerImplementation };

