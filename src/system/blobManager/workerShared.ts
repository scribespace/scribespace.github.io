import { WebWorkerManagerInterface } from "@/interfaces/webWorker/webWorkerShared";
import { BlobManagerThreadInterface } from "./worker";

type BlobManagerThreadInterfaceType = typeof BlobManagerThreadInterface;
type BlobManagerInterface = WebWorkerManagerInterface<BlobManagerThreadInterfaceType>;

export { BlobManagerThreadInterface };
export type { BlobManagerInterface, BlobManagerThreadInterfaceType };
