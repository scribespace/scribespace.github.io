import { IconType } from 'react-icons';
import { GiHelp } from "react-icons/gi";
import './css/shortcuts.css';
import { Icon } from '@/components/icon';
import { EditorThemeClassName } from 'lexical';


export interface ShortcutsTheme {
    container: EditorThemeClassName;
    row: EditorThemeClassName;
    cell: EditorThemeClassName;
    scopeRoot: EditorThemeClassName;
    scopeName: EditorThemeClassName;
    cellsContainer: EditorThemeClassName;
    ShortcutIcon: IconType;
}

export const SHORTCUTS_THEME_DEFAULT: ShortcutsTheme = {
    ShortcutIcon: Icon(GiHelp),
    container: 'shortcuts-container',
    row: 'shortcuts-row',
    cell: 'shortcuts-cell',
    scopeRoot: 'shortcuts-scopeRoot',
    scopeName: 'shortcuts-scopeName',
    cellsContainer: 'shortcuts-cellsContainer',
};

