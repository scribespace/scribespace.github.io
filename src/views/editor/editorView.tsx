import { $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $insertNodes, TextNode } from "lexical";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';

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

import { ImageNode } from "./nodes/image";
import { LayoutBodyNode, LayoutNode } from "./nodes/layout";
import { ExtendedTableNode, TableBodyNode } from "./nodes/table";
import ExtendedTextNode from "./nodes/text";

import useBoundingRect from "@/hooks/useBoundingRect";

import { DownloadResult } from "@/interfaces/system/fileSystem/fileSystemShared";
import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { $getFileSystem } from "@coreSystems";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { $callCommand } from "@systems/commandsManager/commandsManager";
import { useRef } from "react";
import { EditorInput } from "./components/editorInput/editorInput";
import { PageBreakNode } from "./nodes/pageBreak/pageBreakNode";
import { ExtendedTableCellNode } from "./nodes/table/extendedTableCellNode";
import { CommandsPlugin } from "./plugins/commandsPlugin/commandsPlugin";
import { TreeViewPlugin } from "./plugins/debugViewPlugin/debugViewPlugin";
import PageBreakPlugin from "./plugins/pageBreakPlugin/pageBreakPlugin";
import { TableLayoutPlugin } from "./plugins/tableLayoutPlugin/tableLayoutPlugin";
import { CLEAR_HISTORY_CMD } from "./plugins/commandsPlugin/editorCommands";
import { ActionsPlugin } from "./plugins/actionsPlugin/actionsPlugin";
import { isDev } from "@systems/environment";
import { DatePlugin } from "./plugins/datePlugin/datePlugin";
import { DateNode } from "./nodes/date";

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

  if (selectedFile != "") {
    $getFileSystem().downloadFileAsync(selectedFile)
    .then((result: DownloadResult) => {
        if (!result.file || !result.file.content) {
          throw Error("EditorView couldnt load note!");
        }

        result.file.content.text().then((noteText) => {
          editor.update(() => {
            const parser = new DOMParser();
            const dom = parser.parseFromString(noteText, "text/html");
            // Once you have the DOM instance it's easy to generate LexicalNodes.
            const nodes = $generateNodesFromDOM(editor, dom);
            // Select the root
            $getRoot().select();
            $getRoot().clear();
            // Insert them at a selection.
            $insertNodes(nodes);

            editor.setEditable(true);
          });
        });
        $callCommand(CLEAR_HISTORY_CMD, undefined);
      });
  }
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
    nodes: [
      ListNode,
      ListItemNode,
      LinkNode,
      ExtendedTextNode,
      {
        replace: TextNode,
        withKlass: ExtendedTextNode,
        with: (node: TextNode) => new ExtendedTextNode(node.__text, node.__format, node.__style),
      },
      ExtendedTableNode,
      TableBodyNode,
      {
        replace: TableNode,
        withKlass: TableBodyNode,
        with: () => new TableBodyNode(),
      },
      ExtendedTableCellNode,
      {
        replace: TableCellNode,
        withKlass: ExtendedTableCellNode,
        with: (node: TableCellNode) => new ExtendedTableCellNode(node.__colSpan, node.__width),
      },
      LayoutNode,
      LayoutBodyNode,
      TableRowNode,
      ImageNode,
      CodeNode,
      CodeHighlightNode,
      HorizontalRuleNode,
      PageBreakNode,
      DateNode,
    ],
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
