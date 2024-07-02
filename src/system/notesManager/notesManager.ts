import { $getFileSystem } from "@coreSystems";
import { FileSystemStatus, FileUploadMode } from "@interfaces/system/fileSystem/fileSystemShared";
import { $callCommand } from "@systems/commandsManager/commandsManager";
import { editorGetEmptyNote } from "@systems/editorManager";
import { $getFileManager } from "@systems/fileManager/fileManager";
import { assert } from "@utils";
import { NOTES_CONVERTING_CMD, NOTES_CREATING_META_CMD, NOTES_FINISH_CONVERTING_CMD } from "./notesCommands";
import { NoteObject, noteConvertToV0 } from "./notesVersions";

export const NOTES_VERSION = 0 as const;
export const NOTES_PATH = "/notes/";
const NOTES_META_PATH = "/notes_meta";

interface NotesMetaObject {
    version: number;
    notes: Map<string, string>
}

interface NotesMetaObjectSereialized {
    version: number;
    notes: [string, string][];
}


class NotesManager {
    private __metaObject: NotesMetaObject = {version: -1, notes: new Map()};

    private async uploadNoteObject(path: string, noteObject: NoteObject, uploadMode: FileUploadMode ) {
        const fileData = JSON.stringify(noteObject);
        const infoResult = await $getFileManager().uploadFile(path, new Blob([fileData]), uploadMode);
        assert( infoResult.status === FileSystemStatus.Success, `Note Object didnt' upload` );

        return infoResult;
    }

    async storeNoteObject( path: string, noteObject: NoteObject ) {
        return this.uploadNoteObject(path, noteObject, FileUploadMode.Replace);
    }

    async storeNote( path: string, note: string ) {
        return this.storeNoteObject( path, { version: NOTES_VERSION, data: note } );
    }

    async createNote() {
        const fileName = "scribe-space-id-" + crypto.randomUUID() + (new Date().getTime());
        const emptyNote = await editorGetEmptyNote();
        
        const infoResult = await this.uploadNoteObject( NOTES_PATH + fileName, {version: NOTES_VERSION, data: emptyNote}, FileUploadMode.Add );
        if (infoResult.status === FileSystemStatus.Success) {
            this.__metaObject.notes.set(infoResult.fileInfo!.id, infoResult.fileInfo!.path);
            this.storeMetaFile();
        }

        return infoResult;
    }

    async loadNote( notePath: string ): Promise<NoteObject> {
        const downloadResult = await $getFileManager().downloadFile(notePath);
        assert(downloadResult.status === FileSystemStatus.Success, 'Note couldnt be downloaded');
        const content = await downloadResult.file!.content!.text();
        let noteObject: NoteObject;
        try {
            noteObject = JSON.parse( content ) as NoteObject;
        } catch {
            const convertedNoteObject = await noteConvertToV0(content);
            await this.storeNoteObject(notePath, convertedNoteObject);
            return convertedNoteObject;
        }
        return noteObject;
    }

    private async loadMetaFile() {
        const downloadResults = await $getFileManager().downloadFile(NOTES_META_PATH);
        
        if ( downloadResults.status === FileSystemStatus.Success ) {
            const metaObjectJSON = await downloadResults.file!.content!.text();
            const metaObjectSerialized = JSON.parse(metaObjectJSON) as NotesMetaObjectSereialized;

            assert( metaObjectSerialized.version === NOTES_VERSION, 'Meta on server doesnt match version' );

            this.__metaObject = {version: metaObjectSerialized.version, notes: new Map()};
            for ( const note of metaObjectSerialized.notes ) {
                this.__metaObject.notes.set(note[0], note[1]);
            }

            return;
        }

        $callCommand( NOTES_CREATING_META_CMD, undefined );
        const metaObject: NotesMetaObject = { version: -1 /* We need to convert notes */, notes: new Map()};

        await $getFileSystem().getFileList( NOTES_PATH, 
            async (notesList) => {
                for ( const noteFile of notesList ) {
                    metaObject.notes.set( noteFile.id, noteFile.path );
                }
            },
         );

         this.__metaObject = metaObject;
    }

    private async storeMetaFile() {
        const metaSerialized: NotesMetaObjectSereialized = {
            version: this.__metaObject.version,
            notes: Array.from(this.__metaObject.notes)
        };
        const metaJSON = JSON.stringify(metaSerialized);
        const fileInfo = await $getFileManager().uploadFile(NOTES_META_PATH, new Blob([metaJSON]), FileUploadMode.Replace);
        assert(fileInfo.status === FileSystemStatus.Success, `Meta Data didn't upload`);

        return fileInfo.fileInfo;
    }

    private async processNotes() {
        let i = 1;
        const max = this.__metaObject.notes.size;
        const promises: Promise<void>[] = [];
        for ( const [noteID,] of this.__metaObject.notes ) {
            promises.push(this.loadNote(noteID).then(()=> {
                $callCommand(NOTES_CONVERTING_CMD, {id: i++, max} );
            }));
        }

        await Promise.all(promises);
    }

    async initNotes() {
        await this.loadMetaFile();

        if ( this.__metaObject.version === -1 ) {
            await this.processNotes();

            this.__metaObject.version = NOTES_VERSION;
            await this.storeMetaFile();            
            $callCommand(NOTES_FINISH_CONVERTING_CMD, undefined);
        }
    }
}

const __notesManager = new NotesManager();
export function $getNotesManager() {
    return __notesManager;
}
