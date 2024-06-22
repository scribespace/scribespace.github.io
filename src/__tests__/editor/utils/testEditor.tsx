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
import { TEST_THEME_DEFAULT } from '../../helpers/testTheme';
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

const getRequiredPlugins = (keyStart: number) => { 
 return [
    <CommandsPlugin key={keyStart++} />,
    <ActionsPlugin key={keyStart++} />,
    <HistoryPlugin key={keyStart++} />,
    <AutoFocusPlugin key={keyStart++} />,
    <FontPlugin key={keyStart++} />,
  ];
};

  export const DefaultTestEditor = 
  (nodes?: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>, plugins?: React.ReactNode[]) => {
      const initialConfig = {
      namespace: "test",
      theme: {},
      nodes: [...REQUIRED_NODES, ...nodes || []],
      onError: (e: Error) => {throw e;}
    };   

  return (
    <MainThemeContext.Provider value={TEST_THEME_DEFAULT}>
      <Actions />
        <div id="editor-view">
          <LexicalComposer initialConfig={initialConfig}>
            {getRequiredPlugins((plugins || []).length)}
            <div>
              <div>
                <EditorInput />
              </div>
            </div>
            {plugins}
          </LexicalComposer>
        </div>
      </MainThemeContext.Provider>
  );
};
