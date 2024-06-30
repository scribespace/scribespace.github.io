

import { Metric } from "@/utils/types";
import { $createLayoutNodeWithColumns, LayoutBodyNode, LayoutNode } from "@editor/nodes/layout";
import { $isExtendedTableNode, TableBodyNode } from "@editor/nodes/table";
import { ExtendedTableCellNode } from "@editor/nodes/table/extendedTableCellNode";
import { LAYOUT_INSERT_CMD, TABLE_LAYOUT_COLUMN_REMOVE_CMD, TABLE_LAYOUT_REMOVE_SELECTED_CMD } from "@editor/plugins/tableLayoutPlugin";
import { LayoutPlugin } from "@editor/plugins/tableLayoutPlugin/layoutPlugin";
import { TableLayoutCommandsPlugin } from "@editor/plugins/tableLayoutPlugin/tableLayoutCommandsPlugin/tableLayoutCommandsPlugin";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { $callCommand } from "@systems/commandsManager/commandsManager";
import { $getRoot, $insertNodes, Klass, LexicalEditor, LexicalNode, LexicalNodeReplacement } from "lexical";
import { describe, expect, test } from "vitest";
import { createEditorContext } from "../editorUtils/editorContext";
import { DefaultTestEditor } from "../editorUtils/testEditor";
import { TestPlugin } from "../editorUtils/testPlugin";
import { ReactTest, reactSetup } from "../helpers/prepareReact";

describe("LayoutNode:",
    async () => {
        reactSetup();

        let pluginKey = 0;
        const TestEditor = (nodes?: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>, plugins?: React.ReactNode[]) => 
            DefaultTestEditor( 
            [
                LayoutNode,
                LayoutBodyNode,
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
            [
                <LayoutPlugin key={pluginKey++}/>,
                <TableLayoutCommandsPlugin key={pluginKey++}/>,
                ...(plugins||[]),
            ]
         );

         test( "Layout Columns Widths", 
            async () => {
                const editorCtx = createEditorContext();
                ReactTest.render(TestEditor([], [<TestPlugin key={pluginKey++} setContextEditor={(editor: LexicalEditor) => {editorCtx.setEditor(editor);}}/>]));
                const {editor} = editorCtx;

                let outColumns: Metric[] = [];
                ReactTest.act( 
                    () => {
                        editor.update( 
                            () => {
                                const columns: Metric[] = [new Metric(10, "%"), new Metric(), new Metric(150, "px"), new Metric(), new Metric()];
                                const rawLayoutNode = new LayoutNode(columns);
                                rawLayoutNode.fixColumns( 350 );
                                outColumns = rawLayoutNode.getColumnsWidths();
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

        test("Layout Create - Code",
            async () => {
                const editorCtx = createEditorContext();

                const {container} = ReactTest.render(TestEditor([], [<TestPlugin key={pluginKey++} setContextEditor={(editor: LexicalEditor) => {editorCtx.setEditor(editor);}}/>]));

                await ReactTest.act( 
                    async () => {
                        editorCtx.editor.update(
                            () => {
                                const layout4 = $createLayoutNodeWithColumns(4);
                                const layout3 = $createLayoutNodeWithColumns(3);
                                const layout1 = $createLayoutNodeWithColumns(1);
                                $insertNodes([layout4, layout3, layout1]);
                            }
                        );
                    }
                 );
                
                expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><table style="width: 100%;" type="layout"><colgroup><col style="width: 25%;"><col style="width: 25%;"><col style="width: 25%;"><col style="width: 25%;"></colgroup><tbody><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr></tbody></table><table style="width: 100%;" type="layout"><colgroup><col style="width: 33.333333333333336%;"><col style="width: 33.333333333333336%;"><col style="width: 33.333333333333336%;"></colgroup><tbody><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr></tbody></table><table style="width: 100%;" type="layout"><colgroup><col style="width: 100%;"></colgroup><tbody><tr><td><p><br></p></td></tr></tbody></table></div></div></div></div>');
            }
        );

        test("Layout Create - Command",
            async () => {
                const editorCtx = createEditorContext();

                const {container} = ReactTest.render(TestEditor([], [<TestPlugin key={pluginKey++} setContextEditor={(editor: LexicalEditor) => {editorCtx.setEditor(editor);}}/>]));
                const {editor} = editorCtx;

                await ReactTest.act( 
                    async () => {
                        editor.update(
                            () => {
                                $callCommand( LAYOUT_INSERT_CMD, 3 );
                            }
                        );
                    }
                 );

               expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><table style="width: 100%;" type="layout"><colgroup><col style="width: 33.333333333333336%;"><col style="width: 33.333333333333336%;"><col style="width: 33.333333333333336%;"></colgroup><tbody><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr></tbody></table></div></div></div></div>');
            }
        );

        test("Layout Delete - Command",
            async () => {
                const editorCtx = createEditorContext();

                const {container} = ReactTest.render(TestEditor([], [<TestPlugin key={pluginKey++} setContextEditor={(editor: LexicalEditor) => {editorCtx.setEditor(editor);}}/>]));
                const {editor} = editorCtx;

                await ReactTest.act( 
                    async () => {
                        editor.update(
                            () => {
                                $callCommand( LAYOUT_INSERT_CMD, 4 );
                            }
                        );
                    }
                 );

                 expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><table style="width: 100%;" type="layout"><colgroup><col style="width: 25%;"><col style="width: 25%;"><col style="width: 25%;"><col style="width: 25%;"></colgroup><tbody><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr></tbody></table></div></div></div></div>');

                 await ReactTest.act( 
                    async () => {
                        editor.update(
                            () => {
                                $callCommand( TABLE_LAYOUT_REMOVE_SELECTED_CMD, undefined );
                            }
                        );
                    }
                 );

               expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"></div></div></div></div>');
            }
        );

        test("Layout Delete Column - Command",
            async () => {
                const editorCtx = createEditorContext();

                const {container} = ReactTest.render(TestEditor([], [<TestPlugin key={pluginKey++} setContextEditor={(editor: LexicalEditor) => {editorCtx.setEditor(editor);}}/>]));
                const {editor} = editorCtx;

                await ReactTest.act( 
                    async () => {
                        editor.update(
                            () => {
                                $callCommand( LAYOUT_INSERT_CMD, 4 );
                            }
                        );
                    }
                 );

                 expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><table style="width: 100%;" type="layout"><colgroup><col style="width: 25%;"><col style="width: 25%;"><col style="width: 25%;"><col style="width: 25%;"></colgroup><tbody><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr></tbody></table></div></div></div></div>');

                 let layoutNode: LayoutNode | null = null;
                 await ReactTest.act( 
                    async () => {
                        editor.update(
                            () => {
                                const lexicalNode = $getRoot().getFirstChild();
                                expect($isExtendedTableNode(lexicalNode)).toBeTruthy();
                                layoutNode = lexicalNode as LayoutNode;

                                const tableRow = layoutNode.getTableBodyNode().getChildAtIndex(0) as TableRowNode;
                                const tableCell = tableRow.getChildAtIndex(2) as ExtendedTableCellNode;
                                tableCell.select();

                                $callCommand(TABLE_LAYOUT_COLUMN_REMOVE_CMD, undefined);
                            }
                        );
                    }
                 );

               expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><table style="width: 100%;" type="layout"><colgroup><col style="width: 33.33333333333333%;"><col style="width: 33.33333333333333%;"><col style="width: 33.33333333333333%;"></colgroup><tbody><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr></tbody></table></div></div></div></div>');

               await ReactTest.act( 
                async () => {
                    editor.update(
                        () => {
                            const lexicalNode = $getRoot().getFirstChild();
                            expect($isExtendedTableNode(lexicalNode)).toBeTruthy();
                            layoutNode = lexicalNode as LayoutNode;

                            const tableRow = layoutNode.getTableBodyNode().getChildAtIndex(0) as TableRowNode;
                            const tableCell = tableRow.getChildAtIndex(2) as ExtendedTableCellNode;
                            tableCell.select();

                            $callCommand(TABLE_LAYOUT_COLUMN_REMOVE_CMD, undefined);
                        }
                    );
                }
             );

                expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><table style="width: 100%;" type="layout"><colgroup><col style="width: 50%;"><col style="width: 50%;"></colgroup><tbody><tr><td><p><br></p></td><td><p><br></p></td></tr></tbody></table></div></div></div></div>');

                await ReactTest.act( 
                    async () => {
                        editor.update(
                            () => {
                                const lexicalNode = $getRoot().getFirstChild();
                                expect($isExtendedTableNode(lexicalNode)).toBeTruthy();
                                layoutNode = lexicalNode as LayoutNode;
    
                                const tableRow = layoutNode.getTableBodyNode().getChildAtIndex(0) as TableRowNode;
                                const tableCell = tableRow.getChildAtIndex(0) as ExtendedTableCellNode;
                                tableCell.select();
    
                                $callCommand(TABLE_LAYOUT_COLUMN_REMOVE_CMD, undefined);
                            }
                        );
                    }
                 );
    
                    expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><table style="width: 100%;" type="layout"><colgroup><col style="width: 100%;"></colgroup><tbody><tr><td><p><br></p></td></tr></tbody></table></div></div></div></div>');
            }
        );
    }
);