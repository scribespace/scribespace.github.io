import { LexicalEditor, resetRandomKey } from "lexical";
import { beforeEach } from 'vitest';


export function createEditorContext() {
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
    setEditor(editor: LexicalEditor) {
      this.editor = editor;
    }
  };

  beforeEach(
    () => {
      resetRandomKey();
    }
  );

  return env;
}
