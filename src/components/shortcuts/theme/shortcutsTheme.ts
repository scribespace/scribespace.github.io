import { IconType } from 'react-icons';
import { GiHelp } from "react-icons/gi";
import './css/shortcuts.css';
import { Icon } from '@/components/icon';
import { CSSTheme } from '@utils';


export interface ShortcutsTheme {
    container: CSSTheme;
    row: CSSTheme;
    cell: CSSTheme;
    scopeRoot: CSSTheme;
    scopeName: CSSTheme;
    cellsContainer: CSSTheme;
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

