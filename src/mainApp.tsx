import '@systems/environment/environmentEvents';
import { fontFromStyle } from "@utils";
import { useEffect, useState } from "react";
import "./css/commonTheme.css";
import "./css/index.css";
import { MainThemeContext } from "./mainThemeContext";
import { MAIN_THEME_DEFAULT, MainTheme } from "./theme";
import { WelcomeView } from "./views/welcomeView";
import { ErrorDialog } from "./components/errorHandling/errorDialog";

export function MainApp() {
  const [mainTheme, setMainTheme] = useState<MainTheme>(MAIN_THEME_DEFAULT);

  useEffect(() => {
    const newTheme = MAIN_THEME_DEFAULT; // Update this when there is more than one theme

    // set defaults
    newTheme.editorTheme.editorInputTheme.defaultFontSize = getComputedStyle(
      document.documentElement,
    ).getPropertyValue("--default-font-size");
    const cssFontFamily = getComputedStyle(
      document.documentElement,
    ).getPropertyValue("--default-font-family");
    newTheme.editorTheme.editorInputTheme.defaultFontFamily =
      fontFromStyle(cssFontFamily);

    setMainTheme(newTheme);
  }, []);

  return (
    <MainThemeContext.Provider value={mainTheme}>
      <WelcomeView />
      <ErrorDialog/>
    </MainThemeContext.Provider>
  );
}
