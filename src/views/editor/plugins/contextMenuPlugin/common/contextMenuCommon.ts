import { LexicalEditor } from "lexical";
import { CONTEXT_MENU_CLOSE_MENU_COMMAND } from "./contextMenuCommands";

export function $closeContextMenu(editor: LexicalEditor) {
  editor.dispatchCommand(CONTEXT_MENU_CLOSE_MENU_COMMAND, undefined);
}
