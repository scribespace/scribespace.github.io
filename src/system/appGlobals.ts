import { System } from "../interfaces/system/system_interface";
import { ImageManager } from "./imageManager";

class AppGlobals {
    system: null | System = null; 
    imageManager: ImageManager = new ImageManager();
}

export const appGlobals = new AppGlobals();