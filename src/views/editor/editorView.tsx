import { $getRoot, $insertNodes, TextNode } from "lexical";
import { $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import {HorizontalRuleNode} from '@lexical/react/LexicalHorizontalRuleNode';

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import {TabIndentationPlugin} from '@lexical/react/LexicalTabIndentationPlugin';
import {HorizontalRulePlugin} from '@lexical/react/LexicalHorizontalRulePlugin';

import LinkPlugin from "./plugins/linkPlugin";
import ToolbarPlugin from "./plugins/toolbarPlugin";
import { ColorPlugin } from "./plugins/colorPlugin";
import ContextMenuPlugin from "./plugins/contextMenuPlugin";
import { DragDropPlugin } from "./plugins/dragDropPlugin";
import { FontPlugin } from "./plugins/fontPlugin";
import { ImagePlugin } from "./plugins/imagePlugin";
import { LayoutPlugin } from "./plugins/layoutPlugin";
import TablePlugin from "./plugins/tablePlugin";

import { ImageNode } from "./nodes/image";
import { LayoutBodyNode, LayoutNode } from "./nodes/layout";
import { ExtendedTableNode, TableBodyNode } from "./nodes/table";
import ExtendedTextNode from "./nodes/text";

import useBoundingRect from "@/hooks/useBoundingRect";

import { DownloadResult } from "@/interfaces/system/fileSystem/fileSystemShared";
import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { useRef } from "react";
import { EditorInput } from "./components/editorInput/editorInput";
import { $getFileSystem } from "@coreSystems";

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
      });
  }
  return null;
}

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
        with: (node: TextNode) => new ExtendedTextNode(node.__text),
      },
      ExtendedTableNode,
      TableBodyNode,
      {
        replace: TableNode,
        withKlass: TableBodyNode,
        with: () => new TableBodyNode(),
      },
      LayoutNode,
      LayoutBodyNode,
      TableRowNode,
      TableCellNode,
      ImageNode,
      CodeNode,
      CodeHighlightNode,
      HorizontalRuleNode,
    ],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={editorTheme.editorContainer}>
        <ToolbarPlugin ref={toolbarRef} />
        <div
          className={editorTheme.editorInner}
          style={{ height: `calc(100% - ${toolbarHeight}px)` }}
        >
          <EditorInput />
        </div>
      </div>
      <TestPlugin selectedFile={selectedFile} />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <FontPlugin />
      <ColorPlugin />
      <LinkPlugin />
      <TablePlugin />
      <LayoutPlugin />
      <ContextMenuPlugin />
      <DragDropPlugin />
      <ImagePlugin />
      <ListPlugin/>
      <TabIndentationPlugin/>
      <HorizontalRulePlugin />
    </LexicalComposer>
  );
}
