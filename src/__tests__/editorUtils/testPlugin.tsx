import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalEditor } from "lexical";
import { useEffect } from "react";

interface TestPluginProps {
    setContextEditor: (editor: LexicalEditor) => void;
}

export const TestPlugin = ({setContextEditor}: TestPluginProps ) => {
    const [editor] = useLexicalComposerContext();
    useEffect( 
        () => {
            setContextEditor(editor);
        },
        [editor, setContextEditor]
    );
    return null;
  };