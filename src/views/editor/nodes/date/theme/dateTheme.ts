import { IS_BOLD } from "lexical";
import './css/date.css';
import { CSSTheme } from "@utils";

export interface DateTheme {
    style: string;
    format: number;
    outerTagTheme: CSSTheme;
}

export const DATE_THEME_DEFAULT: DateTheme = { 
    style: "fontSize: 13pt", 
    format: IS_BOLD,
    outerTagTheme: 'outerTag',
};
