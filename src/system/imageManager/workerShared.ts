import { WebWorkerManagerInterface } from "@/interfaces/webWorker";
import { ImageManagerWorkerImplementation, ImageManagerWorkerPublic } from "./imageManagerWorker";

export type ImageManagerWorkerFunctions = typeof ImageManagerWorkerPublic;
export type ImageManagerWorkerFunctionsExtended = typeof ImageManagerWorkerImplementation;
export type ImageManagerWorkerWrapper = WebWorkerManagerInterface<ImageManagerWorkerFunctions>;
export { ImageManagerWorkerImplementation };

