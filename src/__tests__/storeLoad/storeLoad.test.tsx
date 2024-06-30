import '../helpers/workerMock';

import { $generateHtmlFromNodes } from '@lexical/html';
import { editorHtmlToJSON } from "@systems/editorManager";
import { LexicalEditor } from "lexical";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { createEditorContext } from "../editorUtils/editorContext";
import { createTestEditroState } from '../editorUtils/testEditorState';
import { TestFullEditor } from "../editorUtils/testFullEditor";
import { TestPlugin } from "../editorUtils/testPlugin";
import { ReactTest, reactSetup } from "../helpers/prepareReact";
import '../helpers/workerMock';

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


describe('StoreLoad:',
  async () => {
    test('Save = Load',
        async () => {
        const editorCtx = createEditorContext();
        const {container} = ReactTest.render(TestFullEditor([<TestPlugin key={-1} setContextEditor={(editor: LexicalEditor) => {editorCtx.setEditor(editor);}}/>]));
        const {editor} = editorCtx;

        await createTestEditroState(editor);

        const originalHTML = container.innerHTML;
        const originalJSON = JSON.stringify(editor.getEditorState());
        expect(originalHTML).toBe('<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><p class="editor-paragraph ltr" dir="ltr"><span class="editor-text" data-lexical-text="true">testestest</span></p><p class="editor-paragraph ltr" dir="ltr"><strong class="editor-text editor-text-bold" data-lexical-text="true">testestest2</strong></p><p class="editor-paragraph"><a href="https://hello.com" class="link ltr" dir="ltr"><span class="editor-text" data-lexical-text="true">zelda</span></a></p><table class="editor-layout" style="width: 100%;" type="layout"><colgroup><col style="width: 33.333333333333336%;"><col style="width: 33.333333333333336%;"><col style="width: 33.333333333333336%;"></colgroup><tbody><tr class="editor-table-row"><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td></tr></tbody></table><table class="editor-table" style="width: 100%;"><colgroup><col style="width: 33.333333333333336%;"><col style="width: 33.333333333333336%;"><col style="width: 33.333333333333336%;"></colgroup><tbody><tr class="editor-table-row"><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td></tr><tr class="editor-table-row"><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td></tr><tr class="editor-table-row"><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td></tr><tr class="editor-table-row"><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td></tr></tbody></table><ul class="editor-ul"><li value="1" class="editor-listItem ltr" dir="ltr"><span class="editor-text" data-lexical-text="true">list0</span></li><li value="2" class="editor-listItem ltr" dir="ltr"><span class="editor-text" data-lexical-text="true">list1</span></li></ul><hr class="editor-hr" data-lexical-decorator="true"><p class="editor-paragraph ltr" dir="ltr"><p class="outerTag" type="date" data-lexical-text="true"><strong class="editor-text editor-text-bold" style="">(Thursday) 1.1.1970</strong></p></p><figure style="page-break-after: always;" type="page-break" data-lexical-decorator="true" class="editor-page-break-filler"></figure></div></div></div><div style="display: inherit;"><div style="position: fixed; left: -1px; top: -1px;"><div></div></div></div></div>');
        expect(originalJSON).toBe('{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"testestest","type":"extended-text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"testestest2","type":"extended-text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"zelda","type":"extended-text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":null,"target":null,"title":null,"url":"https://hello.com"}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"children":[{"children":[{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1}],"direction":"ltr","format":"","indent":0,"type":"tablerow","version":1}],"direction":"ltr","format":"","indent":0,"type":"layout-body","version":1}],"direction":"ltr","format":"","indent":0,"type":"layout","version":1,"columnsWidths":[{"value":-1,"unit":"px"},{"value":-1,"unit":"px"},{"value":-1,"unit":"px"}]},{"children":[{"children":[{"children":[{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1}],"direction":"ltr","format":"","indent":0,"type":"tablerow","version":1},{"children":[{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1}],"direction":"ltr","format":"","indent":0,"type":"tablerow","version":1},{"children":[{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1}],"direction":"ltr","format":"","indent":0,"type":"tablerow","version":1},{"children":[{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1}],"direction":"ltr","format":"","indent":0,"type":"tablerow","version":1}],"direction":"ltr","format":"","indent":0,"type":"table-body","version":1}],"direction":"ltr","format":"","indent":0,"type":"extended-table","version":1,"columnsWidths":[{"value":-1,"unit":"px"},{"value":-1,"unit":"px"},{"value":-1,"unit":"px"}]},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"list0","type":"extended-text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"list1","type":"extended-text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"type":"horizontalrule","version":1},{"children":[{"detail":0,"format":1,"mode":"token","style":"fontSize: 13pt","text":"(Thursday) 1.1.1970","type":"date","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"type":"page-break","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}');
        await ReactTest.act( 
          async () => {
            editor.update(
              () => {
                const editorState = editor.parseEditorState(JSON.parse(originalJSON));
                editor.setEditorState(editorState);
              }
            );
          }
        );
        expect(originalHTML).toBe(originalHTML);
      }
    );

    test('HTML to Editor',
      async () => {
        const html = '<div id="editor-view"><div><div><div class="editor-input section-to-print" contenteditable="true" role="textbox" spellcheck="false" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><p class="editor-paragraph ltr" dir="ltr"><span class="editor-text" data-lexical-text="true">testestest</span></p><p class="editor-paragraph ltr" dir="ltr"><strong class="editor-text editor-text-bold" data-lexical-text="true">testestest2</strong></p><p class="editor-paragraph"><a href="https://hello.com" class="link ltr" dir="ltr"><span class="editor-text" data-lexical-text="true">zelda</span></a></p><table class="editor-layout" style="width: 100%;" type="layout"><colgroup><col style="width: 33.333333333333336%;"><col style="width: 33.333333333333336%;"><col style="width: 33.333333333333336%;"></colgroup><tbody><tr class="editor-table-row"><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td></tr></tbody></table><table class="editor-table" style="width: 100%;"><colgroup><col style="width: 33.333333333333336%;"><col style="width: 33.333333333333336%;"><col style="width: 33.333333333333336%;"></colgroup><tbody><tr class="editor-table-row"><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td></tr><tr class="editor-table-row"><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td></tr><tr class="editor-table-row"><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td></tr><tr class="editor-table-row"><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell"><p class="editor-paragraph"><br></p></td></tr></tbody></table><ul class="editor-ul"><li value="1" class="editor-listItem ltr" dir="ltr"><span class="editor-text" data-lexical-text="true">list0</span></li><li value="2" class="editor-listItem ltr" dir="ltr"><span class="editor-text" data-lexical-text="true">list1</span></li></ul><hr class="editor-hr" data-lexical-decorator="true"><p class="editor-paragraph ltr" dir="ltr"><p class="outerTag" type="date" data-lexical-text="true"><strong class="editor-text editor-text-bold" style="">(Saturday) 19.12.1998</strong></p></p><figure style="page-break-after: always;" type="page-break" data-lexical-decorator="true" class="editor-page-break-filler"></figure></div></div></div><div style="display: inherit;"><div style="position: fixed; left: -1px; top: -1px;"><div></div></div></div></div>';
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, "text/html");

        const json = await editorHtmlToJSON(dom);
        expect(json).toBe('{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"testestest","type":"extended-text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"testestest2","type":"extended-text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"zelda","type":"extended-text","version":1}],"direction":null,"format":"","indent":0,"type":"link","version":1,"rel":null,"target":null,"title":null,"url":"https://hello.com"}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"children":[{"children":[{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1}],"direction":null,"format":"","indent":0,"type":"tablerow","version":1}],"direction":null,"format":"","indent":0,"type":"table-body","version":1}],"direction":null,"format":"","indent":0,"type":"layout","version":1,"columnsWidths":[{"value":33.333333333333336,"unit":"%"},{"value":33.333333333333336,"unit":"%"},{"value":33.333333333333336,"unit":"%"}]},{"children":[{"children":[{"children":[{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1}],"direction":null,"format":"","indent":0,"type":"tablerow","version":1},{"children":[{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1}],"direction":null,"format":"","indent":0,"type":"tablerow","version":1},{"children":[{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1}],"direction":null,"format":"","indent":0,"type":"tablerow","version":1},{"children":[{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1}],"direction":null,"format":"","indent":0,"type":"tablerow","version":1}],"direction":null,"format":"","indent":0,"type":"table-body","version":1}],"direction":null,"format":"","indent":0,"type":"extended-table","version":1,"columnsWidths":[{"value":33.333333333333336,"unit":"%"},{"value":33.333333333333336,"unit":"%"},{"value":33.333333333333336,"unit":"%"}]},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"list0","type":"extended-text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"list1","type":"extended-text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"type":"horizontalrule","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":1,"mode":"token","style":"fontSize: 13pt","text":"(Saturday) 19.12.1998","type":"date","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"type":"page-break","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"root","version":1}}');
      }
    );

    test('Editor to HTML to Editor',
      async () => {
        const editorCtx = createEditorContext();
        ReactTest.render(TestFullEditor([<TestPlugin key={-1} setContextEditor={(editor: LexicalEditor) => {editorCtx.setEditor(editor);}}/>]));
        const {editor} = editorCtx;

        await createTestEditroState(editor);

        let html = '';
        await ReactTest.act( 
          async () => {
              editor.update(
                  () => {
                    html = $generateHtmlFromNodes(editor);
                  }
                );
            }
        );
        expect(html).toBe('<p class="editor-paragraph" dir="ltr"><span class="editor-text" style="white-space: pre-wrap;">testestest</span></p><p class="editor-paragraph" dir="ltr"><b><strong class="editor-text editor-text-bold" style="white-space: pre-wrap;">testestest2</strong></b></p><p class="editor-paragraph" dir="ltr"><a href="https://hello.com" class="link"><span class="editor-text" style="white-space: pre-wrap;">zelda</span></a></p><table class="editor-layout" style="width: 100%;" type="layout"><colgroup><col style="width: 33.333333333333336%;"><col style="width: 33.333333333333336%;"><col style="width: 33.333333333333336%;"></colgroup><tbody><tr class="editor-table-row"><td class="editor-table-cell" style="border: 1px solid black; vertical-align: top; text-align: start;"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell" style="border: 1px solid black; vertical-align: top; text-align: start;"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell" style="border: 1px solid black; vertical-align: top; text-align: start;"><p class="editor-paragraph"><br></p></td></tr></tbody></table><table class="editor-table" style="width: 100%;"><colgroup><col style="width: 33.333333333333336%;"><col style="width: 33.333333333333336%;"><col style="width: 33.333333333333336%;"></colgroup><tbody><tr class="editor-table-row"><td class="editor-table-cell" style="border: 1px solid black; vertical-align: top; text-align: start;"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell" style="border: 1px solid black; vertical-align: top; text-align: start;"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell" style="border: 1px solid black; vertical-align: top; text-align: start;"><p class="editor-paragraph"><br></p></td></tr><tr class="editor-table-row"><td class="editor-table-cell" style="border: 1px solid black; vertical-align: top; text-align: start;"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell" style="border: 1px solid black; vertical-align: top; text-align: start;"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell" style="border: 1px solid black; vertical-align: top; text-align: start;"><p class="editor-paragraph"><br></p></td></tr><tr class="editor-table-row"><td class="editor-table-cell" style="border: 1px solid black; vertical-align: top; text-align: start;"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell" style="border: 1px solid black; vertical-align: top; text-align: start;"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell" style="border: 1px solid black; vertical-align: top; text-align: start;"><p class="editor-paragraph"><br></p></td></tr><tr class="editor-table-row"><td class="editor-table-cell" style="border: 1px solid black; vertical-align: top; text-align: start;"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell" style="border: 1px solid black; vertical-align: top; text-align: start;"><p class="editor-paragraph"><br></p></td><td class="editor-table-cell" style="border: 1px solid black; vertical-align: top; text-align: start;"><p class="editor-paragraph"><br></p></td></tr></tbody></table><ul class="editor-ul"><li value="1" class="editor-listItem"><span class="editor-text" style="white-space: pre-wrap;">list0</span></li><li value="2" class="editor-listItem"><span class="editor-text" style="white-space: pre-wrap;">list1</span></li></ul><hr><p class="editor-paragraph" dir="ltr"><b><p class="outerTag" type="date" style="white-space: pre-wrap;"><strong class="editor-text editor-text-bold" style="">(Thursday) 1.1.1970</strong></p></b></p><figure style="page-break-after: always;" type="page-break"></figure>');

        const parser = new DOMParser();
        const dom = parser.parseFromString(html, "text/html");

        const json = await editorHtmlToJSON(dom);
        expect(json).toBe('{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"testestest","type":"extended-text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"testestest2","type":"extended-text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"zelda","type":"extended-text","version":1}],"direction":null,"format":"","indent":0,"type":"link","version":1,"rel":null,"target":null,"title":null,"url":"https://hello.com"}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"children":[{"children":[{"children":[{"children":[],"direction":null,"format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1}],"direction":null,"format":"","indent":0,"type":"tablerow","version":1}],"direction":null,"format":"","indent":0,"type":"table-body","version":1}],"direction":null,"format":"","indent":0,"type":"layout","version":1,"columnsWidths":[{"value":33.333333333333336,"unit":"%"},{"value":33.333333333333336,"unit":"%"},{"value":33.333333333333336,"unit":"%"}]},{"children":[{"children":[{"children":[{"children":[{"children":[],"direction":null,"format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1}],"direction":null,"format":"","indent":0,"type":"tablerow","version":1},{"children":[{"children":[{"children":[],"direction":null,"format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1}],"direction":null,"format":"","indent":0,"type":"tablerow","version":1},{"children":[{"children":[{"children":[],"direction":null,"format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1}],"direction":null,"format":"","indent":0,"type":"tablerow","version":1},{"children":[{"children":[{"children":[],"direction":null,"format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[],"direction":null,"format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"extended-table-cell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1}],"direction":null,"format":"","indent":0,"type":"tablerow","version":1}],"direction":null,"format":"","indent":0,"type":"table-body","version":1}],"direction":null,"format":"","indent":0,"type":"extended-table","version":1,"columnsWidths":[{"value":33.333333333333336,"unit":"%"},{"value":33.333333333333336,"unit":"%"},{"value":33.333333333333336,"unit":"%"}]},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"list0","type":"extended-text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"list1","type":"extended-text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"type":"horizontalrule","version":1},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":1,"mode":"token","style":"fontSize: 13pt","text":"(Thursday) 1.1.1970","type":"date","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"type":"page-break","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}');
      }
    );
  }
);