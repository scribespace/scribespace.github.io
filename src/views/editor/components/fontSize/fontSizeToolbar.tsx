import { MenuItem } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { Metric } from "@/utils/types";
import { useEditorEditable } from "@/views/editor/hooks/useEditorEditable";
import {
  DECREASE_FONT_SIZE_COMMAND,
  FONT_SIZE_CHANGED_COMMAND,
  INCREASE_FONT_SIZE_COMMAND,
  SET_FONT_SIZE_COMMAND,
} from "@/views/editor/plugins/fontPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  COMMAND_PRIORITY_LOW
} from "lexical";
import { useEffect, useState } from "react";
import NumberInput from "../numberInput";

export default function FontSizeToolbar() {
  const [editor] = useLexicalComposerContext();
  const {
    editorTheme: {
      editorInputTheme: { defaultFontSize },
    },
  }: MainTheme = useMainThemeContext();
  const [fontSize, setFontSize] = useState<string>(defaultFontSize);
  const isEditorEditable = useEditorEditable();

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        FONT_SIZE_CHANGED_COMMAND,
        (currentFontSize: string) => {
          setFontSize(currentFontSize);
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [defaultFontSize, editor]);

  const onChange = (_: HTMLInputElement, change: number) => {
    if (change == -1) {
      editor.dispatchCommand(DECREASE_FONT_SIZE_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INCREASE_FONT_SIZE_COMMAND, undefined);
    }
  };

  const onInputAccepted = (target: HTMLInputElement) => {
    const metric = Metric.fromString(target.value);
    metric.setUnit( metric.getUnit() == "" ? "pt" : metric.getUnit() );
    editor.dispatchCommand( SET_FONT_SIZE_COMMAND, metric.toString() );
  };

  return (
    <MenuItem className="">
      <NumberInput
        type="text"
        disabled={!isEditorEditable}
        supportedUnits={["", "pt", "px", "mm"]}
        value={fontSize}
        min={0}
        onInputChanged={onChange}
        onInputAccepted={onInputAccepted}
      />
    </MenuItem>
  );
}
