import { $getFileSystem } from "@coreSystems";
import { FileInfo, FileSystemStatus } from "@interfaces/system/fileSystem/fileSystemShared";
import { $callCommand } from "@systems/commandsManager/commandsManager";
import { editorGetEmptyNote } from "@systems/editorManager";
import { $getFileManager, FileHandle } from "@systems/fileManager/fileManager";
import { assert, variableExists } from "@utils";
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
    private __metaObjectHandle: FileHandle = {fileID: NOTES_META_PATH, version: -1};
    private __notesHandles: Map<string, FileHandle> = new Map();

    private async uploadNoteObject(path: string, noteObject: NoteObject ) {
        const fileData = new Blob([JSON.stringify(noteObject)]);

        const noteHandle = this.__notesHandles.get(path);
        let fileInfo: FileInfo;
        if ( !variableExists( noteHandle ) || noteHandle.version === -1 ) {
            assert( !$getFileSystem().isFileID(path), `Trying to create note that already exists!` );
            const result = await $getFileManager().createFile(path, fileData);
            assert( result.status === FileSystemStatus.Success, `Note Object didnt create` );
            assert( result.file.fileInfo.path === path, `Note of this name already existed. Probably used id and path separetally` );
            this.__notesHandles.set( result.file.fileInfo.id, result.handle );
            fileInfo = result.file.fileInfo;
        } else {
            const result = await $getFileManager().uploadFile( noteHandle, fileData );
            assert( result.status === FileSystemStatus.Success, `Note Object didnt upload` );
            fileInfo = result.fileInfo;
        }
        return fileInfo;
    }

    async storeNoteObject( path: string, noteObject: NoteObject ) {
        return this.uploadNoteObject(path, noteObject);
    }

    async storeNote( path: string, note: string ) {
        return this.storeNoteObject( path, { version: NOTES_VERSION, data: note } );
    }

    async createNote() {
        const fileName = "scribe-space-id-" + crypto.randomUUID() + (new Date().getTime());
        const emptyNote = await editorGetEmptyNote();
        
        const fileInfo = await this.uploadNoteObject( NOTES_PATH + fileName, {version: NOTES_VERSION, data: emptyNote} );
        this.__metaObject.notes.set(fileInfo.id, fileInfo.path);
        this.storeMetaFile();

        return fileInfo;
    }

    async loadNote( notePath: string ): Promise<NoteObject> {
        const downloadResult = await $getFileManager().downloadFile(notePath);
        assert(downloadResult.status === FileSystemStatus.Success, 'Note couldnt be downloaded');
        this.__notesHandles.set(notePath, downloadResult.handle);

        const content = await downloadResult.file.content.text();
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
        const downloadResults = await $getFileManager().downloadFile(this.__metaObjectHandle.fileID);
        
        if ( downloadResults.status === FileSystemStatus.Success ) {
            this.__metaObjectHandle = downloadResults.handle;
            const metaObjectJSON = await downloadResults.file.content.text();
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
        const metaBlob = new Blob([JSON.stringify(metaSerialized)]);
        let fileInfo: FileInfo;
        if ( this.__metaObjectHandle.version === -1 ) {
            const result = await $getFileManager().createFile( this.__metaObjectHandle.fileID, metaBlob );
            assert( result.status === FileSystemStatus.Success, `Couldn't create note's meta file` );
            assert( this.__metaObjectHandle.fileID === result.file.fileInfo.path, `Created note's meta when one is already on the server! ${result.file.fileInfo.path}` );
            this.__metaObjectHandle = result.handle;
            fileInfo = result.file.fileInfo;
        } else {
            const result = await $getFileManager().uploadFile(this.__metaObjectHandle, metaBlob);
            assert(result.status === FileSystemStatus.Success, `Meta Data didn't upload`);
            fileInfo = result.fileInfo;
        }

        return fileInfo;
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
