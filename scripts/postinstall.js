import fse from "fs-extra";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// Convert the module URL to a file path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name from the file path
const topDir = dirname(__filename);

fse.emptyDirSync(path.join(topDir, "public", "tinymce"));
fse.copySync(
  path.join(topDir, "node_modules", "tinymce"),
  path.join(topDir, "public", "tinymce"),
  { overwrite: true }
);
