import { IconType } from 'react-icons';
import { Icon } from '@/components';
import { TbSpacingVertical } from 'react-icons/tb';

import './css/pageBreak.css';
import { EditorThemeClassName } from 'lexical';

export interface PageBreakTheme {
    pageBreakFiller: EditorThemeClassName;
    PageBreakIcon: IconType;
}

export const Page_BREAK_THEME_DEFAULT: PageBreakTheme = {
    pageBreakFiller: 'editor-page-break-filler',
    PageBreakIcon: Icon( TbSpacingVertical ),
};
