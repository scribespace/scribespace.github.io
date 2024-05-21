import { EditorTheme, getEditorThemeContext } from "../../editorThemeContext";

import './css/separator.css';

export default function SeparatorVerticalStrong() {
    const editorTheme: EditorTheme = getEditorThemeContext();
    function getTheme() {
        return editorTheme.separatorTheme!;
    }
    return <div className={getTheme().separatorVerticalStrong} />;
}
