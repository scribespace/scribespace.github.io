import { useMainThemeContext } from '@src/mainThemeContext';
import { MainTheme } from '@src/theme';
import { useMemo } from 'react';
import { variableExistsOrThrow } from '@src/utils/common';
import './css/separator.css';

export default function SeparatorHorizontal() {
    const { editorTheme }: MainTheme = useMainThemeContext();
    const theme = useMemo(()=> {
        variableExistsOrThrow(editorTheme?.separatorTheme?.separatorHorizontal);
        return editorTheme?.separatorTheme?.separatorHorizontal;
    },[editorTheme?.separatorTheme?.separatorHorizontal]);

    return <div className={theme} />;
}
