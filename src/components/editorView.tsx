import { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

import { appGlobals } from '../system/appGlobals';
import { FileSystemStatus, FileUploadMode, UploadResult } from '../interfaces/system/fs_interface';

import "./css/editorView.css"
import {buildInShortcuts, customShortcuts} from './shortcuts'

const IMAGES_PATH = '/images/'
const IMAGES_LIST_FILE = '/image_list'


type Props = {
    selectedFile: string;
}

export function EditorView({selectedFile} : Props) {
    const [fileLoaded, setFileLoaded] = useState<boolean>(false);
    const [blockEdit, setBlockEdit] = useState<boolean>(false);
    const editorElement = useRef<Editor>(null)
    const currentFile = useRef<string>('')
    const [intervalVersion, setIntervalVersion] = useState<number>(0)
    const imagesMap = useRef<Map<string, string>>(new Map<string, string>)

    async function Save( file: string, content: string ) {
        const result = await appGlobals.system?.getFileSystem().uploadFile(file, {content: new Blob([content])}, FileUploadMode.Replace)
        if (!!!result) throw Error('UploadTree: no result');
        if (result.status !== FileSystemStatus.Success) throw Error('Couldnt upload tree, status: ' + result.status);    
        console.log(file+' saved!')    
    }

    function onSave(a: any ) {
        Save( currentFile.current, a.content );        
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

      async function UploadImage(blobInfo: any): Promise<string> {
            let fileName = 'scribe-space-id-image-' + crypto.randomUUID() + (new Date().toJSON());
            
            const result: UploadResult | undefined = await appGlobals.system?.getFileSystem().uploadFile(IMAGES_PATH + fileName, {content: blobInfo.blob()}, FileUploadMode.Add)
            if (!!!result) throw Error('onCreate note: no result');
            if (result.status !== FileSystemStatus.Success) throw Error('Couldnt upload note, status: ' + result.status);
            if (!!!result.fileInfo) throw Error('onCreate note: No fileInfo');
            if (!!!result.fileInfo.hash) throw Error('onCreate note: No hash');

            let imageURL = ""
            if ( result.fileInfo.name) {
                const urlResult = await appGlobals.system?.getFileSystem().getFileURL(result.fileInfo.name)
                if ( urlResult )
                    imageURL = urlResult

                imagesMap.current.set(imageURL, result.fileInfo.name)

                editorElement.current?.editor?.notificationManager.open({
                    text: "Image Saved!",
                    type: 'success',
                    timeout: 2000
                })

                const array = Array.from(imagesMap.current.entries());
                const imagesJSON = JSON.stringify(array)
                appGlobals.system?.getFileSystem().uploadFile(IMAGES_LIST_FILE, {content: new Blob([imagesJSON])}, FileUploadMode.Replace).then((result) => {
                    if (!!!result) throw Error('UploadImage -> upload images list: no result');
                    if (result.status !== FileSystemStatus.Success) throw Error('Couldnt upload images list, status: ' + result.status);
                })
            }
            if ( imageURL == "" )
                imageURL = '/images/no-image.png'

            return imageURL
     }


      useEffect(()=>{
        setTimeout(() => {setIntervalVersion((current)=>current + 1)}, 1000)
        TriggerSave()
      },[intervalVersion])

      useEffect(()=>{
        appGlobals.system?.getFileSystem().downloadFile(IMAGES_LIST_FILE).then((result) => {
            if ( result.status === FileSystemStatus.Success ) {
                result.file?.content?.text().then((imagesJSON) => {
                    const imagesArray = JSON.parse(imagesJSON)
                    imagesMap.current = new Map(imagesArray)
                })
            } 
        })
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
                editorElement.current?.editor?.undoManager.clear();
                setFileLoaded(true);
                setBlockEdit(false);

                currentFile.current = selectedFile
            })

            })
        } else {
            editorElement.current?.editor?.setContent('')
            editorElement.current?.editor?.undoManager.clear();
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
        plugins: [
            'autolink', 'codesample', 'link', 'lists', 'pagebreak', 'searchreplace', 'table'
        ],       
        paste_data_images: true,
        images_upload_handler: UploadImage,
        images_file_types: 'jpeg,jpg,png',
        paste_remove_styles_if_webkit: false,
        paste_webkit_styles: 'all',
        menubar: 'file edit insert format table help',
        menu: {
            file: { title: 'File', items: 'print' },
            help: { title: 'Help', items: 'helpdialog' },
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
        content_css: '/css/content.css',
        font_size_input_default_unit: 'pt',
        line_height_formats: '1 1.2 1.4 1.6 2',
        setup: function(editor) {

            const convertShortCut = (shortcut: string) => {
                const globalEnv = (window as any).tinymce.util.Tools.resolve('tinymce.Env');
                const isMac = globalEnv.os.isMacOS() || globalEnv.os.isiOS();
                const mac = {
                    alt: '&#x2325;',
                    ctrl: '&#x2303;',
                    shift: '&#x21E7;',
                    meta: '&#x2318;',
                    access: '&#x2303;&#x2325;'
                };
                const other = {
                    meta: 'Ctrl ',
                    access: 'Shift + Alt '
                };

                const replace = isMac ? mac : other;
                const keys = shortcut.split('+');
                const fixedKeys = keys.map((key) => {
                    const search = key.toLowerCase().trim()
                    return replace.hasOwnProperty(search) ? (replace as any)[search] : key;
                })
                return isMac ? fixedKeys.join('').replace(/\s/, '') : fixedKeys.join('+');
            }

            const buildInShortcutsFixed = buildInShortcuts.map((value) => [value[0], convertShortCut(value[1])])
            const customShortcutsFixed = customShortcuts.map((value) => [value[0], convertShortCut(value[1])])

            const openHelpDialog = () => {  
                editor.windowManager.open({
                    title: 'Help',
                    body: {
                        type: 'panel', // The root body type - a Panel or TabPanel
                        items: [ // A list of panel components
                        {
                            type: 'table', // component type
                            header: [ 'Action', 'Shortcut' ],
                            cells: buildInShortcutsFixed
                          },
                          {
                            type: 'table', // component type
                            header: [ 'Action', 'Shortcut' ],
                            cells: customShortcutsFixed
                          }
                        ]
                      },
                      buttons: [ // A list of footer buttons
                        {
                          type: 'submit',
                          text: 'OK',
                          primary: true
                        }
                      ],
                      onSubmit: function(api) {
                        // This line closes the dialog
                        api.close();
                    }
                })
            }

            editor.on('remove', function (e) {
                console.log(e)
                // Check if the removed element is an image
                if (e.target.nodeName.toLowerCase() === 'img') {
                  // React to the image being deleted
                  var deletedImage = e.target;
                  console.log('Image deleted:', deletedImage);
                  // Perform any other actions you need here
                }
              });

            editor.addShortcut('alt+0', 'Help Dialog', () => {
                openHelpDialog();
            })
            editor.ui.registry.addMenuItem('helpdialog', {
                text: 'Help',
                shortcut: 'alt+0',
                onAction: () => openHelpDialog()
              });

              editor.on('paste', function() {
                editor.setDirty(true);
            });

            editor.on('PreInit', function() {
                editor.getBody().style.fontSize = '8pt';
            });
            editor.addShortcut('meta+13', 'Page Break', () => {
                editor.execCommand('mcePageBreak');
            });
            editor.addShortcut('meta+shift+s', 'Increase Font Size', () => {
                var currentSize = editor.queryCommandValue('FontSize') || '12pt';
                var newSize = parseInt(currentSize) + 1 + 'pt';
                editor.execCommand('FontSize', false, newSize);
            });
            editor.addShortcut('meta+shift+a', 'Decrease Font Size', () => {
                var currentSize = editor.queryCommandValue('FontSize') || '12pt';
                var newSize = parseInt(currentSize) - 1 + 'pt';
                editor.execCommand('FontSize', false, newSize);
            });
            editor.addShortcut('meta+shift+r', 'Add Horizonal Ruler', () => {
                editor.execCommand('InsertHorizontalRule');
            });
            editor.addShortcut('meta+shift+q', 'Remove Formatting', () => {
                editor.execCommand('RemoveFormat');
            });
            editor.addShortcut('meta+shift+e', 'Set Red', () => {
                editor.undoManager.transact(function() {
                    editor.execCommand('ForeColor', false, '#FF0000');
                    editor.formatter.apply('bold')
                })
            });
            editor.addShortcut('meta+shift+d', 'Set Blue', () => {
                editor.undoManager.transact(function() {
                    editor.execCommand('ForeColor', false, '#0000FF');
                    editor.formatter.apply('bold')
                });
            });
            editor.addShortcut('alt+q', 'Justify Left', () => {
                editor.execCommand('JustifyLeft');
            });
            editor.addShortcut('alt+w', 'Justify Center', () => {
                editor.execCommand('JustifyCenter');
            });
            editor.addShortcut('alt+e', 'Justify Right', () => {
                editor.execCommand('JustifyRight');
            });
            editor.addShortcut('alt+c', 'Clear Table Border', () => {
                var node = editor.selection.getNode(); // Get the current node
                let table = editor.dom.getParent(node, 'table');
                if (table) { // Check if it is a table or inside a table
                    editor.dom.setStyle(table, 'borderColor', '#00000000'); // Set the border color
                    editor.undoManager.add(); // Add undo option for this change
                }
            });
            editor.addShortcut('alt+x', 'Reset Table Border', () => {
                var node = editor.selection.getNode(); // Get the current node
                let table = editor.dom.getParent(node, 'table');
                if (table) { // Check if it is a table or inside a table
                    editor.dom.setStyle(table, 'borderColor', 'black'); // Set the border color
                    editor.undoManager.add(); // Add undo option for this change
                }
            });
          },
        }}
      />
    )
}