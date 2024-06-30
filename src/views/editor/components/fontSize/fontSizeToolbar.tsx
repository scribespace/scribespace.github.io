import { MenuItem } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { Metric } from "@/utils/types";
import { useEditorEditable } from "@/views/editor/hooks/useEditorEditable";
import {
  DECREASE_FONT_SIZE_CMD,
  FONT_SIZE_CHANGED_CMD,
  INCREASE_FONT_SIZE_CMD,
  SET_FONT_SIZE_CMD,
} from "@/views/editor/plugins/fontPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $callCommand, $registerCommandListener } from "@systems/commandsManager/commandsManager";
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
      $registerCommandListener(
        FONT_SIZE_CHANGED_CMD,
        (currentFontSize: string) => {
          setFontSize(currentFontSize);
          return false;
        }
      )
    );
  }, [defaultFontSize, editor]);

  const onChange = (_: HTMLInputElement, change: number) => {
    if (change == -1) {
      $callCommand(DECREASE_FONT_SIZE_CMD, undefined);
    } else {
      $callCommand(INCREASE_FONT_SIZE_CMD, undefined);
    }
  };

  const onInputAccepted = (target: HTMLInputElement) => {
    const metric = Metric.fromString(target.value);
    metric.setUnit( metric.getUnit() == "" ? "pt" : metric.getUnit() );
    $callCommand( SET_FONT_SIZE_CMD, metric.toString() );
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
