import { useEditorEditable } from "@/hooks/useEditorEditable";
import { useMainThemeContext } from "@/mainThemeContext";
import { appGlobals } from "@/system/appGlobals";
import { MainTheme } from "@/theme";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useEffect } from "react";

export function EditorInput() {
  const [editor] = useLexicalComposerContext();

  const isEditorEditable = useEditorEditable();

  const { editorTheme }: MainTheme = useMainThemeContext();

  useEffect(() => {
    appGlobals.editorObject = editor;
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
