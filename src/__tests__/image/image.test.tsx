import '../helpers/workerMock';
import '../helpers/cryptoMock';
import '../helpers/fileSystemMock';
import '../helpers/imageWebWorkerMock';

import { $createImageNode, ImageNode } from '@editor/nodes/image';
import { ImagePlugin } from '@editor/plugins/imagePlugin';
import { INSERT_IMAGES_CMD } from '@editor/plugins/imagePlugin/imageCommands';
import { $callCommand } from '@systems/commandsManager/commandsManager';
import { $insertNodes, Klass, LexicalEditor, LexicalNode, LexicalNodeReplacement } from "lexical";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { createEditorContext } from "../editorUtils/editorContext";
import { DefaultTestEditor } from '../editorUtils/testEditor';
import { TestPlugin } from "../editorUtils/testPlugin";
import { ReactTest, reactSetup } from "../helpers/prepareReact";

afterAll(
    () => {
        vi.clearAllMocks();
        vi.useRealTimers();
    }
);

beforeAll(
  async () => {
    const date = new Date(0);
    vi.useFakeTimers();
    vi.setSystemTime(date);
  }
);

reactSetup();


describe('Image:',
  async () => {
        const TestEditor = (nodes?: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>, plugins?: React.ReactNode[]) => 
            DefaultTestEditor( 
            [
                ImageNode,
                ...nodes || []
            ],
            [
                <ImagePlugin key={0}/>,
                ...(plugins||[]),
            ]
         );

    test('Upload',
        async () => {
        const editorCtx = createEditorContext();
        const {container} = ReactTest.render(TestEditor([], [<TestPlugin key={1} setContextEditor={(editor: LexicalEditor) => {editorCtx.setEditor(editor);}}/>]));
        const {editor} = editorCtx;

        let imageNode: LexicalNode | null = null;
        ReactTest.act(() => {
            $callCommand(INSERT_IMAGES_CMD, [new Blob(['test'], {type: 'image/png'})]);

            editor.registerNodeTransform(ImageNode, (node: ImageNode) => {
                imageNode = node;
            });
        });

        await vi.waitFor( () => { expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><p><span data-lexical-decorator="true"><div class="" style="display: inline-block; overflow: hidden; max-width: 100%;"><img class="image-element-default pulsing" style="display: block;" src="https://id:/images/scribe-space-id-image-00.undefined.com" alt="No image https://id:/images/scribe-space-id-image-00.undefined.com"></div></span><br></p></div></div></div></div>'); } );
        await vi.waitFor( () => { expect(JSON.stringify(imageNode?.exportJSON())).toBe('{"src":"https://id:/images/scribe-space-id-image-00.undefined.com","filePath":"/images/scribe-space-id-image-00.undefined","type":"image","version":1}'); } );
      }
    );

    test('Preload',
        async () => {
        const editorCtx = createEditorContext();
        const {container} = ReactTest.render(TestEditor([], [<TestPlugin key={1} setContextEditor={(editor: LexicalEditor) => {editorCtx.setEditor(editor);}}/>]));
        const {editor} = editorCtx;

        let imageJSON = '';
        ReactTest.act(() => {
            editor.registerNodeTransform(ImageNode, (node: ImageNode) => {
                imageJSON = JSON.stringify(node.exportJSON());
            });

            editor.update(
                () => {
                    const imageNode = $createImageNode( -1, 'https://test.com' );
                    $insertNodes([imageNode]);
                }
            );
        });

        await vi.waitFor( () => { expect(imageJSON).toBe('{"src":"https://test.com","filePath":"","type":"image","version":1}'); } );
        await vi.waitFor( () => { expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><p><span data-lexical-decorator="true"><div class="" style="display: inline-block; overflow: hidden; max-width: 100%;"><img class="image-element-default pulsing" style="display: block;" src="https://test.com" alt="No image https://test.com"></div></span><br></p></div></div></div></div>'); } );

        ReactTest.act(() => {
            editor.registerNodeTransform(ImageNode, (node: ImageNode) => {
                imageJSON = JSON.stringify(node.exportJSON());
            });

            editor.update(
                () => {
                    const imageNode = $createImageNode( -1, 'https://test.com' );
                    $insertNodes([imageNode]);
                }
            );
        });

        await vi.waitFor( () => { expect(imageJSON).toBe('{"src":"https://test.com","filePath":"","type":"image","version":1}'); } );
        await vi.waitFor( () => { expect(container.innerHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><p><span data-lexical-decorator="true"><div class="" style="display: inline-block; overflow: hidden; max-width: 100%;"><img class="image-element-default pulsing" style="display: block;" src="https://test.com" alt="No image https://test.com"></div></span><span data-lexical-decorator="true"><div class="" style="display: inline-block; overflow: hidden; max-width: 100%;"><img class="image-element-default pulsing" style="display: block;" src="https://test.com" alt="No image https://test.com"></div></span><br></p></div></div></div></div>'); } );
      }
    );

  }
);