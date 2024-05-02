import { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { appGlobals } from '../system/appGlobals';
import { FileSystemStatus, FileUploadMode } from '../interfaces/system/fs_interface';

import "./css/editorView.css"
import {buildInShortcuts, customShortcuts} from './shortcuts'

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
            editor.addShortcut('alt+0', 'Help Dialog', () => {
                openHelpDialog();
            })
            editor.ui.registry.addMenuItem('helpdialog', {
                text: 'Help',
                shortcut: 'alt+0',
                onAction: () => openHelpDialog()
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
                editor.execCommand('ForeColor', false, '#FF0000');
                editor.formatter.apply('bold')
            });
            editor.addShortcut('meta+shift+d', 'Set Blue', () => {
                editor.execCommand('ForeColor', false, '#0000FF');
                editor.formatter.apply('bold')
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