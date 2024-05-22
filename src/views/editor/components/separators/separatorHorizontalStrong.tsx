import { useMainThemeContext } from "@src/mainThemeContext";
import { MainTheme } from "@src/theme";
import { variableExistsOrThrow } from "@src/utils/common";
import { useMemo } from "react";
import './css/separator.css';

export default function SeparatorHorizontalStrong() {
    const { editorTheme }: MainTheme = useMainThemeContext();
    const theme = useMemo(()=> {
        variableExistsOrThrow(editorTheme?.separatorTheme?.separatorHorizontalStrong);
        return editorTheme?.separatorTheme?.separatorHorizontalStrong;
    },[editorTheme?.separatorTheme?.separatorHorizontalStrong]);

    return <div className={theme} />;
}
