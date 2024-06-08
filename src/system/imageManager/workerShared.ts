import { WebWorkerManagerInterface } from "@/interfaces/webWorker";
import { ImageManagerWorkerImplementation } from "./imageManagerWorker";

export type ImageManagerWorkerFunctions = typeof ImageManagerWorkerImplementation;
export type ImageManagerWorkerWrapper = WebWorkerManagerInterface<ImageManagerWorkerFunctions>;
export { ImageManagerWorkerImplementation };

