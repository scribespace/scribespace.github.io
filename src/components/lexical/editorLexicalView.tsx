
import { $getRoot, $insertNodes, TextNode } from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { $generateNodesFromDOM } from '@lexical/html';
import {ListNode, ListItemNode } from '@lexical/list';
import {LinkNode} from '@lexical/link';
import LinkPlugin from './plugins/linkPlugin';
import { appGlobals } from '../../system/appGlobals';

import './css/editorInputTheme.css';

import { ToolbarPlugin } from './plugins/toolbarPlugin/toolbarPlugin';

import EditorInputTheme from './theme/editorInputTheme';
import RegisterCustomCommands from './commands';
import ExtendedTextNode from './nodes/text';
import useResizeObserver from 'use-resize-observer';
import { TableNode, TableRowNode, TableCellNode } from '@lexical/table';
import { ExtendedTableNode, TableBodyNode } from './nodes/table';
import TablePlugin from './plugins/tablePlugin';
import ContextMenuPlugin from './plugins/contextMenuPlugin';
import { useEffect, useState } from 'react';
import { EDITOR_THEME_DEFAULT, EditorThemeContext, EditorTheme } from './editorThemeContext';
import { copyExistingValues } from '../../common';
// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

type Props = {
    selectedFile: string;
    theme?: EditorTheme;
};

function TestPlugin( {selectedFile} : Props ) {
    const [editor] = useLexicalComposerContext();

    if ( selectedFile != '' ) {
        appGlobals.system?.getFileSystem().downloadFile(selectedFile).then((result) => {
           if ( !result.file || !result.file.content) {
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
        });
        });

        });
    }
    return null;
}

export function EditorLexicalView({selectedFile, theme} : Props) {
  const [editorTheme, setEditorTheme] = useState<EditorTheme>(EDITOR_THEME_DEFAULT);

  const { ref: toolbarRef, height: toolbarHeight = 1 } = useResizeObserver<HTMLDivElement>({box:'border-box'}); 

  const initialConfig = {
    namespace: 'ScribleSpace',
    theme: EditorInputTheme,
    onError,
    nodes: [
      ListNode,
      ListItemNode,
      LinkNode,
      ExtendedTextNode,
      { replace: TextNode, withKlass: ExtendedTextNode, with: (node: TextNode) => new ExtendedTextNode(node.__text) },
      ExtendedTableNode,
      TableBodyNode,
      { replace: TableNode, withKlass: TableBodyNode, with: () => new TableBodyNode() },
      TableRowNode,
      TableCellNode,      
    ]
  };

  useEffect(()=>{
    const newTheme = copyExistingValues(theme, EDITOR_THEME_DEFAULT);
    setEditorTheme(newTheme);
  },[theme]);
 
  return (
        <EditorThemeContext.Provider value={editorTheme}>
          <LexicalComposer initialConfig={initialConfig}>
          <div className={editorTheme.editorContainer}>
              <ToolbarPlugin ref={toolbarRef}/>
              <div className={editorTheme.editorInner} style={{height: `calc(100% - ${toolbarHeight}px)`}}>
                <RichTextPlugin
                contentEditable={<ContentEditable className={editorTheme.editorEditable} spellCheck={false}/>}
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
    </EditorThemeContext.Provider>
  );
}

