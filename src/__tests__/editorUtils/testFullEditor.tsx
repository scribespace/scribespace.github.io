
import { Actions } from '@/components/actions/actions';
import { MainThemeContext } from '@/mainThemeContext';
import { EditorInput } from '@editor/components/editorInput/editorInput';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { TEST_THEME_DEFAULT } from '../helpers/testTheme';
import { EDITOR_NODES, editorPlugins } from '@systems/editorManager/editorEnv';

export const TestFullEditor = (plugins?: React.ReactNode[]) => {
      const initialConfig = {
      namespace: "test",
      theme: TEST_THEME_DEFAULT.editorTheme.editorInputTheme,
      nodes: EDITOR_NODES,
      onError: (e: Error) => {throw e;}
    };   

  return (
    <MainThemeContext.Provider value={TEST_THEME_DEFAULT}>
      <Actions />
        <div id="editor-view">
          <LexicalComposer initialConfig={initialConfig}>
            {editorPlugins()}
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
