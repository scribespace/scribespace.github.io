import { IconType } from 'react-icons';
import { Icon } from '@/components';
import { TbSpacingVertical } from 'react-icons/tb';

import './css/horizontalBreak.css';

export interface HorizontalBreakTheme {
    HorizontalBreakIcon: IconType;
}

export const HORIZONTAL_BREAK_THEME_DEFAULT: HorizontalBreakTheme = {
    HorizontalBreakIcon: Icon( TbSpacingVertical ),
};
