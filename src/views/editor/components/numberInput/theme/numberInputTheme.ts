import { PiCheckSquareOffsetBold } from "react-icons/pi";
import { EditorThemeClassName } from "lexical";
import { IconType } from "react-icons";
import { HiPlusSm, HiMinusSm } from "react-icons/hi";
import { Icon } from "@/components";

export interface NumberInputTheme {
    container: EditorThemeClassName;
    controlButton: EditorThemeClassName;
    acceptButton: EditorThemeClassName;
    input: EditorThemeClassName;

    IncreaseIcon: IconType;
    DecreaseIcon: IconType;
    AcceptIcon: IconType;
}

export const NUMBER_INPUT_THEME_DEFAULT: NumberInputTheme = {
    container: "number-input-editor-container-default",
    controlButton: "number-input-editor-button-default",
    acceptButton: "number-input-editor-button-default",
    input: "number-input-editor-input-default",

    IncreaseIcon: Icon( HiPlusSm ),
    DecreaseIcon: Icon( HiMinusSm ),
    AcceptIcon: Icon( PiCheckSquareOffsetBold ),
};
