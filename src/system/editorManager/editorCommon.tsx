import { DateNode } from "@editor/nodes/date";
import { ImageNode } from "@editor/nodes/image";
import { LayoutBodyNode, LayoutNode } from "@editor/nodes/layout";
import { PageBreakNode } from "@editor/nodes/pageBreak/pageBreakNode";
import { ExtendedTableNode, TableBodyNode } from "@editor/nodes/table";
import { ExtendedTableCellNode } from "@editor/nodes/table/extendedTableCellNode";
import ExtendedTextNode from "@editor/nodes/text";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { $generateNodesFromDOM } from "@lexical/html";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { assert } from "@utils";
import { $createParagraphNode, RootNode, TextNode, createEditor } from "lexical";

import { ActionsPlugin } from "@editor/plugins/actionsPlugin/actionsPlugin";
import { ColorPlugin } from "@editor/plugins/colorPlugin";
import { CommandsPlugin } from "@editor/plugins/commandsPlugin/commandsPlugin";
import ContextMenuPlugin from "@editor/plugins/contextMenuPlugin";
import { DatePlugin } from "@editor/plugins/datePlugin/datePlugin";
import { DragDropPlugin } from "@editor/plugins/dragDropPlugin";
import { FontPlugin } from "@editor/plugins/fontPlugin";
import { ImagePlugin } from "@editor/plugins/imagePlugin";
import LinkPlugin from "@editor/plugins/linkPlugin";
import PageBreakPlugin from "@editor/plugins/pageBreakPlugin/pageBreakPlugin";
import { TableLayoutPlugin } from "@editor/plugins/tableLayoutPlugin/tableLayoutPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { MAIN_THEME_DEFAULT } from "@/theme";

export const EDITOR_NODES = [
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
];

export const editorPlugins = () => {
    let key = 0;
    return [
        <CommandsPlugin key={key++} />,
        <ActionsPlugin key={key++} />,
        <HistoryPlugin key={key++} />,
        <ContextMenuPlugin key={key++} />,
        <AutoFocusPlugin key={key++} />,
        <FontPlugin key={key++} />,
        <ColorPlugin key={key++} />,
        <LinkPlugin key={key++} />,
        <TableLayoutPlugin key={key++} />,
        <DragDropPlugin key={key++} />,
        <ImagePlugin key={key++} />,
        <ListPlugin key={key++}/>,
        <TabIndentationPlugin key={key++}/>,
        <HorizontalRulePlugin key={key++} />,
        <PageBreakPlugin key={key++} />,
        <DatePlugin key={key++} />,
    ];
};

function createSimpleEditor() {
    return createEditor({
        namespace: '',
        theme: MAIN_THEME_DEFAULT.editorTheme.editorInputTheme,
        nodes: [ ListNode,
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
            DateNode,],
        onError: (error) => {
          throw error;
        }
    });
}

export async function editorHtmlToJSON( dom: Document ) {
    const editor = createSimpleEditor();

    await editor.update(() => {
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = editor.getEditorState()._nodeMap.get('root') as RootNode;
        const selection = root.selectEnd();
        assert( selection.getNodes().length === 1, "nodes exist" );
        if ( nodes.length === 0 ) {
            nodes.push($createParagraphNode());
        }
        selection.insertNodes(nodes);
    });
    return JSON.stringify( editor.getEditorState() );
}

export async function editorGetEmptyNote() {
    const editor = createSimpleEditor();
    
    await editor.update(() => {
        const root = editor.getEditorState()._nodeMap.get('root') as RootNode;
        const selection = root.selectEnd();
        assert( selection.getNodes().length === 1, "nodes exist" );
        selection.insertNodes([$createParagraphNode()]);
    });
    return JSON.stringify( editor.getEditorState() );
}