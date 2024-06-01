import { useMainThemeContext } from '@/mainThemeContext';
import { MainTheme } from '@/theme';
import { useMemo } from 'react';
import './css/separator.css';

export default function SeparatorVertical() {
    const { editorTheme }: MainTheme = useMainThemeContext();
    const theme = useMemo(()=> {
        return editorTheme.separatorTheme.separatorVertical;
    },[editorTheme.separatorTheme.separatorVertical]);

    return <div className={theme} />;
}