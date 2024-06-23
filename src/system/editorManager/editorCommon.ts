import { DateNode } from "@editor/nodes/date";
import { ImageNode } from "@editor/nodes/image";
import { LayoutNode, LayoutBodyNode } from "@editor/nodes/layout";
import { PageBreakNode } from "@editor/nodes/pageBreak/pageBreakNode";
import { ExtendedTableNode, TableBodyNode } from "@editor/nodes/table";
import { ExtendedTableCellNode } from "@editor/nodes/table/extendedTableCellNode";
import ExtendedTextNode from "@editor/nodes/text";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { $generateNodesFromDOM } from "@lexical/html";
import { LinkNode } from "@lexical/link";
import { ListNode, ListItemNode } from "@lexical/list";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { assert } from "@utils";
import { $createParagraphNode, RootNode, TextNode, createEditor } from "lexical";

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

function createSimpleEditor() {
    return createEditor({
        namespace: '',
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
        onError: () => {
          throw Error();
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