import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";

export function useEditorEditable() {
  const [editor] = useLexicalComposerContext();
  
  const [isEditable, setIsEditable] = useState( editor ? editor.isEditable() : false );

  useEffect(() => {
    if (!editor) return;

    return editor.registerEditableListener((editable) => {
      setIsEditable(editable);
    });
  }, [editor]);

  return isEditable;
}
