
import { $getRoot, $insertNodes, TextNode } from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext'

import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { $generateNodesFromDOM } from '@lexical/html'
import {ListNode, ListItemNode } from '@lexical/list'
import {LinkNode} from '@lexical/link'
import LinkPlugin from './lexical/plugins/linkPlugin/linkPlugin'
import { appGlobals } from '../system/appGlobals';

import './lexical/editor.css'

import { ToolbarPlugin } from './lexical/plugins/toolbarPlugin/toolbarPlugin';

import EditorTheme from './lexical/editorTheme';
import RegisterCustomCommands from './lexical/commands';
import { ExtendedTextNode } from './lexical/nodes/extendedTextNode';
import useResizeObserver from 'use-resize-observer';
import { TableNode, TableRowNode, TableCellNode } from '@lexical/table'
import { ExtendedTableNode } from './lexical/plugins/tablePlugin/nodes/extendedTableNode'
import TablePlugin from './lexical/plugins/tablePlugin/tablePlugin'
import ContextMenuPlugin from './lexical/plugins/contextMenuPlugin/contextMenuPlugin';
import { TableColumnsGroupNode } from './lexical/plugins/tablePlugin/nodes/tableColumnsGroupNode';
import { TableBodyNode } from './lexical/plugins/tablePlugin/nodes/tableBodyNode';
// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

type Props = {
    selectedFile: string;
}

function TestPlugin( {selectedFile} : Props ) {
    const [editor] = useLexicalComposerContext();

    if ( selectedFile != '' ) {
        appGlobals.system?.getFileSystem().downloadFile(selectedFile).then((result) => {
           if ( !!!result.file || !!!result.file.content) {
            throw Error('EditorView couldnt load note!');
        }

        result.file.content.text().then((noteText) => {

            editor.update(()=> {
            const parser = new DOMParser();
            const dom = parser.parseFromString(noteText, "text/html");
            // Once you have the DOM instance it's easy to generate LexicalNodes.
            const nodes = $generateNodesFromDOM(editor, dom);
            // Select the root
            $getRoot().select();
            $getRoot().clear();
            // Insert them at a selection.
            $insertNodes(nodes);
        })
        })

        })
    }
    return null;
};

export function EditorLexicalView({selectedFile} : Props) {
  const { ref: toolbarRef, height: toolbarHeight = 1 } = useResizeObserver<HTMLDivElement>({box:'border-box'}); 

  const initialConfig = {
    namespace: 'MyEditor',
    theme: EditorTheme,
    onError,
    nodes: [
      ListNode,
      ListItemNode,
      LinkNode,
      ExtendedTextNode,
      { replace: TextNode, withKlass: ExtendedTextNode, with: (node: TextNode) => new ExtendedTextNode(node.__text) },
      ExtendedTableNode,
      TableColumnsGroupNode,
      TableBodyNode,
      { replace: TableNode, withKlass: TableBodyNode, with: (_node: TableNode) => new TableBodyNode() },
      TableRowNode,
      TableCellNode,      
    ]
  };
 
  return (
    <LexicalComposer initialConfig={initialConfig}>
        <div className='editor-container'>
            <ToolbarPlugin ref={toolbarRef}/>
            <div className='editor-inner' style={{height: `calc(100% - ${toolbarHeight}px)`}}>
              <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input section-to-print" spellCheck={false}/>}
              placeholder={null}
              ErrorBoundary={LexicalErrorBoundary}
              />
            </div>
        </div>
        <TestPlugin selectedFile={selectedFile}/>
        <HistoryPlugin />
        <AutoFocusPlugin />
        <RegisterCustomCommands />
        <LinkPlugin/>
        <TablePlugin/>
        <ContextMenuPlugin/>
    </LexicalComposer>
  );
}

