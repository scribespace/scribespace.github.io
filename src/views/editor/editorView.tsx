

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { TreeViewPlugin } from "./plugins/debugViewPlugin/debugViewPlugin";
import ToolbarPlugin from "./plugins/toolbarPlugin";


import useBoundingRect from "@/hooks/useBoundingRect";

import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { EDITOR_ELEMENT_ID } from "@systems/editorManager/editorConst";
import { isDev } from "@systems/environment/environment";
import { useRef } from "react";
import { EditorInput } from "./components/editorInput/editorInput";
import { EDITOR_NODES, editorPlugins } from "@systems/editorManager/editorEnv";
import { InfobarPlugin } from "./plugins/infobarPlugin";
import { ERROR_OPEN_DIALOG } from "@/components/errorHandling/errorCommands";
import { $callCommand } from "@systems/commandsManager/commandsManager";

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  $callCommand(ERROR_OPEN_DIALOG, error);
}

const USE_DEBUG_TREE = isDev() && false;

export function EditorView() {
  const { editorTheme }: MainTheme = useMainThemeContext();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const infobarRef = useRef<HTMLDivElement>(null);
  const { height: toolbarHeight } = useBoundingRect(toolbarRef);
  const { height: infobarHeight } = useBoundingRect(infobarRef);

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
              style={{ height: `calc(${USE_DEBUG_TREE ? '50%' : '100%'} - ${toolbarHeight}px - ${infobarHeight}px)` }}
            >
              <EditorInput />
            </div>
            {USE_DEBUG_TREE && <TreeViewPlugin/>}
            <InfobarPlugin ref={infobarRef}/>  
          </div>
        </LexicalComposer>
      </div>
  );
}
