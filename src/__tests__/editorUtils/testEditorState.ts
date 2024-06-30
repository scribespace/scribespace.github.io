import { $createDateNode } from "@editor/nodes/date";
import { $createLayoutNodeWithColumns } from "@editor/nodes/layout";
import { $createPageBreakNode } from "@editor/nodes/pageBreak/pageBreakNode";
import { $createExtendedTableNodeWithDimensions } from "@editor/nodes/table";
import { $createLinkNode } from "@lexical/link";
import { $createListNode, $createListItemNode } from "@lexical/list";
import { $createHorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { $createParagraphNode, $createTextNode, $insertNodes, IS_BOLD, LexicalEditor, LexicalNode } from "lexical";
import { ReactTest } from "../helpers/prepareReact";

export async function createTestEditroState(editor: LexicalEditor) {
    await ReactTest.act( 
        async () => {
            editor.update(
                () => {
                  const nodes: LexicalNode[] = [];
                  nodes.push( $createParagraphNode().append($createTextNode("testestest")) );
                  nodes.push( $createParagraphNode().append($createTextNode("testestest2").setFormat(IS_BOLD)) );
                  nodes.push( $createLinkNode("https://hello.com").append($createTextNode('zelda')) );
                  nodes.push( $createLayoutNodeWithColumns(3) );
                  nodes.push( $createExtendedTableNodeWithDimensions(4,3) );
                  nodes.push($createListNode('bullet')
                  .append(
                    $createListItemNode()
                    .append(
                      $createTextNode('list0')
                    ),
                    $createListItemNode()
                    .append(
                      $createTextNode('list1')
                    ),
                  ));
                  nodes.push($createHorizontalRuleNode());
                  nodes.push($createDateNode());
                  nodes.push($createPageBreakNode());
                  $insertNodes(nodes);
                }
            );
        }
      );
}