import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $callCommand, $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { notesManager } from "@systems/notesManager";
import { useEffect } from "react";
import { CLEAR_HISTORY_CMD } from "../commandsPlugin/editorCommands";
import { NOTES_LOAD_CMD } from "@systems/notesManager/notesCommands";

export function NoteLoaderPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(
        () => {
          return $registerCommandListener(NOTES_LOAD_CMD,
            (notePath) => {
                editor.setEditable(false);
                notesManager.loadNote(notePath)
                .then((noteObject) => {
                    editor.update(
                        () => {
                          const editorState = editor.parseEditorState(noteObject.data);
                          editor.setEditorState(editorState);
                          editor.setEditable(true);
                          $callCommand(CLEAR_HISTORY_CMD, undefined);
                        }
                    );
                });
            }
          );
        },
        [editor]
    );

    return null;
}
