import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { useEditorEditable } from "@/views/editor/hooks/useEditorEditable";
import { useDecorators } from "@editor/lexicalHelpers/useDecorators";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { registerRichText } from "@lexical/rich-text";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLayoutEffect } from "react";

export function EditorInput() {
  const isEditorEditable = useEditorEditable();
  const [editor] = useLexicalComposerContext();

  const { editorTheme }: MainTheme = useMainThemeContext();
  const decorators = useDecorators(editor, LexicalErrorBoundary );

  useLayoutEffect(
    () => {
      return registerRichText(editor);
    }, 
    [editor]
    );

  return (
    <>
      <ContentEditable
        className={
          (isEditorEditable ? "" : "disabled ") + editorTheme.editorEditable
        }
        spellCheck={false}
      />
      {decorators}
    </>
  );
}
