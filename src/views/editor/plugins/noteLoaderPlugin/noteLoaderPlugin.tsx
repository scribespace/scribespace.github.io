import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $callCommand, $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { notesManager } from "@systems/notesManager";
import { NOTES_LOAD_CMD } from "@systems/notesManager/notesCommands";
import { useEffect } from "react";
import { CLEAR_HISTORY_CMD } from "../commandsPlugin/editorCommands";

export function NoteLoaderPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(
        () => {
            return mergeRegister( 
                $registerCommandListener(
                    NOTES_LOAD_CMD,
                    (notePath) => {
                        editor.setEditable(false);
                        notesManager.loadNote(notePath)
                        .then((noteObject) => {
                            const editorState = editor.parseEditorState(noteObject.data);
                            editor.setEditorState(editorState);
                            editor.setEditable(true);
                            $callCommand(CLEAR_HISTORY_CMD, undefined);
                        });
                    }
                ),
            );
        },
        [editor]
    );

    return null;
}
