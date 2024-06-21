import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { $createParagraphNode, $createTextNode, $getRoot, Klass, LexicalEditor, LexicalNode, LexicalNodeReplacement, TextNode } from "lexical";
import { describe, expect, test } from "vitest";
import { createEditorContext } from "./editor/editorContext";
import { DefaultTestEditor } from "./editor/testEditor";
import { TestPlugin } from "./editor/testPlugin";
import { ReactTest, reactSetup } from "./helpers/prepareReact";
import { FontPlugin } from "@editor/plugins/fontPlugin";

describe("Actions:",
    async () => {
        reactSetup();

        const TestEditor = (nodes?: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>, plugins?: React.ReactNode[]) => 
            DefaultTestEditor( 
            nodes,
            [
                ...(plugins||[])
            ]
         );

        test( "Action: Undo", 
            async () => {
                const editorCtx = createEditorContext();
                const {container} = await ReactTest.render(TestEditor([], 
                    [
                    <TestPlugin key={0} setContextEditor={(editor: LexicalEditor) => {editorCtx.setEditor(editor);}}/>,
                    <HistoryPlugin key={1} />
                    ]
                 ));
                
                const {editor} = editorCtx;

                await ReactTest.act(
                    async () => {
                        await editor.update(
                            () => {
                                const root = $getRoot();
                                const paragraph = $createParagraphNode();
                                const text = $createTextNode("aaaa");
                                
                                paragraph.append(text);
                                root.append(paragraph);
                            }
                        );
                    }
                );
                
                expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><p><br></p><p dir="ltr"><span data-lexical-text="true">aaaa</span></p></div></div></div></div>');
                
               await ReactTest.act(
                () => {
                    const event = new KeyboardEvent('keydown', {key:'Z', ctrlKey: true, bubbles: true} );
                    document.dispatchEvent(event);
                });
                
                expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><p><br></p></div></div></div></div>');
            }
        );

        test( "Action: Bold", 
            async () => {
                const editorCtx = createEditorContext();
                const {container} = await ReactTest.render(TestEditor([], 
                    [
                    <TestPlugin key={0} setContextEditor={(editor: LexicalEditor) => {editorCtx.setEditor(editor);}}/>,
                    <FontPlugin key={1} />
                    ]
                 ));
                
                const {editor} = editorCtx;

                let text: TextNode | null = null;
                await ReactTest.act(
                    async () => {
                        await editor.update(
                            () => {
                                const root = $getRoot();
                                const paragraph = $createParagraphNode();
                                text = $createTextNode("aaaaaaaa");
                                
                                paragraph.append(text);
                                root.append(paragraph);
                            }
                        );
                    }
                );
                
                expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><p><br></p><p dir="ltr"><span data-lexical-text="true">aaaaaaaa</span></p></div></div></div></div>');

               await ReactTest.act(
                () => {
                    editor.update( () => {
                    text!.select(1, 3);
                });
            });
            await ReactTest.act(
                () => {
                    const event = new KeyboardEvent('keydown', {key:'B', ctrlKey: true, bubbles: true} );
                    const editorElement = document.getElementsByClassName("editor-input")[0];
                    editorElement.dispatchEvent(event);
                });
                expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><p><br></p><p dir="ltr"><span data-lexical-text="true">a</span><strong data-lexical-text="true">aa</strong><span data-lexical-text="true">aaaaa</span></p></div></div></div></div>');
            }
        );

        test( "Action: Fonty Style Red", 
            async () => {
                const editorCtx = createEditorContext();
                const {container} = await ReactTest.render(TestEditor([], 
                    [
                    <TestPlugin key={0} setContextEditor={(editor: LexicalEditor) => {editorCtx.setEditor(editor);}}/>,
                    <FontPlugin key={1} />
                    ]
                 ));
                
                const {editor} = editorCtx;

                let text: TextNode | null = null;
                await ReactTest.act(
                    async () => {
                        await editor.update(
                            () => {
                                const root = $getRoot();
                                const paragraph = $createParagraphNode();
                                text = $createTextNode("aaaaaaaa");
                                
                                paragraph.append(text);
                                root.append(paragraph);
                            }
                        );
                    }
                );
                
                expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><p><br></p><p dir="ltr"><span data-lexical-text="true">aaaaaaaa</span></p></div></div></div></div>');

               await ReactTest.act(
                () => {
                    editor.update( () => {
                    text!.select(1, 3);
                });
            });
            await ReactTest.act(
                () => {
                    const event = new KeyboardEvent('keydown', {key:'R', altKey: true, bubbles: true} );
                    const editorElement = document.getElementsByClassName("editor-input")[0];
                    editorElement.dispatchEvent(event);
                });
                expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><p><br></p><p dir="ltr"><span data-lexical-text="true">a</span><strong style="color: red;" data-lexical-text="true">aa</strong><span data-lexical-text="true">aaaaa</span></p></div></div></div></div>');
            }
        );
    }
);