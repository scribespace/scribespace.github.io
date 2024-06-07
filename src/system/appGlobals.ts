import { notNullOrThrowDev } from "@/utils";
import { EditorObject } from "@/views/editor";
import { System } from "../interfaces/system/systemInterface";
import { ImageManager } from "./imageManager";

class AppGlobals {
  system: null | System = null;
  imageManager: ImageManager = new ImageManager();

  editorObject: EditorObject | null = null;
}
export const appGlobals = new AppGlobals();

export function $getSystem(): System {
  notNullOrThrowDev(appGlobals.system);
  return appGlobals.system;
}

export function $getAuth() {
  notNullOrThrowDev(appGlobals.system);
  return appGlobals.system.getAuth();
}

export function $getFileSystem() {
  notNullOrThrowDev(appGlobals.system);
  return appGlobals.system.getFileSystem();
}

export function $getImageManager(): ImageManager {
  return appGlobals.imageManager;
}

export function $getMainEditor(): EditorObject | null {
  return appGlobals.editorObject;
}
