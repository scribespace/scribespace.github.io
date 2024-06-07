import { Authenticate } from "./authInterface";
import { FileSystem } from "./fileSystem/fileSystemInterface";

export interface System {
  getID(): string;
  getAuth(): Authenticate;
  getFileSystem(): FileSystem;
  getSystemDomain(): string;
}
