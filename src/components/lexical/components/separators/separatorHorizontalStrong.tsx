import { EditorTheme, getEditorThemeContext } from "../../editorThemeContext";

import './css/separator.css';

export default function SeparatorHorizontalStrong() {
    const editorTheme: EditorTheme = getEditorThemeContext();
    function getTheme() {
        return editorTheme.separatorTheme!;
    }
    return <div className={getTheme().separatorHorizontalStrong} />;
}
