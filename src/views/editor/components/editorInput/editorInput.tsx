import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useEffect, useState } from "react";

export function EditorInput() {
  const [editor] = useLexicalComposerContext();
  const [isEditorEditable, setIsEditorEditable] = useState(() =>
    editor.isEditable()
  );
  const { editorTheme }: MainTheme = useMainThemeContext();

  useEffect(() => {
    return editor.registerEditableListener((editable) => {
      setIsEditorEditable(editable);
    });
  }, [editor]);

  return (
    <RichTextPlugin
      contentEditable={
        <ContentEditable
          className={
            (isEditorEditable ? "" : "disabled ") + editorTheme.editorEditable
          }
          spellCheck={false}
        />
      }
      placeholder={null}
      ErrorBoundary={LexicalErrorBoundary}
    />
  );
}
