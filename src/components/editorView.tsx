import { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { appGlobals } from '../system/appGlobals';
import { FileSystemStatus, FileUploadMode } from '../interfaces/system/fs_interface';

type Props = {
    selectedFile: string;
}

export function EditorView({selectedFile} : Props) {
    const [fileLoaded, setFileLoaded] = useState<boolean>(false);
    const [blockEdit, setBlockEdit] = useState<boolean>(false);
    const editorElement = useRef<Editor>(null)
    const currentFile = useRef<string>('')
    const intervalVersion = useRef<number>(0)
    const saveCallback = useRef<()=>void>(()=>{})

    async function Save( file: string, content: string ) {
        const result = await appGlobals.system?.getFileSystem().uploadFile(file, {content: new Blob([content])}, FileUploadMode.Replace)
        if (!!!result) throw Error('UploadTree: no result');
        if (result.status !== FileSystemStatus.Success) throw Error('Couldnt upload tree, status: ' + result.status);    
        console.log('saved!')    
    }

    function onSave(a: any ) {
        Save( selectedFile, a.content );        
    }

      async function WaitForSave() {
        if ( editorElement.current?.editor?.isDirty()) {
            
            const content = editorElement.current?.editor?.getContent()
            if ( content )
                await Save(currentFile.current, content );
        }
      }

      function TriggerSave() {
        if ( editorElement.current?.editor?.isDirty() && fileLoaded && (selectedFile != '') ) {
            editorElement.current?.editor?.save();
        }
      }

      useEffect(()=>{
        saveCallback.current = TriggerSave;
      },[intervalVersion.current])

      useEffect(()=>{
        const intervalID = setInterval(() => { ++intervalVersion.current; saveCallback.current()}, 1000)
        return () => clearInterval(intervalID)
      },[])

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
        menu: {
            file: { title: 'File', items: 'print' },
        },
        removed_menuitems: 'visualaid',
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