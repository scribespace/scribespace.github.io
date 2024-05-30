import { System } from "../interfaces/system/system_interface";
import { UrlObjManager } from "./urlObjManager";

class AppGlobals {
    system: null | System = null; 
    urlObjManager: UrlObjManager = new UrlObjManager();
}

export const appGlobals = new AppGlobals();