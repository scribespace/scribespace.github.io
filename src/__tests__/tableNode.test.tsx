

import { Metric } from "@/utils/types";
import { $createExtendedTableNodeWithDimensions, $isExtendedTableNode, ExtendedTableNode, TableBodyNode } from "@editor/nodes/table";
import { ExtendedTableCellNode } from "@editor/nodes/table/extendedTableCellNode";
import { TABLE_INSERT_CMD, TABLE_LAYOUT_COLUMN_REMOVE_CMD, TABLE_LAYOUT_REMOVE_SELECTED_CMD } from "@editor/plugins/tableLayoutPlugin";
import { TableLayoutCommandsPlugin } from "@editor/plugins/tableLayoutPlugin/tableLayoutCommandsPlugin/tableLayoutCommandsPlugin";
import TablePlugin from "@editor/plugins/tableLayoutPlugin/tablePlugin";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { $callCommand } from "@systems/commandsManager/commandsManager";
import { $getRoot, $insertNodes, Klass, LexicalEditor, LexicalNode, LexicalNodeReplacement } from "lexical";
import { describe, expect, test } from "vitest";
import { createEditorContext } from "./editor/editorContext";
import { TestEditor } from "./editor/testEditor";
import { TestPlugin } from "./editor/testPlugin";
import { ReactTest, reactSetup } from "./helpers/prepareReact";

describe("TableNode:",
    async () => {
        reactSetup();

        const TableTestEditor = (nodes?: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>, plugins?: React.ReactNode) => 
            TestEditor( 
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
                ...nodes || []
            ],
            <>
                <TablePlugin/>
                <TableLayoutCommandsPlugin/>
                {plugins}
            </>
         );

         test( "Table Columns Widths", 
            async () => {
                const editorCtx = createEditorContext();
                ReactTest.render(TableTestEditor([], <TestPlugin setContextEditor={(editor: LexicalEditor) => {editorCtx.setEditor(editor);}}/>));
                const {editor} = editorCtx;

                let outColumns: Metric[] = [];
                ReactTest.act( 
                    () => {
                        editor.update( 
                            () => {
                                const columns: Metric[] = [new Metric(10, "%"), new Metric(), new Metric(150, "px"), new Metric(), new Metric()];
                                const rawTabelNode = new ExtendedTableNode(columns);
                                rawTabelNode.fixColumns( 350 );
                                outColumns = rawTabelNode.getColumnsWidths();
                            }
                        );
                    }
                );
                
                expect(outColumns).toEqual([
                    new Metric(35, "px"),
                    new Metric(69, "px"),
                    new Metric(150, "px"),
                    new Metric(69, "px"),
                    new Metric(69, "px"),
                ]);
            }
          );

        test("Table Create - Code",
            async () => {
                const editorCtx = createEditorContext();

                const {container} = ReactTest.render(TableTestEditor([], <TestPlugin setContextEditor={(editor: LexicalEditor) => {editorCtx.setEditor(editor);}}/>));

                await ReactTest.act( 
                    async () => {
                        editorCtx.editor.update(
                            () => {
                                const table1x1 = $createExtendedTableNodeWithDimensions(1,1);
                                const table4x1 = $createExtendedTableNodeWithDimensions(4,1);
                                const table3x3 = $createExtendedTableNodeWithDimensions(3,3);
                                const table1x5 = $createExtendedTableNodeWithDimensions(1,5);
                                $insertNodes([table1x1, table4x1, table3x3, table1x5]);
                            }
                        );
                    }
                 );
                
                expect(container.innerHTML).toBe('<div><div><div class="editorEditable_css" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><table style="width: 100%;"><colgroup><col style="width: 100%;"></colgroup><tbody><tr><td><p><br></p></td></tr></tbody></table><table style="width: 100%;"><colgroup><col style="width: 100%;"></colgroup><tbody><tr><td><p><br></p></td></tr><tr><td><p><br></p></td></tr><tr><td><p><br></p></td></tr><tr><td><p><br></p></td></tr></tbody></table><table style="width: 100%;"><colgroup><col style="width: 33.333333333333336%;"><col style="width: 33.333333333333336%;"><col style="width: 33.333333333333336%;"></colgroup><tbody><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr></tbody></table><table style="width: 100%;"><colgroup><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"></colgroup><tbody><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr></tbody></table></div></div></div>');
            }
        );

        test("Table Create - Command",
            async () => {
                const editorCtx = createEditorContext();

                const {container} = ReactTest.render(TableTestEditor([], <TestPlugin setContextEditor={(editor: LexicalEditor) => {editorCtx.setEditor(editor);}}/>));
                const {editor} = editorCtx;

                await ReactTest.act( 
                    async () => {
                        editor.update(
                            () => {
                                $callCommand( TABLE_INSERT_CMD, {rows: 5, columns: 7} );
                            }
                        );
                    }
                 );

               expect(container.innerHTML).toBe('<div><div><div class="editorEditable_css" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><table style="width: 100%;"><colgroup><col style="width: 14.285714285714286%;"><col style="width: 14.285714285714286%;"><col style="width: 14.285714285714286%;"><col style="width: 14.285714285714286%;"><col style="width: 14.285714285714286%;"><col style="width: 14.285714285714286%;"><col style="width: 14.285714285714286%;"></colgroup><tbody><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr></tbody></table></div></div></div>');
            }
        );

        test("Table Delete - Command",
            async () => {
                const editorCtx = createEditorContext();

                const {container} = ReactTest.render(TableTestEditor([], <TestPlugin setContextEditor={(editor: LexicalEditor) => {editorCtx.setEditor(editor);}}/>));
                const {editor} = editorCtx;

                await ReactTest.act( 
                    async () => {
                        editor.update(
                            () => {
                                $callCommand( TABLE_INSERT_CMD, {rows: 5, columns: 7} );
                            }
                        );
                    }
                 );

                 expect(container.innerHTML).toBe('<div><div><div class="editorEditable_css" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><table style="width: 100%;"><colgroup><col style="width: 14.285714285714286%;"><col style="width: 14.285714285714286%;"><col style="width: 14.285714285714286%;"><col style="width: 14.285714285714286%;"><col style="width: 14.285714285714286%;"><col style="width: 14.285714285714286%;"><col style="width: 14.285714285714286%;"></colgroup><tbody><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr></tbody></table></div></div></div>');

                 await ReactTest.act( 
                    async () => {
                        editor.update(
                            () => {
                                $callCommand( TABLE_LAYOUT_REMOVE_SELECTED_CMD, undefined );
                            }
                        );
                    }
                 );

               expect(container.innerHTML).toBe('<div><div><div class="editorEditable_css" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"></div></div></div>');
            }
        );

        test("Table Delete Column - Command",
            async () => {
                const editorCtx = createEditorContext();

                const {container} = ReactTest.render(TableTestEditor([], <TestPlugin setContextEditor={(editor: LexicalEditor) => {editorCtx.setEditor(editor);}}/>));
                const {editor} = editorCtx;

                await ReactTest.act( 
                    async () => {
                        editor.update(
                            () => {
                                $callCommand( TABLE_INSERT_CMD, {rows: 3, columns: 4} );
                            }
                        );
                    }
                 );

               expect(container.innerHTML).toBe('<div><div><div class="editorEditable_css" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><table style="width: 100%;"><colgroup><col style="width: 25%;"><col style="width: 25%;"><col style="width: 25%;"><col style="width: 25%;"></colgroup><tbody><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr></tbody></table></div></div></div>');

                 let tableNode: ExtendedTableNode | null = null;
                 await ReactTest.act( 
                    async () => {
                        editor.update(
                            () => {
                                const lexicalNode = $getRoot().getFirstChild();
                                expect($isExtendedTableNode(lexicalNode)).toBeTruthy();
                                tableNode = lexicalNode as ExtendedTableNode;

                                const tableRow = tableNode.getTableBodyNode().getChildAtIndex(0) as TableRowNode;
                                const tableCell = tableRow.getChildAtIndex(2) as ExtendedTableCellNode;
                                tableCell.select();

                                $callCommand(TABLE_LAYOUT_COLUMN_REMOVE_CMD, undefined);
                            }
                        );
                    }
                 );

               expect(container.innerHTML).toBe('<div><div><div class="editorEditable_css" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><table style="width: 100%;"><colgroup><col style="width: 33.33333333333333%;"><col style="width: 33.33333333333333%;"><col style="width: 33.33333333333333%;"></colgroup><tbody><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr></tbody></table></div></div></div>');

               await ReactTest.act( 
                async () => {
                    editor.update(
                        () => {
                            const lexicalNode = $getRoot().getFirstChild();
                            expect($isExtendedTableNode(lexicalNode)).toBeTruthy();
                            tableNode = lexicalNode as ExtendedTableNode;

                            const tableRow = tableNode.getTableBodyNode().getChildAtIndex(0) as TableRowNode;
                            const tableCell = tableRow.getChildAtIndex(2) as ExtendedTableCellNode;
                            tableCell.select();

                            $callCommand(TABLE_LAYOUT_COLUMN_REMOVE_CMD, undefined);
                        }
                    );
                }
             );

                expect(container.innerHTML).toBe('<div><div><div class="editorEditable_css" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><table style="width: 100%;"><colgroup><col style="width: 50%;"><col style="width: 50%;"></colgroup><tbody><tr><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td></tr></tbody></table></div></div></div>');

                await ReactTest.act( 
                    async () => {
                        editor.update(
                            () => {
                                const lexicalNode = $getRoot().getFirstChild();
                                expect($isExtendedTableNode(lexicalNode)).toBeTruthy();
                                tableNode = lexicalNode as ExtendedTableNode;
    
                                const tableRow = tableNode.getTableBodyNode().getChildAtIndex(0) as TableRowNode;
                                const tableCell = tableRow.getChildAtIndex(0) as ExtendedTableCellNode;
                                tableCell.select();
    
                                $callCommand(TABLE_LAYOUT_COLUMN_REMOVE_CMD, undefined);
                            }
                        );
                    }
                 );
    
                    expect(container.innerHTML).toBe('<div><div><div class="editorEditable_css" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><table style="width: 100%;"><colgroup><col style="width: 100%;"></colgroup><tbody><tr><td><p><br></p></td></tr><tr><td><p><br></p></td></tr><tr><td><p><br></p></td></tr></tbody></table></div></div></div>');
            }
        );
    }
);