import { EventHandler, FunctionComponent, useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { appGlobals } from '../system/appGlobals';
import { FileSystemStatus, FileUploadMode } from '../interfaces/system/fs_interface';

type Props = {
    selectedFile: string;
}

export function EditorView({selectedFile} : Props) {
    const [fileLoaded, setFileLoaded] = useState<boolean>(false);
    const editorElement = useRef<Editor>(null)
    const somethingChnaged = useRef<boolean>(false);
    const saveCallback = useRef<()=>void>(()=>{})

    function Save( file: string, content: string, callback: () => void ) {
        appGlobals.system?.getFileSystem().uploadFile(file, {content: new Blob([content])}, FileUploadMode.Replace).then((result) => {
            if (!!!result) throw Error('UploadTree: no result');
            if (result.status !== FileSystemStatus.Success) throw Error('Couldnt upload tree, status: ' + result.status);
            callback();
        })
    }

    function onSave(a :any ) {
        console.log('onSave ' + selectedFile)
        Save( selectedFile, a.content, ()=>{console.log('saved')} );        
        somethingChnaged.current = false;
    }

    function onChange() {
        somethingChnaged.current = true;
    }

    useEffect(()=>{
        saveCallback.current = () => {
            console.log(fileLoaded + ' ' + (selectedFile != '') + ' ' + somethingChnaged.current)
            if ( fileLoaded && (selectedFile != '') && somethingChnaged.current ) {
                console.log('setInterval ' + selectedFile)
                editorElement.current?.editor?.save();
            }
        }
    },[fileLoaded, selectedFile, somethingChnaged])
    
    useEffect( () => {
        const intervalID = setInterval(()=>{
           saveCallback.current();
        }, 5000)

        return () => clearInterval(intervalID)
    }, [])

    useEffect(() => {
        setFileLoaded(false);
        if ( selectedFile != '' ) {
            appGlobals.system?.getFileSystem().downloadFile(selectedFile).then((result) => {
               if ( !!!result.file || !!!result.file.content) {
                throw Error('EditorView couldnt load note!');
            }

            result.file.content.text().then((noteText) => {
                editorElement.current?.editor?.setContent(noteText)
                setFileLoaded(true);
            })

            })
        } else {
            editorElement.current?.editor?.setContent('')
        }
    },[selectedFile])

    return (
        <Editor
        ref={editorElement}
        disabled={!fileLoaded}
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