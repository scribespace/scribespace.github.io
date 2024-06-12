import fse from "fs-extra";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// Convert the module URL to a file path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name from the file path
const topDir = dirname(__filename);
const srcDir = path.join(topDir, "..", "..", "lexical", "packages");
const dstDir = path.join(topDir, "..", "libs", "lexical");
fse.emptyDirSync(dstDir);

const excludeList = [
  "lexical-devtools",
  "lexical-playground",
  "lexical-website",
  "shared",
];

fse.readdir(srcDir, { withFileTypes: true }, (err, entries) => {
  if (err) {
    console.error("Error reading directory", err);
    return;
  }

  entries.forEach((entry) => {
    if (entry.isDirectory() && !excludeList.includes(entry.name)) {
      const srcPackagePath = path.join(srcDir, entry.name, "npm");
      const dstPackagePath = path.join(dstDir, entry.name);

      console.log(`Copying: ${entry.name}`);
      fse.copy(srcPackagePath, dstPackagePath, { overwrite: true }).then(() => {
        console.log(`${entry.name} copied!`);
      });
    }
  });
});
