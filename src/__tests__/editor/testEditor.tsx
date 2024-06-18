import * as React from 'react';

import { EditorInput } from '@editor/components/editorInput/editorInput';
import ExtendedTextNode from '@editor/nodes/text';
import { CommandsPlugin } from '@editor/plugins/commandsPlugin/commandsPlugin';
import { FontPlugin } from '@editor/plugins/fontPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { Klass, LexicalEditor, LexicalNode, LexicalNodeReplacement, TextNode, resetRandomKey } from "lexical";
import { beforeEach } from 'vitest';
import { reactEnv } from '../helpers/prepareReact';
import { MainThemeContext } from '@/mainThemeContext';
import { TEST_THEME_DEFAULT } from '../helpers/testTheme';

const REQUIRED_NODES: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> = [
    ExtendedTextNode,
    {
      replace: TextNode,
      withKlass: ExtendedTextNode,
      with: (node: TextNode) => new ExtendedTextNode(node.__text),
    },
];

const REQUIRED_PLUGINS: React.ReactNode = [
    <CommandsPlugin />,
    <HistoryPlugin />,
    <AutoFocusPlugin />,
    <FontPlugin />,

  ];

  export async function createTestEditor(nodes?: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>, plugins?: React.ReactNode) {
    const env = {
      __editor: null as LexicalEditor | null,
      get editor() {
        if (!this.__editor) {
          throw new Error('env.editor not initialized.');
        }
        return this.__editor;
      },
      set editor(editor) {
        this.__editor = editor;
      },
    };

    const TestPlugin = () => {
      [env.editor] = useLexicalComposerContext();
      return null;
    };

    beforeEach(
      () => {
        resetRandomKey();

        const TestEditor = () => {
            const initialConfig = {
              namespace: "test",
              theme: {},
              nodes: [...REQUIRED_NODES, ...nodes || []],
              onError: (e: Error) => {throw e;}
            };   
        
          return (
            <MainThemeContext.Provider value={TEST_THEME_DEFAULT}>
              <LexicalComposer initialConfig={initialConfig}>
                <TestPlugin/>
                {REQUIRED_PLUGINS}
                <div>
                  <div>
                    <EditorInput />
                  </div>
                </div>
                {plugins}
              </LexicalComposer>
            </MainThemeContext.Provider>
          );
        };

        React.act(() => { reactEnv.reactRoot.render(
          <TestEditor/>
        );});
      }
    );

    return env;
  }



  // function TestPlugin() {
  //   // Plugin used just to get our hands on the Editor object
  //   [env.editor] = useLexicalComposerContext();
  //   return null;
  // }



