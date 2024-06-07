import { $getMainEditor, appGlobals } from "@/system/appGlobals";
import { useEffect, useMemo, useState } from "react";

export function useEditorEditable() {
  const editor = useMemo(
    () => $getMainEditor(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appGlobals.editorObject]
  );

  const [isEditable, setIsEditable] = useState(
    editor ? editor.isEditable() : false
  );

  useEffect(() => {
    if (!editor) return;

    return editor.registerEditableListener((editable) => {
      setIsEditable(editable);
    });
  }, [editor]);

  return isEditable;
}
