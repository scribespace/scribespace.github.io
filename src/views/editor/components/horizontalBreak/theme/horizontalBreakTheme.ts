import { IconType } from 'react-icons';
import { Icon } from '@/components';
import { LuSplitSquareVertical } from "react-icons/lu";

import './css/horizontalBreak.css';

export interface HorizontalBreakTheme {
    HorizontalBreakIcon: IconType;
}

export const HORIZONTAL_BREAK_THEME_DEFAULT: HorizontalBreakTheme = {
    HorizontalBreakIcon: Icon( LuSplitSquareVertical ),
};
