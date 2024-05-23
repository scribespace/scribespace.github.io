import { useMainThemeContext } from '@src/mainThemeContext';
import { MainTheme } from '@src/theme';
import { useMemo } from 'react';
import './css/separator.css';

export default function SeparatorVertical() {
    const { editorTheme }: MainTheme = useMainThemeContext();
    const theme = useMemo(()=> {
        return editorTheme.separatorTheme.separatorVertical;
    },[editorTheme.separatorTheme.separatorVertical]);

    return <div className={theme} />;
}