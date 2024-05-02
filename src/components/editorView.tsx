import { EventHandler, FunctionComponent, useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { appGlobals } from '../system/appGlobals';
import { FileSystemStatus, FileUploadMode } from '../interfaces/system/fs_interface';
import { useDebouncedCallback } from "use-debounce";

type Props = {
    selectedFile: string;
}

export function EditorView({selectedFile} : Props) {
    const [fileLoaded, setFileLoaded] = useState<boolean>(false);
    const [blockEdit, setBlockEdit] = useState<boolean>(false);
    const editorElement = useRef<Editor>(null)
    const currentFile = useRef<string>('')

    async function Save( file: string, content: string ) {
        const result = await appGlobals.system?.getFileSystem().uploadFile(file, {content: new Blob([content])}, FileUploadMode.Replace)
        if (!!!result) throw Error('UploadTree: no result');
        if (result.status !== FileSystemStatus.Success) throw Error('Couldnt upload tree, status: ' + result.status);        
    }

    function onSave(a: any ) {
        console.log('onSave ' + selectedFile)
        Save( selectedFile, a.content );        
    }

    function onChange(a: any) {
        if ( !debounced.isPending() )
            debounced(a.level.content)
    }

    const debounced = useDebouncedCallback((value) => {
        console.log(fileLoaded + ' ' + (selectedFile != '') )
        if ( fileLoaded && (selectedFile != '') ) {
            console.log('setInterval ' + selectedFile)
            editorElement.current?.editor?.save();
        }
      }, 2000);

      async function WaitForSave() {
        if ( debounced.isPending()) {
            debounced.cancel()
            const content = editorElement.current?.editor?.getContent()
            if ( content )
                await Save(currentFile.current, content );
        }
      }

    useEffect(() => {
        setBlockEdit(true);
        WaitForSave().then(()=> {
        setFileLoaded(false);
        if ( selectedFile != '' ) {
            appGlobals.system?.getFileSystem().downloadFile(selectedFile).then((result) => {
               if ( !!!result.file || !!!result.file.content) {
                throw Error('EditorView couldnt load note!');
            }

            result.file.content.text().then((noteText) => {
                editorElement.current?.editor?.setContent(noteText)
                setFileLoaded(true);
                setBlockEdit(false);

                currentFile.current = selectedFile
            })

            })
        } else {
            editorElement.current?.editor?.setContent('')
            currentFile.current = ''
            setBlockEdit(false);
        }
    })
    },[selectedFile])

    return (
        <Editor
        ref={editorElement}
        disabled={blockEdit || !fileLoaded}
        tinymceScriptSrc='/tinymce/tinymce.min.js'
        licenseKey='gpl'
        onSaveContent={onSave}
        onChange={onChange}
        init={{
        promotion: false,
        height: '100%',
        width: '210mm',
        resize: false,
        menubar: true,
        plugins: [
          'autolink', 'codesample', 'help', 'link', 'lists', 'pagebreak', 'searchreplace', 'table'
        ],       
        paste_data_images: true,
        paste_remove_styles_if_webkit: false,
        paste_webkit_styles: 'all',
        toolbar: '| h1 h2 h3 | fontfamily fontsizeinput | bold italic underline strikethrough | removeformat | align | bullist numlist | forecolor backcolor |  table  | link',
        toolbar_groups: {
          align: {
            icon: 'align-left',
            tooltip: 'Align',
            items: 'alignleft aligncenter alignright alignjustify'
          }
        },
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
    )
}