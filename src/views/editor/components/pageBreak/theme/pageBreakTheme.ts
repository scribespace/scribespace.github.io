import { IconType } from 'react-icons';
import { Icon } from '@/components';
import { TbSpacingVertical } from 'react-icons/tb';

import './css/pageBreak.css';
import { CSSTheme } from '@utils';

export interface PageBreakTheme {
    pageBreakFiller: CSSTheme;
    PageBreakIcon: IconType;
}

export const PAGE_BREAK_THEME_DEFAULT: PageBreakTheme = {
    pageBreakFiller: 'editor-page-break-filler',
    PageBreakIcon: Icon( TbSpacingVertical ),
};
