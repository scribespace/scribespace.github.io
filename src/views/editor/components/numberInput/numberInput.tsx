import { useCallback, useEffect, useMemo, useRef } from "react";
import { IconBaseProps } from "react-icons";

import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { SeparatorVertical } from "@/components/separators";
import { NumberInputTheme } from "./theme";
import { variableExists } from "@/utils";
import { Metric } from "@/utils/types";

interface NumberInputProps {
  type: "text" | "number";
  value: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  useAcceptButton?: boolean;
  supportedUnits?: string[];
  themeOverride?: NumberInputTheme;
  onInputChanged?: (target: HTMLInputElement, change: number) => void;
  onInputAccepted?: (target: HTMLInputElement) => void;
}

export default function NumberInput({
  type,
  value,
  min,
  max,
  disabled,
  useAcceptButton,
  supportedUnits,
  themeOverride,
  onInputChanged,
  onInputAccepted,
}: NumberInputProps) {
  const { editorTheme }: MainTheme = useMainThemeContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const currentValueRef = useRef<string>(value);

  const units: string[] = useMemo(() => {
    if (type == "number") {
      return [""];
    }

    return supportedUnits ? supportedUnits : [""];
  }, [supportedUnits, type]);

  const correctValue = useCallback(
    (value: number): number => {
      if (min) value = Math.max(min, value);
      if (max) value = Math.min(max, value);

      return value;
    },
    [max, min]
  );

  const validateMetric = useCallback(
    (metric: Metric): boolean => {
      if (!metric.isValid() || !units.includes(metric.getUnit())) {
        return false;
      }

      return true;
    },
    [units]
  );

  function processValue(metric: Metric): string {
    if (!validateMetric(metric)) {
      return currentValueRef.current;
    }

    const correctedValue = correctValue(metric.getValue());
    metric.setValue(correctedValue);
    return metric.toString();
  }

  const changeValue = useCallback(
    (change: number) => {
      if (disabled) return;
      if (!inputRef.current) return;

      const valueStr = inputRef.current.value;
      if (valueStr === "") {
        if (onInputChanged) onInputChanged(inputRef.current, change);
        return;
      }

      const metric = Metric.fromString(valueStr);
      if (!validateMetric(metric)) {
        inputRef.current.value = currentValueRef.current;
        return;
      }

      metric.addValue(change);
      const correctedValue = correctValue(metric.value);

      const newValueStr = `${correctedValue}${metric.unit}`;

      inputRef.current.value = newValueStr;
      if (newValueStr != currentValueRef.current) {
        currentValueRef.current = newValueStr;
        if (onInputChanged) onInputChanged(inputRef.current, change);
      }
    },
    [correctValue, disabled, onInputChanged, validateMetric]
  );

  function onAccept() {
    if (disabled) return;
    if (!inputRef.current) return;

    const valueStr = inputRef.current.value;
    const metric = Metric.fromString(valueStr);
    const newValueStr = processValue(metric);
    inputRef.current.value = newValueStr;

    currentValueRef.current = newValueStr;

    if (onInputAccepted) onInputAccepted(inputRef.current);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key == "Enter") {
      onAccept();
      e.preventDefault();
    }
  }

  function onBlur() {
    if (!inputRef.current) return;

    const valueStr = inputRef.current.value;
    const metric = Metric.fromString(valueStr);
    const newValueStr = processValue(metric);
    inputRef.current.value = newValueStr;
    currentValueRef.current = newValueStr;
  }

  const theme = useMemo(() => {
    if (variableExists(themeOverride)) return themeOverride;
    return editorTheme.numberInputTheme;
  }, [editorTheme.numberInputTheme, themeOverride]);

  const disabledTheme = useMemo(() => {
    if (disabled) return "disabled ";
    return "";
  }, [disabled]);

  function DecreaseIcon(props: IconBaseProps) {
    return theme.DecreaseIcon(props);
  }

  function IncreaseIcon(props: IconBaseProps) {
    return theme.IncreaseIcon(props);
  }

  function AcceptIcon(props: IconBaseProps) {
    return theme.AcceptIcon(props);
  }

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.value = value;
    currentValueRef.current = value;
  }, [value]);

  useEffect(() => {
    function onWheel(event: WheelEvent) {
      event.preventDefault();

      if (event.deltaY < 0) changeValue(+1);
      if (event.deltaY > 0) changeValue(-1);
    }

    if (!inputRef.current) return;
    const inputElement = inputRef.current;

    inputElement.addEventListener("wheel", onWheel);
    return () => {
      inputElement.removeEventListener("wheel", onWheel);
    };
  }, [inputRef, changeValue]);

  return (
    <div className={disabledTheme + theme.container}>
      <DecreaseIcon
        className={disabledTheme + theme.controlButton}
        onClick={() => {
          changeValue(-1);
        }}
      />
      <input
        ref={inputRef}
        className={disabledTheme + theme.input}
        type={type}
        defaultValue={value}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        disabled={disabled}
      />
      <IncreaseIcon
        className={disabledTheme + theme.controlButton}
        onClick={() => {
          changeValue(1);
        }}
      />
      {useAcceptButton && (
        <>
          <SeparatorVertical />
          <AcceptIcon
            className={disabledTheme + theme.acceptButton}
            onClick={onAccept}
          />
        </>
      )}
    </div>
  );
}
