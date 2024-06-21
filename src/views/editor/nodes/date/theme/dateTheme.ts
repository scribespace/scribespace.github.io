import { EditorThemeClassName, IS_BOLD } from "lexical";
import './css/date.css';

export interface DateTheme {
    style: string;
    format: number;
    outerTagTheme: EditorThemeClassName;
}

export const DATE_THEME_DEFAULT: DateTheme = { 
    style: "fontSize: 13pt", 
    format: IS_BOLD,
    outerTagTheme: 'outerTag',
};
