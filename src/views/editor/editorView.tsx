import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";


import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';

import { ColorPlugin } from "./plugins/colorPlugin";
import ContextMenuPlugin from "./plugins/contextMenuPlugin";
import { DragDropPlugin } from "./plugins/dragDropPlugin";
import { FontPlugin } from "./plugins/fontPlugin";
import { ImagePlugin } from "./plugins/imagePlugin";
import LinkPlugin from "./plugins/linkPlugin";
import ToolbarPlugin from "./plugins/toolbarPlugin";


import useBoundingRect from "@/hooks/useBoundingRect";

import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { $callCommand } from "@systems/commandsManager/commandsManager";
import { EDITOR_NODES } from "@systems/editorManager";
import { isDev } from "@systems/environment";
import { notesManager } from "@systems/notesManager";
import { useEffect, useRef } from "react";
import { EditorInput } from "./components/editorInput/editorInput";
import { ActionsPlugin } from "./plugins/actionsPlugin/actionsPlugin";
import { CommandsPlugin } from "./plugins/commandsPlugin/commandsPlugin";
import { CLEAR_HISTORY_CMD } from "./plugins/commandsPlugin/editorCommands";
import { DatePlugin } from "./plugins/datePlugin/datePlugin";
import { TreeViewPlugin } from "./plugins/debugViewPlugin/debugViewPlugin";
import PageBreakPlugin from "./plugins/pageBreakPlugin/pageBreakPlugin";
import { TableLayoutPlugin } from "./plugins/tableLayoutPlugin/tableLayoutPlugin";

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

const USE_DEBUG_TREE = isDev() && true;

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
      <div id="editor-view" className="editor-view">
        <LexicalComposer initialConfig={initialConfig}>
          <CommandsPlugin />
          <ActionsPlugin />
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
          <HistoryPlugin />
          <AutoFocusPlugin />
          <FontPlugin />
          <ColorPlugin />
          <LinkPlugin />
          <TableLayoutPlugin />
          <ContextMenuPlugin />
          <DragDropPlugin />
          <ImagePlugin />
          <ListPlugin/>
          <TabIndentationPlugin/>
          <HorizontalRulePlugin />
          <PageBreakPlugin />
          <DatePlugin />
        </LexicalComposer>
      </div>
  );
}
