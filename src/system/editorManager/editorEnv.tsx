import { DateNode } from "@editor/nodes/date";
import { ImageNode } from "@editor/nodes/image";
import { LayoutBodyNode, LayoutNode } from "@editor/nodes/layout";
import { PageBreakNode } from "@editor/nodes/pageBreak/pageBreakNode";
import { ExtendedTableNode, TableBodyNode } from "@editor/nodes/table";
import { ExtendedTableCellNode } from "@editor/nodes/table/extendedTableCellNode";
import ExtendedTextNode from "@editor/nodes/text";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { TextNode } from "lexical";
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
import { NoteLoaderPlugin } from "@editor/plugins/noteLoaderPlugin/noteLoaderPlugin";


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
        <ListPlugin key={key++} />,
        <TabIndentationPlugin key={key++} />,
        <HorizontalRulePlugin key={key++} />,
        <PageBreakPlugin key={key++} />,
        <DatePlugin key={key++} />,
        <NoteLoaderPlugin key={key++} />,
    ];
};
