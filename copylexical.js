import fse from 'fs-extra';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
// Convert the module URL to a file path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name from the file path
const topDir = dirname(__filename);

fse.emptyDirSync(path.join(topDir, 'libs', 'lexical'));
fse.copySync(path.join(topDir, '..', 'lexical', 'packages'), path.join(topDir, 'libs', 'lexical'), { overwrite: true });