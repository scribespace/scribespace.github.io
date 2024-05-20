import { useMemo } from "react";
import { EditorThemeClassName } from "lexical";
import { copyExistingValues } from "../../../common";

import './css/separator.css'

export interface SeparatorTheme {
    separatorHorizontal?: EditorThemeClassName;
    separatorHorizontalStrong?: EditorThemeClassName;
    separatorVertical?: EditorThemeClassName;
    separatorVerticalStrong?: EditorThemeClassName;
}

const SEPARATOR_DEFAULT_THEME: SeparatorTheme = {
    separatorHorizontal: 'separator-horizontal-default',
    separatorHorizontalStrong: 'separator-horizontal-strong-default',
    separatorVertical: 'separator-vertical-default',
    separatorVerticalStrong: 'separator-vertical-strong-default',
}

interface SeparatorProps {
    theme?: Partial<SeparatorTheme>;
}

export const SeparatorHorizontalStrong = ({theme}: SeparatorProps) => {
    const currentTheme = useMemo(()=> copyExistingValues(theme, SEPARATOR_DEFAULT_THEME), [theme])
    return <div className={currentTheme.separatorHorizontalStrong} />;
};

export const SeparatorHorizontal = ({theme}: SeparatorProps) => {
    const currentTheme = useMemo(()=> copyExistingValues(theme, SEPARATOR_DEFAULT_THEME), [theme])
    return <div className={currentTheme.separatorHorizontal} />;
};

export const SeparatorVerticalStrong = ({theme}: SeparatorProps) => {
    const currentTheme = useMemo(()=> copyExistingValues(theme, SEPARATOR_DEFAULT_THEME), [theme])
    return <div className={currentTheme.separatorVerticalStrong} />;
};

export const SeparatorVertical = ({theme}: SeparatorProps) => {
    const currentTheme = useMemo(()=> copyExistingValues(theme, SEPARATOR_DEFAULT_THEME), [theme])
    return <div className={currentTheme.separatorVertical} />;
};
