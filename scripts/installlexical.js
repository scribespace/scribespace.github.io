import fse from "fs-extra";
import path from "path";
// Convert the module URL to a file path

// Get the directory name from the file path
const packagesDir = path.join("libs", "lexical");

import * as child_process from "child_process";

fse.readdir(packagesDir, { withFileTypes: true }, (err, entries) => {
  if (err) {
    console.error("Error reading directory", err);
    return;
  }

  entries.forEach((entry) => {
    if (entry.isDirectory()) {
      const packagePath = path.join(packagesDir, entry.name);

      console.log(`Installing package: ${packagePath}`);
      child_process.execSync(`npm install ${packagePath}`, {
        stdio: [0, 1, 2],
      });
    }
  });
});
