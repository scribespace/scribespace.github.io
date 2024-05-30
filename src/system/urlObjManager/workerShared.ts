import { WebWorkerManagerInterface } from "@/interfaces/webWorker/webWorkerShared";
import { UrlObjManagerThreadInterface } from "./worker";

type UrlObjManagerThreadInterfaceType = typeof UrlObjManagerThreadInterface;
type UrlObjManagerInterface = WebWorkerManagerInterface<UrlObjManagerThreadInterfaceType>;

export { UrlObjManagerThreadInterface };
export type { UrlObjManagerInterface, UrlObjManagerThreadInterfaceType };
