
import { $createExtendedTableNodeWithDimensions, ExtendedTableNode, TableBodyNode } from '@editor/nodes/table';
import { ExtendedTableCellNode } from '@editor/nodes/table/extendedTableCellNode';
import { TableLayoutCommandsPlugin } from '@editor/plugins/tableLayoutPlugin/tableLayoutCommandsPlugin/tableLayoutCommandsPlugin';
import TablePlugin from "@editor/plugins/tableLayoutPlugin/tablePlugin";
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { $getRoot } from "lexical";
import { beforeEach, describe, expect, test } from "vitest";
import { createTestEditor } from "./editor/testEditor";
import { prepareReact, reactEnv } from './helpers/prepareReact';

describe("Table:",
    async () => {
       prepareReact();
       const editorEnv = await createTestEditor(
        [
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
            TableRowNode,
        ],
        <>
            <TablePlugin/>
            <TableLayoutCommandsPlugin/>
        </>
       );

       test("Create Table",
        async () => {
            const {editor} = editorEnv;
            
            await editor.update(
                () => {
                    const root = $getRoot();
                    const tableNode1x1 = $createExtendedTableNodeWithDimensions(1,1);
                    const tableNode1x2 = $createExtendedTableNodeWithDimensions(1,2);
                    const tableNode2x1 = $createExtendedTableNodeWithDimensions(2,1);
                    const tableNode3x3 = $createExtendedTableNodeWithDimensions(3,3);

                    root.append(tableNode1x1);
                    root.append(tableNode1x2);
                    root.append(tableNode2x1);
                    root.append(tableNode3x3);
                }
            );
            
            expect(reactEnv.innerHTML).toBe('<div><div class="editorEditable_css" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true" contenteditable="true"><p><br></p><table style="width: 100%;"><colgroup><col style="width: 100%;"></colgroup><tbody><tr><td><p><br></p></td></tr></tbody></table><table style="width: 100%;"><colgroup><col style="width: 50%;"><col style="width: 50%;"></colgroup><tbody><tr><td><p><br></p></td><td><p><br></p></td></tr></tbody></table><table style="width: 100%;"><colgroup><col style="width: 100%;"></colgroup><tbody><tr><td><p><br></p></td></tr><tr><td><p><br></p></td></tr></tbody></table><table style="width: 100%;"><colgroup><col style="width: 33.333333333333336%;"><col style="width: 33.333333333333336%;"><col style="width: 33.333333333333336%;"></colgroup><tbody><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr></tbody></table></div></div>');
        }
       );
    }
);