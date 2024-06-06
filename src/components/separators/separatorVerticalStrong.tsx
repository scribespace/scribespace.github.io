import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { useMemo } from "react";
import "./css/separator.css";

export default function SeparatorVerticalStrong() {
  const { editorTheme }: MainTheme = useMainThemeContext();
  const theme = useMemo(() => {
    return editorTheme.separatorTheme.separatorVerticalStrong;
  }, [editorTheme.separatorTheme.separatorVerticalStrong]);

  return <div className={theme} />;
}
