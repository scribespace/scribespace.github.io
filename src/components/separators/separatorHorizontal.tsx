import { useMainThemeContext } from '@/mainThemeContext';
import { MainTheme } from '@/theme';
import { useMemo } from 'react';
import './css/separator.css';

export default function SeparatorHorizontal() {
    const { editorTheme }: MainTheme = useMainThemeContext();
    const theme = useMemo(()=> {
        return editorTheme.separatorTheme.separatorHorizontal;
    },[editorTheme.separatorTheme.separatorHorizontal]);

    return <div className={theme} />;
}
