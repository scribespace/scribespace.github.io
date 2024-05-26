
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $insertNodes, TextNode } from 'lexical';

import { $generateNodesFromDOM } from '@lexical/html';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { appGlobals } from '@system/appGlobals';
import LinkPlugin from './plugins/linkPlugin';

import './css/editorInputTheme.css';

import ToolbarPlugin from './plugins/toolbarPlugin/toolbarPlugin';

import useBoundingRect from '@/hooks/useBoundingRect';
import { useMainThemeContext } from '@/mainThemeContext';
import { MainTheme } from '@/theme';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { useRef } from 'react';
import { ExtendedTableNode, TableBodyNode } from './nodes/table';
import ExtendedTextNode from './nodes/text';
import { ColorPlugin } from './plugins/colorPlugin';
import ContextMenuPlugin from './plugins/contextMenuPlugin';
import TablePlugin from './plugins/tablePlugin';
import { FontPlugin } from './plugins/fontPlugin';
import { LayoutBodyNode, LayoutNode } from './nodes/layout';
import { LayoutPlugin } from './plugins/layoutPlugin';
import { ImageNode } from './nodes/image';
import { DragDropPlugin } from './plugins/dragDropPlugin';
import { ImagePlugin } from './plugins/imagePlugin';
// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

type Props = {
    selectedFile: string;
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

export function EditorLexicalView({selectedFile} : Props) {
  const {editorTheme}: MainTheme = useMainThemeContext();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const {height: toolbarHeight } = useBoundingRect(toolbarRef);

  const initialConfig = {
    namespace: 'ScribleSpace',
    theme: editorTheme.editorInputTheme,
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
      LayoutNode,
      LayoutBodyNode,
      TableRowNode,
      TableCellNode,     
      ImageNode, 
    ]
  };

  return (
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
          <FontPlugin/>
          <ColorPlugin/>
          <LinkPlugin/>
          <TablePlugin/>
          <LayoutPlugin/>
          <ContextMenuPlugin/>
          <DragDropPlugin/>
          <ImagePlugin/>
      </LexicalComposer>
  );
}

