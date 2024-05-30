import { System } from "../interfaces/system/system_interface";
import { BlobManager } from "./blobManager";

class AppGlobals {
    system: null | System = null; 
    blobManager: BlobManager = new BlobManager();
}

export const appGlobals = new AppGlobals();