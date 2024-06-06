import { WebWorkerManagerInterface } from "@/interfaces/webWorker";
import { ImageManagerWorkerInterface } from "./imageManagerWorker";

type ImageManagerWorkerInterfaceType = typeof ImageManagerWorkerInterface;
type ImageManagerInterface =
  WebWorkerManagerInterface<ImageManagerWorkerInterfaceType>;

export { ImageManagerWorkerInterface };
export type { ImageManagerInterface, ImageManagerWorkerInterfaceType };
