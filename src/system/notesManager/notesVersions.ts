import { editorHtmlToJSON } from "@systems/editorManager";

export interface NoteObject {
    version: number,
    data: string
}

export async function noteConvertToV0( content: string ): Promise<NoteObject> {
    const parser = new DOMParser();
    const dom = parser.parseFromString(content, "text/html");
    
    const editorJSON = await editorHtmlToJSON(dom);
    
    const noteObject = { version: 0, data: editorJSON };

    return noteObject;
}