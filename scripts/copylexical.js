import fse from "fs-extra";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// Convert the module URL to a file path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name from the file path
const topDir = dirname(__filename);
const srcDir = path.join(topDir, "..", "..", "lexical", "packages");
const dstDir = path.join(topDir, "..", "libs", "lexical");
const helpersDir = path.join(topDir, "..", "src", "views", "editor", "helpers");

fse.emptyDirSync(dstDir);
fse.emptyDirSync(helpersDir);

const excludeList = [
  "lexical-dragon",
  "lexical-devtools",
  "lexical-playground",
  "lexical-website",
  "shared",
];

const helperFiles = [
  {
    src:"lexical-react",
    targets:
    [
      {
        path: path.join("src", "shared"), 
        file: "useDecorators.tsx"
      }
    ]
  },
  {
    src:"shared",
    targets:
    [
      {
        path: path.join("src"), 
        file: "useLayoutEffect.ts"
      },
      {
        path: path.join("src"), 
        file: "canUseDOM.ts"
      }
    ]
  }
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

for ( const helperSrc of helperFiles ) {
  for ( const target of helperSrc.targets ) {
    const srcPath = path.join(srcDir, helperSrc.src, target.path, target.file );
    const dstPath = path.join(helpersDir, target.file );
    console.log(`Copying: ${target.file}`);
    fse.copy(srcPath, dstPath, { overwrite: true }).then(() => {
      console.log(`${target.file} copied!`);
    });
  }
}