import { EditorObject } from "@/views/editor";
import { System } from "../interfaces/system/system_interface";
import { ImageManager } from "./imageManager";

class AppGlobals {
  system: null | System = null;
  imageManager: ImageManager = new ImageManager();

  editorObject: EditorObject | null = null;
}

export const appGlobals = new AppGlobals();
