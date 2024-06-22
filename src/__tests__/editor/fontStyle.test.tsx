import { CONTROLLED_TEXT_INSERTION_CMD, FORMAT_TEXT_CMD, KEY_ENTER_CMD } from "@editor/plugins/commandsPlugin/editorCommands";
import { CLEAR_FONT_STYLE_CMD, SET_FONT_SIZE_CMD } from "@editor/plugins/fontPlugin/fontCommands";
import { $callCommand } from "@systems/commandsManager/commandsManager";
import { $createRangeSelection, $getRoot, $setSelection, Klass, LexicalEditor, LexicalNode, LexicalNodeReplacement } from "lexical";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { createEditorContext } from "./utils/editorContext";
import { DefaultTestEditor } from "./utils/testEditor";
import { TestPlugin } from "./utils/testPlugin";
import { ReactTest, reactSetup } from "../helpers/prepareReact";

describe("Font Style:",
    async () => {
        reactSetup();

        const TestEditor = (nodes?: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>, plugins?: React.ReactNode[]) => 
            DefaultTestEditor( 
            nodes,
            [
                ...(plugins||[])
            ]
         );

         beforeAll( 
            () =>{
               
         document.createRange = vi.fn(
            () => {
                const range = new Range();

                range.getBoundingClientRect = vi.fn( () => {return {left: 0, top: 0, width: 1, height: 1} as DOMRect; });

                return range;
            }
         );

         const oldGetSelection = window.getSelection;

         window.getSelection = vi.fn(
            () => {
               const selection = oldGetSelection();
               if ( selection ) selection.getRangeAt = () => {return document.createRange();};
               return selection;
            }
         );
          
        }
    );

    afterAll(
        () => {
            vi.clearAllMocks();
        }
    );
         

        test( "Font Style - Keep Style", 
            async () => {
                const editorCtx = createEditorContext();
                const {container} = await ReactTest.render(TestEditor([], 
                    [
                    <TestPlugin key={0} setContextEditor={(editor: LexicalEditor) => {editorCtx.setEditor(editor);}}/>,
                    ]
                 ));
                
                await ReactTest.act(
                    async () => {
                        $callCommand(SET_FONT_SIZE_CMD, '15pt');
                        $callCommand(FORMAT_TEXT_CMD, 'bold');
                        $callCommand(CONTROLLED_TEXT_INSERTION_CMD, 'B');
                    }
                );
                
                expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><p dir="ltr"><strong style="font-size: 15pt;" data-lexical-text="true">B</strong></p></div></div></div></div>');
                
                await ReactTest.act(
                    async () => {
                        $callCommand(KEY_ENTER_CMD, null);
                        $callCommand(KEY_ENTER_CMD, null);
                        $callCommand(CONTROLLED_TEXT_INSERTION_CMD, 'B');
                    }
                );
        
                expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><p dir="ltr"><strong style="font-size: 15pt;" data-lexical-text="true">B</strong></p><p><br></p><p dir="ltr"><strong style="font-size: 15pt;" data-lexical-text="true">B</strong></p></div></div></div></div>');
            }
        );

        test( 'Font Style - End Clear Style',
            async () => {
                const editorCtx = createEditorContext();
                const {container} = await ReactTest.render(TestEditor([], 
                    [
                    <TestPlugin key={0} setContextEditor={(editor: LexicalEditor) => {editorCtx.setEditor(editor);}}/>,
                    ]
                 ));
                

                await ReactTest.act(
                    async () => {
                        $callCommand(SET_FONT_SIZE_CMD, '15pt');
                        $callCommand(CONTROLLED_TEXT_INSERTION_CMD, 'B');
                    }
                );
                
                expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><p dir="ltr"><span style="font-size: 15pt;" data-lexical-text="true">B</span></p></div></div></div></div>');


                await ReactTest.act(
                    async () => {
                        $callCommand(CLEAR_FONT_STYLE_CMD, undefined);
                        $callCommand(CONTROLLED_TEXT_INSERTION_CMD, 'B');
                    }
                );
                
                expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><p dir="ltr"><span style="font-size: 15pt;" data-lexical-text="true">B</span><span style="" data-lexical-text="true">B</span></p></div></div></div></div>');
            }
         );

         test( 'Font Style - Clear Format',
            async () => {
                const editorCtx = createEditorContext();
                const {container} = await ReactTest.render(TestEditor([], 
                    [
                    <TestPlugin key={0} setContextEditor={(editor: LexicalEditor) => {editorCtx.setEditor(editor);}}/>,
                    ]
                 ));
                 const {editor} = editorCtx;
                

                await ReactTest.act(
                    async () => {
                        $callCommand(SET_FONT_SIZE_CMD, '15pt');
                        $callCommand(FORMAT_TEXT_CMD, 'bold');
                        $callCommand(CONTROLLED_TEXT_INSERTION_CMD, 'BBBBBBBBBBB');

                        $callCommand(CLEAR_FONT_STYLE_CMD, undefined);
                        $callCommand(CONTROLLED_TEXT_INSERTION_CMD, 'bbbbbbbbbb');
                    }
                );
                
                expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><p dir="ltr"><strong style="font-size: 15pt;" data-lexical-text="true">BBBBBBBBBBB</strong><span style="" data-lexical-text="true">bbbbbbbbbb</span></p></div></div></div></div>');

                await ReactTest.act(
                    async () => {
                        editor.update(
                            () => {
                                const textNodes = $getRoot().getAllTextNodes();
                                const selection = $createRangeSelection();
                                selection.anchor.set( textNodes[0].getKey(), 3, "text" );
                                selection.focus.set( textNodes[1].getKey(), 3, "text" );
                                $setSelection(selection);

                                $callCommand(CLEAR_FONT_STYLE_CMD, undefined);
                            }
                        );
                    }
                );
              
                
                expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><p dir="ltr"><strong style="font-size: 15pt;" data-lexical-text="true">BBB</strong><span data-lexical-text="true">BBBBBBBBbbb</span><span style="" data-lexical-text="true">bbbbbbb</span></p></div></div></div></div>');
            }
         );
    }
);