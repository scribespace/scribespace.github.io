import { EditorTheme, useEditorThemeContext } from "../../editorThemeContext";

import './css/separator.css';

export default function SeparatorVerticalStrong() {
    const editorTheme: EditorTheme = useEditorThemeContext();
    function getTheme() {
        return editorTheme.separatorTheme!;
    }
    return <div className={getTheme().separatorVerticalStrong} />;
}
