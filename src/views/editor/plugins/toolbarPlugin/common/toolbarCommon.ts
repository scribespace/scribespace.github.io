import { LexicalEditor } from "lexical";
import { TOOLBAR_CLOSE_MENU_COMMAND } from "./toolbarCommands";

export function $closeToolbarMenu(editor: LexicalEditor) {
    editor.dispatchCommand( TOOLBAR_CLOSE_MENU_COMMAND, undefined );
}