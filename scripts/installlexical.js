import fse from "fs-extra";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// Convert the module URL to a file path

// Get the directory name from the file path
const __filename = fileURLToPath(import.meta.url);
const topDir = dirname(__filename);
const packagesDir = path.join(topDir,"..", "libs", "lexical");

import * as child_process from "child_process";

const devList = [
  "lexical-devtools-core",
];

fse.readdir(packagesDir, { withFileTypes: true }, (err, entries) => {
  if (err) {
    console.error("Error reading directory", err);
    return;
  }

  entries.forEach((entry) => {
    if (entry.isDirectory()) {
      const packagePath = path.join(packagesDir, entry.name);
      const isDev = devList.includes(entry.name);

      console.log(`Installing package: ${packagePath}`);
      child_process.execSync(`npm install ${isDev ? '--save-dev' : '--save'} ${packagePath}`, {
        stdio: [0, 1, 2],
      });
    }
  });
});
