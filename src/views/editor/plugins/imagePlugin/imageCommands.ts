import { $createEditorCommand } from "../commandsPlugin/editorCommandManager";

export const INSERT_IMAGES_CMD = $createEditorCommand<File[]>("INSERT_IMAGES_CMD");
