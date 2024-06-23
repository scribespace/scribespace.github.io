import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";


import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { TreeViewPlugin } from "./plugins/debugViewPlugin/debugViewPlugin";
import ToolbarPlugin from "./plugins/toolbarPlugin";


import useBoundingRect from "@/hooks/useBoundingRect";

import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { $callCommand } from "@systems/commandsManager/commandsManager";
import { EDITOR_NODES, editorPlugins } from "@systems/editorManager";
import { isDev } from "@systems/environment";
import { notesManager } from "@systems/notesManager";
import { useEffect, useRef } from "react";
import { EditorInput } from "./components/editorInput/editorInput";
import { CLEAR_HISTORY_CMD } from "./plugins/commandsPlugin/editorCommands";
import { EDITOR_ELEMENT_ID } from "@systems/editorManager/editorConst";

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

type Props = {
  selectedFile: string;
};

function TestPlugin({ selectedFile }: Props) {
  const [editor] = useLexicalComposerContext();

  useEffect(
    () => {
      if ( selectedFile === '' ) return;

      notesManager.loadNote(selectedFile)
      .then(
        (noteObject) => {
          editor.update(
            () => {
              const editorState = editor.parseEditorState(noteObject.data);
              editor.setEditorState(editorState);
              editor.setEditable(true);
              $callCommand(CLEAR_HISTORY_CMD, undefined);
            }
          );
        }
      );
    },
    [editor, selectedFile]
  );

  return null;
}

const USE_DEBUG_TREE = isDev() && false;

export function EditorView({ selectedFile }: Props) {
  const { editorTheme }: MainTheme = useMainThemeContext();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { height: toolbarHeight } = useBoundingRect(toolbarRef);

  const initialConfig = {
    namespace: "ScribleSpace",
    theme: editorTheme.editorInputTheme,
    onError,
    editable: false,
    nodes: EDITOR_NODES,
  };

  return (
      <div id={EDITOR_ELEMENT_ID} className="editor-view">
        <LexicalComposer initialConfig={initialConfig}>
          {editorPlugins()}
          <div className={editorTheme.editorContainer}>
            <ToolbarPlugin ref={toolbarRef} />
            <div
              className={editorTheme.editorInner}
              style={{ height: `calc(${USE_DEBUG_TREE ? '50%' : '100%'} - ${toolbarHeight}px)` }}
            >
              <EditorInput />
            </div>
            {USE_DEBUG_TREE && <TreeViewPlugin/>}
          </div>
          <TestPlugin selectedFile={selectedFile} />
        </LexicalComposer>
      </div>
  );
}
