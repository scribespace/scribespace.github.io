import * as React from 'react';

import { MainThemeContext } from '@/mainThemeContext';
import { EditorInput } from '@editor/components/editorInput/editorInput';
import ExtendedTextNode from '@editor/nodes/text';
import { CommandsPlugin } from '@editor/plugins/commandsPlugin/commandsPlugin';
import { FontPlugin } from '@editor/plugins/fontPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { Klass, LexicalNode, LexicalNodeReplacement, TextNode } from "lexical";
import { TEST_THEME_DEFAULT } from '../helpers/testTheme';
import { ActionsPlugin } from '@editor/plugins/actionsPlugin/actionsPlugin';
import { Actions } from '@/components/actions/actions';

const REQUIRED_NODES: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> = [
    ExtendedTextNode,
    {
      replace: TextNode,
      withKlass: ExtendedTextNode,
      with: (node: TextNode) => new ExtendedTextNode(node.__text),
    },
];

let pluginKey = 0;
const REQUIRED_PLUGINS: React.ReactNode = [
    <CommandsPlugin key={pluginKey++} />,
    <ActionsPlugin key={pluginKey++} />,
    <HistoryPlugin key={pluginKey++} />,
    <AutoFocusPlugin key={pluginKey++} />,
    <FontPlugin key={pluginKey++} />,
  ];

  export const DefaultTestEditor = 
  (nodes?: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>, plugins?: React.ReactNode) => {
    const initialConfig = {
      namespace: "test",
      theme: {},
      nodes: [...REQUIRED_NODES, ...nodes || []],
      onError: (e: Error) => {throw e;}
    };   

  return (
    <div id="editor-view">
      <Actions />
      <MainThemeContext.Provider value={TEST_THEME_DEFAULT}>
        <LexicalComposer initialConfig={initialConfig}>
          {REQUIRED_PLUGINS}
          <div>
            <div>
              <EditorInput />
            </div>
          </div>
          {plugins}
        </LexicalComposer>
      </MainThemeContext.Provider>
    </div>
  );
};
