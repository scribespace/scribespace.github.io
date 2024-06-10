import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { useEditorEditable } from "@/views/editor/hooks/useEditorEditable";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

export function EditorInput() {
  const isEditorEditable = useEditorEditable();

  const { editorTheme }: MainTheme = useMainThemeContext();


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
