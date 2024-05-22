import { useMainThemeContext } from '@src/mainThemeContext';
import { MainTheme } from '@src/theme';
import { variableExistsOrThrow } from '@src/utils/common';
import { useMemo } from 'react';
import './css/separator.css';

export default function SeparatorVerticalStrong() {
    const { editorTheme }: MainTheme = useMainThemeContext();
    const theme = useMemo(()=> {
        variableExistsOrThrow(editorTheme?.separatorTheme?.separatorVerticalStrong);
        return editorTheme?.separatorTheme?.separatorVerticalStrong;
    },[editorTheme?.separatorTheme?.separatorVerticalStrong]);

    return <div className={theme} />;
}