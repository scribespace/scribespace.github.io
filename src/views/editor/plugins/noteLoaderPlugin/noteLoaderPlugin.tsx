import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $callCommand, $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { $getNotesManager } from "@systems/notesManager";
import { NOTES_LOAD_CMD } from "@systems/notesManager/notesCommands";
import { variableExists } from "@utils";
import { useEffect, useRef, useState } from "react";
import { CLEAR_HISTORY_CMD } from "../commandsPlugin/editorCommands";

export function NoteLoaderPlugin() {
    const [editor] = useLexicalComposerContext();
    const [noteInfo, setNoteInfo] = useState<{loadVersion: number, noteID: string}>({loadVersion:-1, noteID:''});
    const loadPromiseRef = useRef<Promise<void>>(Promise.resolve());
    const loadVersionRef = useRef<number>(0);

    useEffect(
        () => {
            if ( noteInfo.noteID === '' ) 
                return;

            if ( noteInfo.loadVersion != loadVersionRef.current )
                return;

            loadPromiseRef.current = loadPromiseRef.current.then( async () => {
                const noteObject = await $getNotesManager().loadNote(noteInfo.noteID);
                const editorState = editor.parseEditorState(noteObject.data);
                editor.setEditorState(editorState);
                editor.setEditable(true);
                $callCommand(CLEAR_HISTORY_CMD, undefined);
            } );
        },
        [editor, noteInfo]
    );

    useEffect(
        () => {
            return mergeRegister( 
                $registerCommandListener(
                    NOTES_LOAD_CMD,
                    async (notePath) => {
                        loadPromiseRef.current = loadPromiseRef.current.then( () => {
                            editor.setEditable(false);
                            setNoteInfo( {loadVersion: ++loadVersionRef.current, noteID: notePath});
                        });
                    }
                ),
                editor.registerUpdateListener(
                    (args) => {
                        if ( noteInfo.noteID === '' || (args.dirtyElements.size + args.dirtyLeaves.size) === 0 || (args.dirtyLeaves.size === 0 && args.dirtyElements.size === 1 && variableExists( args.dirtyElements.get('root') ) ) )
                            return;
                        
                            $getNotesManager().storeNote(noteInfo.noteID,JSON.stringify( args.editorState )).then(()=>{
                            console.log(`Save: ${noteInfo.noteID} tags: ${Array.from(args.tags)}` );
                        });
                    }
                )
            );
        },
        [editor, noteInfo.noteID]
    );

    return null;
}
