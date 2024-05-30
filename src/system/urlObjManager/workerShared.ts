import { WebWorkerManagerInterface } from "@/interfaces/webWorker/webWorkerShared";
import { UrlObjManagerWorkerInterface } from "./urlObjManagerWorker";

type UrlObjManagerWorkerInterfaceType = typeof UrlObjManagerWorkerInterface;
type UrlObjManagerInterface = WebWorkerManagerInterface<UrlObjManagerWorkerInterfaceType>;

export { UrlObjManagerWorkerInterface };
export type { UrlObjManagerInterface, UrlObjManagerWorkerInterfaceType };
