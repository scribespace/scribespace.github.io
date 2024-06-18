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

  export const TestEditor = 
  (nodes?: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>, plugins?: React.ReactNode) => {
    const initialConfig = {
      namespace: "test",
      theme: {},
      nodes: [...REQUIRED_NODES, ...nodes || []],
      onError: (e: Error) => {throw e;}
    };   

  return (
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
  );
};
