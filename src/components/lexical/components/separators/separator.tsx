
import './css/separator.css';
import { EditorTheme, getEditorThemeContext } from "../../editorThemeContext";

export const SeparatorHorizontalStrong = () => {
    const editorTheme: EditorTheme = getEditorThemeContext()
    function getTheme() {
        return editorTheme.separatorTheme!;
    }
    return <div className={getTheme().separatorHorizontalStrong} />;
};

export const SeparatorHorizontal = () => {
    const editorTheme: EditorTheme = getEditorThemeContext()
    function getTheme() {
        return editorTheme.separatorTheme!;
    }
    return <div className={getTheme().separatorHorizontal} />;
};

export const SeparatorVerticalStrong = () => {
    const editorTheme: EditorTheme = getEditorThemeContext()
    function getTheme() {
        return editorTheme.separatorTheme!;
    }
    return <div className={getTheme().separatorVerticalStrong} />;
};

export const SeparatorVertical = () => {
    const editorTheme: EditorTheme = getEditorThemeContext()
    function getTheme() {
        return editorTheme.separatorTheme!;
    }
    return <div className={getTheme().separatorVertical} />;
};
