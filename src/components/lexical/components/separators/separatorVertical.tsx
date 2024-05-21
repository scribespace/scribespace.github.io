import { EditorTheme, getEditorThemeContext } from "../../editorThemeContext";

import './css/separator.css';

export default function SeparatorVertical() {
    const editorTheme: EditorTheme = getEditorThemeContext();
    function getTheme() {
        return editorTheme.separatorTheme!;
    }
    return <div className={getTheme().separatorVertical} />;
}
