import { useMainThemeContext } from '@src/mainThemeContext';
import { MainTheme } from '@src/theme';
import { variableExistsOrThrow } from '@src/utils/common';
import { useMemo } from 'react';
import './css/separator.css';

export default function SeparatorVertical() {
    const { editorTheme }: MainTheme = useMainThemeContext();
    const theme = useMemo(()=> {
        variableExistsOrThrow(editorTheme?.separatorTheme?.separatorVertical);
        return editorTheme?.separatorTheme?.separatorVertical;
    },[editorTheme?.separatorTheme?.separatorVertical]);

    return <div className={theme} />;
}