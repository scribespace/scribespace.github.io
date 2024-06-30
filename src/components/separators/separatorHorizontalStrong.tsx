import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { useMemo } from "react";
import "./css/separator.css";

export default function SeparatorHorizontalStrong() {
  const { editorTheme }: MainTheme = useMainThemeContext();
  const theme = useMemo(() => {
    return editorTheme.separatorTheme.separatorHorizontalStrong;
  }, [editorTheme.separatorTheme.separatorHorizontalStrong]);

  return <div className={theme} />;
}
