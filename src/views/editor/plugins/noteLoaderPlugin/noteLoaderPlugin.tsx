import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $callCommand, $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { $getNotesManager } from "@systems/notesManager";
import { NOTES_LOAD_CMD, NOTE_CONVERTED_CMD } from "@systems/notesManager/notesCommands";
import { BLOCK_EDITING_CMD } from "@systems/systemCommands";
import { TREE_PROCESS_START_NOTE_CMD } from "@systems/treeManager";
import { bundleFunctions, variableExists } from "@utils";
import { EditorState } from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { CLEAR_HISTORY_CMD } from "../commandsPlugin/editorCommands";
import { INFOBAR_SUBMIT_INFO_CMD } from "../infobarPlugin/infoCommands";

export function NoteLoaderPlugin() {
    const [editor] = useLexicalComposerContext();
    const [noteInfo, setNoteInfo] = useState<{loadVersion: number, noteID: string}>({loadVersion:-1, noteID:''});
    const currentNoteRef = useRef<string>('');
    const loadPromiseRef = useRef<Promise<void>>(Promise.resolve());
    const loadVersionRef = useRef<number>(0);
    const savesRequestedRef = useRef<number>(0);
    const savesDoneRef = useRef<number>(0);
    const lastSaveDateRef = useRef<string>('--:--:--');
    const noteConverted = useRef<boolean>( false );
    const pageLoadedRef = useRef<boolean>( false );

    const updateSaveData = useCallback(
        () => {
            const time = new Date();
            lastSaveDateRef.current = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
        },
        []
    );

    const getSaveString = useCallback(
        () => {
            return `Save: ${savesDoneRef.current}/${savesRequestedRef.current} Time: ${lastSaveDateRef.current}`;
        },
        []
    );

    const saveNote = useCallback(
        (editorState: EditorState) => {
            ++savesRequestedRef.current;
            const currentSave = savesRequestedRef.current;
            $callCommand( INFOBAR_SUBMIT_INFO_CMD, getSaveString());
            $getNotesManager().storeNote(noteInfo.noteID,JSON.stringify( editorState )).then(()=>{
                if ( savesDoneRef.current < currentSave ) {
                    savesDoneRef.current = currentSave;
                    updateSaveData();
                    $callCommand( INFOBAR_SUBMIT_INFO_CMD, getSaveString());
                }
        });
        },
        [getSaveString, noteInfo.noteID, updateSaveData]
    );

    useEffect(
        () => {
            if ( noteInfo.noteID === '' ) 
                return;

            if ( noteInfo.loadVersion != loadVersionRef.current )
                return;

            loadPromiseRef.current = loadPromiseRef.current.then( async () => {
                currentNoteRef.current = noteInfo.noteID;

                const noteObject = await $getNotesManager().loadNote(noteInfo.noteID);
                const editorState = editor.parseEditorState(noteObject.data);
                editor.setEditorState(editorState);
                editor.setEditable(true);
                $callCommand(CLEAR_HISTORY_CMD, undefined);
                
                if ( noteConverted.current ) {
                    noteConverted.current = false;

                    saveNote(editor.getEditorState());
                }
            } );
        },
        [editor, noteInfo, saveNote]
    );

    useEffect(
        () => {
            return bundleFunctions( 
                $registerCommandListener(
                    NOTES_LOAD_CMD,
                    async (noteLoadPayload) => {
                        if ( currentNoteRef.current === noteLoadPayload.id && !noteLoadPayload.force ) {
                            return;
                        }

                        loadPromiseRef.current = loadPromiseRef.current.then( () => {
                            editor.setEditable(false);
                            setNoteInfo( {loadVersion: ++loadVersionRef.current, noteID: noteLoadPayload.id});
                        });
                    }
                ),
                $registerCommandListener(
                    NOTE_CONVERTED_CMD,
                    () => {
                        noteConverted.current = true;
                    }
                ),
                $registerCommandListener(
                    BLOCK_EDITING_CMD,
                    () => {
                        editor.setEditable(false);
                    }
                ),
                editor.registerUpdateListener(
                    (args) => {
                        if ( noteInfo.noteID === '' || (args.dirtyElements.size + args.dirtyLeaves.size) === 0 || (args.dirtyLeaves.size === 0 && args.dirtyElements.size === 1 && variableExists( args.dirtyElements.get('root') ) ) )
                            return;
                        
                            saveNote(args.editorState);
                    }
                )
            );
        },
        [editor, getSaveString, noteInfo.noteID, saveNote, updateSaveData]
    );

    useEffect(
        () => {
            if ( !pageLoadedRef.current ) {
                $callCommand(TREE_PROCESS_START_NOTE_CMD, undefined);
                pageLoadedRef.current = true;
            }
        },
        []
    );

    return null;
}
