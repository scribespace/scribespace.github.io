import { useMainThemeContext } from "@src/mainThemeContext";
import { MainTheme } from "@src/theme";
import { useMemo } from "react";
import './css/separator.css';

export default function SeparatorHorizontalStrong() {
    const { editorTheme }: MainTheme = useMainThemeContext();
    const theme = useMemo(()=> {
        return editorTheme.separatorTheme.separatorHorizontalStrong;
    },[editorTheme.separatorTheme.separatorHorizontalStrong]);

    return <div className={theme} />;
}
